import { createHash, randomBytes } from "node:crypto";
import { createTable } from "../db/client.ts";
import { isEnabled } from "../lib/flags.ts";
import { newId } from "../lib/ids.ts";
import { INVITE_TTL_MS, inviteStatus, type Invite, type InviteRole } from "../models/invite.ts";
import { canManageMembers, type Member } from "../models/member.ts";
import { addMember, members } from "./member-service.ts";

export const invites = createTable<Invite>();

export type InviteErrorCode = "disabled" | "forbidden" | "already_member" | "invalid_token" | "expired";

export class InviteError extends Error {
	readonly code: InviteErrorCode;

	constructor(code: InviteErrorCode) {
		super(code);
		this.code = code;
	}
}

const hash = (token: string) => createHash("sha256").update(token).digest("hex");

export function createInvite(inviter: Member, email: string, role: InviteRole, now = Date.now()): { invite: Invite; token: string } {
	if (!isEnabled("invitesEnabled")) throw new InviteError("disabled");
	if (!canManageMembers(inviter.role)) throw new InviteError("forbidden");

	const normalized = email.trim().toLowerCase();
	if (members.find((m) => m.teamId === inviter.teamId && m.email === normalized)) throw new InviteError("already_member");

	const open = invites.find((i) => i.teamId === inviter.teamId && i.email === normalized && inviteStatus(i, now) === "pending");
	if (open) invites.update(open.id, { expiresAt: now });

	const token = randomBytes(24).toString("base64url");
	const invite = invites.insert({
		id: newId("inv"),
		teamId: inviter.teamId,
		email: normalized,
		role,
		tokenHash: hash(token),
		invitedBy: inviter.id,
		createdAt: now,
		expiresAt: now + INVITE_TTL_MS,
		acceptedAt: null,
	});
	return { invite, token };
}

export function acceptInvite(token: string, email: string, now = Date.now()): Member {
	const invite = invites.find((i) => i.tokenHash === hash(token));
	if (!invite || invite.email !== email.trim().toLowerCase()) throw new InviteError("invalid_token");
	if (inviteStatus(invite, now) !== "pending") throw new InviteError("expired");

	invites.update(invite.id, { acceptedAt: now });
	return addMember(invite.teamId, invite.email, invite.role, now);
}

export function pendingInvites(teamId: string, now = Date.now()): Invite[] {
	return invites.filter((i) => i.teamId === teamId && inviteStatus(i, now) === "pending");
}

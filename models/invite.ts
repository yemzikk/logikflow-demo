import type { Role } from "./member.ts";

export const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type InviteRole = Exclude<Role, "owner">;

export interface Invite {
	id: string;
	teamId: string;
	email: string;
	role: InviteRole;
	tokenHash: string;
	invitedBy: string;
	createdAt: number;
	expiresAt: number;
	acceptedAt: number | null;
}

export type InviteStatus = "pending" | "accepted" | "expired";

export function inviteStatus(invite: Invite, now = Date.now()): InviteStatus {
	if (invite.acceptedAt !== null) return "accepted";
	if (invite.expiresAt <= now) return "expired";
	return "pending";
}

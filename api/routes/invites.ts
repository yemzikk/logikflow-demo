import type { Route } from "../router.ts";
import type { InviteRole } from "../../models/invite.ts";
import { acceptInvite, createInvite, InviteError, pendingInvites } from "../../services/invite-service.ts";
import { members } from "../../services/member-service.ts";
import { sendInviteEmail } from "../../emails/send.ts";

const STATUS: Record<InviteError["code"], number> = {
	disabled: 404,
	forbidden: 403,
	already_member: 409,
	invalid_token: 400,
	expired: 410,
};

function handle(fn: () => { status: number; body: unknown }) {
	try {
		return fn();
	} catch (err) {
		if (err instanceof InviteError) return { status: STATUS[err.code], body: { error: err.code } };
		throw err;
	}
}

export const inviteRoutes: Route[] = [
	{
		method: "GET",
		path: "/teams/:teamId/invites",
		handler: ({ params }) => ({ status: 200, body: pendingInvites(params.teamId!) }),
	},
	{
		method: "POST",
		path: "/teams/:teamId/invites",
		handler: ({ params, body, userEmail }) =>
			handle(() => {
				const inviter = members.find((m) => m.teamId === params.teamId && m.email === userEmail);
				if (!inviter) throw new InviteError("forbidden");
				const { email, role } = body as { email: string; role: InviteRole };
				const { invite, token } = createInvite(inviter, email, role);
				sendInviteEmail(invite.email, { teamId: invite.teamId, token, invitedBy: inviter.email });
				return { status: 201, body: { id: invite.id, email: invite.email, role: invite.role, expiresAt: invite.expiresAt } };
			}),
	},
	{
		method: "POST",
		path: "/invites/accept",
		handler: ({ body, userEmail }) =>
			handle(() => {
				const { token } = body as { token: string };
				return { status: 200, body: acceptInvite(token, userEmail) };
			}),
	},
];

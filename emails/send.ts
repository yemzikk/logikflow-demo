import { readFileSync } from "node:fs";

const layout = readFileSync(new URL("./layout.html", import.meta.url), "utf8");
const invite = readFileSync(new URL("./invite.html", import.meta.url), "utf8");

export function sendInviteEmail(to: string, data: { teamId: string; token: string; invitedBy: string }): void {
	const link = `https://teamspace.example/invites/accept?token=${encodeURIComponent(data.token)}`;
	const content = invite.replace("{{invitedBy}}", data.invitedBy).replace("{{link}}", link);
	console.log(`[email] to=${to}\n${layout.replace("{{content}}", content)}`);
}

import { useState } from "react";
import strings from "./strings.json";
import type { InviteRole } from "../models/invite.ts";

const ERRORS: Record<string, string> = {
	already_member: strings.invites.errors.alreadyMember,
	forbidden: strings.invites.errors.forbidden,
};

export function InviteDialog({ teamId, onClose, onInvited }: { teamId: string; onClose: () => void; onInvited: () => void }) {
	const [email, setEmail] = useState("");
	const [role, setRole] = useState<InviteRole>("member");
	const [error, setError] = useState<string | null>(null);
	const [sending, setSending] = useState(false);

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		setSending(true);
		setError(null);
		const res = await fetch(`/teams/${teamId}/invites`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, role }),
		});
		setSending(false);
		if (res.ok) {
			onInvited();
			onClose();
			return;
		}
		const body = await res.json().catch(() => ({}));
		setError(ERRORS[body.error] ?? strings.invites.errors.generic);
	}

	return (
		<dialog open aria-labelledby="invite-title">
			<form onSubmit={submit}>
				<h2 id="invite-title">{strings.invites.title}</h2>
				<label>
					{strings.invites.email}
					<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
				</label>
				<label>
					{strings.invites.role}
					<select value={role} onChange={(e) => setRole(e.target.value as InviteRole)}>
						<option value="member">{strings.roles.member}</option>
						<option value="admin">{strings.roles.admin}</option>
					</select>
				</label>
				{error && <p role="alert">{error}</p>}
				<footer>
					<button type="button" onClick={onClose}>{strings.invites.cancel}</button>
					<button type="submit" disabled={sending}>{sending ? strings.invites.sending : strings.invites.send}</button>
				</footer>
			</form>
		</dialog>
	);
}

import { useCallback, useEffect, useState } from "react";
import strings from "./strings.json";
import { flags } from "../lib/flags.ts";
import type { Invite } from "../models/invite.ts";
import { canManageMembers, type Member, type Role } from "../models/member.ts";
import { InviteDialog } from "./InviteDialog.tsx";

export function MembersPage({ teamId, viewerRole }: { teamId: string; viewerRole: Role }) {
	const [members, setMembers] = useState<Member[]>([]);
	const [invites, setInvites] = useState<Invite[]>([]);
	const [inviting, setInviting] = useState(false);
	const canInvite = flags.invitesEnabled && canManageMembers(viewerRole);

	const load = useCallback(() => {
		fetch(`/teams/${teamId}/members`)
			.then((r) => r.json())
			.then(setMembers);
		if (canInvite) {
			fetch(`/teams/${teamId}/invites`)
				.then((r) => r.json())
				.then(setInvites);
		}
	}, [teamId, canInvite]);

	useEffect(load, [load]);

	return (
		<section>
			<header>
				<h1>{strings.members.title}</h1>
				{canInvite && <button onClick={() => setInviting(true)}>{strings.invites.open}</button>}
			</header>
			<ul>
				{members.map((m) => (
					<li key={m.id}>
						{m.email} <span>{strings.roles[m.role]}</span>
					</li>
				))}
			</ul>
			{invites.length > 0 && (
				<>
					<h2>{strings.invites.pending}</h2>
					<ul>
						{invites.map((i) => (
							<li key={i.id}>
								{i.email} <span>{strings.roles[i.role]}</span>
							</li>
						))}
					</ul>
				</>
			)}
			{inviting && <InviteDialog teamId={teamId} onClose={() => setInviting(false)} onInvited={load} />}
		</section>
	);
}

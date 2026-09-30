import { useEffect, useState } from "react";
import strings from "./strings.json";
import type { Member } from "../models/member.ts";

export function MembersPage({ teamId }: { teamId: string }) {
	const [members, setMembers] = useState<Member[]>([]);

	useEffect(() => {
		fetch(`/teams/${teamId}/members`)
			.then((r) => r.json())
			.then(setMembers);
	}, [teamId]);

	return (
		<section>
			<header>
				<h1>{strings.members.title}</h1>
			</header>
			<ul>
				{members.map((m) => (
					<li key={m.id}>
						{m.email} <span>{strings.roles[m.role]}</span>
					</li>
				))}
			</ul>
		</section>
	);
}

import { createTable } from "../db/client.ts";
import { newId } from "../lib/ids.ts";
import type { Member, Role } from "../models/member.ts";

export const members = createTable<Member>();

export function listMembers(teamId: string): Member[] {
	return members.filter((m) => m.teamId === teamId);
}

export function addMember(teamId: string, email: string, role: Role, now = Date.now()): Member {
	const existing = members.find((m) => m.teamId === teamId && m.email === email.toLowerCase());
	if (existing) return existing;
	return members.insert({ id: newId("mem"), teamId, email: email.toLowerCase(), role, joinedAt: now });
}

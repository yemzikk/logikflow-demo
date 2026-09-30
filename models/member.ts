export type Role = "owner" | "admin" | "member";

export interface Member {
	id: string;
	teamId: string;
	email: string;
	role: Role;
	joinedAt: number;
}

export function canManageMembers(role: Role): boolean {
	return role === "owner" || role === "admin";
}

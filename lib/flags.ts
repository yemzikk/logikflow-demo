export const flags = {
	auditLog: true,
	invitesEnabled: false,
	newBilling: false,
} as const;

export type FlagName = keyof typeof flags;

export function isEnabled(name: FlagName): boolean {
	return flags[name];
}

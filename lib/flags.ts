export const flags = {
	auditLog: true,
	newBilling: false,
} as const;

export type FlagName = keyof typeof flags;

export function isEnabled(name: FlagName): boolean {
	return flags[name];
}

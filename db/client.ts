export interface Table<T extends { id: string }> {
	insert(row: T): T;
	find(predicate: (row: T) => boolean): T | undefined;
	filter(predicate: (row: T) => boolean): T[];
	update(id: string, patch: Partial<T>): T | undefined;
}

export function createTable<T extends { id: string }>(): Table<T> {
	const rows = new Map<string, T>();
	return {
		insert(row) {
			rows.set(row.id, row);
			return row;
		},
		find(predicate) {
			return [...rows.values()].find(predicate);
		},
		filter(predicate) {
			return [...rows.values()].filter(predicate);
		},
		update(id, patch) {
			const row = rows.get(id);
			if (!row) return undefined;
			const next = { ...row, ...patch };
			rows.set(id, next);
			return next;
		},
	};
}

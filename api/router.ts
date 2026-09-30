import { membersRoutes } from "./routes/members.ts";

export interface Route {
	method: "GET" | "POST" | "DELETE";
	path: string;
	handler: (req: { params: Record<string, string>; body?: unknown; userEmail: string }) => { status: number; body: unknown };
}

export const routes: Route[] = [...membersRoutes];

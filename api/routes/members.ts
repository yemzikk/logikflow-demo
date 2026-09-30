import type { Route } from "../router.ts";
import { listMembers } from "../../services/member-service.ts";

export const membersRoutes: Route[] = [
	{
		method: "GET",
		path: "/teams/:teamId/members",
		handler: ({ params }) => ({ status: 200, body: listMembers(params.teamId!) }),
	},
];

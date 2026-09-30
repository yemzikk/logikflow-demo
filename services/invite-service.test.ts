import { beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { flags } from "../lib/flags.ts";
import { INVITE_TTL_MS } from "../models/invite.ts";
import type { Member } from "../models/member.ts";
import { acceptInvite, createInvite, InviteError, pendingInvites } from "./invite-service.ts";
import { addMember } from "./member-service.ts";

let owner: Member;
let teamCounter = 0;

beforeEach(() => {
	(flags as { invitesEnabled: boolean }).invitesEnabled = true;
	owner = addMember(`team_${++teamCounter}`, "owner@example.com", "owner");
});

describe("createInvite", () => {
	it("rejects when the flag is off", () => {
		(flags as { invitesEnabled: boolean }).invitesEnabled = false;
		assert.throws(() => createInvite(owner, "new@example.com", "member"), (e: unknown) => e instanceof InviteError && e.code === "disabled");
	});

	it("only lets owners and admins invite", () => {
		const member = addMember(owner.teamId, "plain@example.com", "member");
		assert.throws(() => createInvite(member, "new@example.com", "member"), (e: unknown) => e instanceof InviteError && e.code === "forbidden");
	});

	it("replaces an open invite for the same email", () => {
		createInvite(owner, "New@Example.com", "member");
		createInvite(owner, "new@example.com", "admin");
		const open = pendingInvites(owner.teamId);
		assert.equal(open.length, 1);
		assert.equal(open[0]!.role, "admin");
	});
});

describe("acceptInvite", () => {
	it("adds the member and closes the invite", () => {
		const { token } = createInvite(owner, "new@example.com", "member");
		const member = acceptInvite(token, "new@example.com");
		assert.equal(member.role, "member");
		assert.equal(pendingInvites(owner.teamId).length, 0);
	});

	it("rejects expired invites", () => {
		const { token } = createInvite(owner, "late@example.com", "member", 0);
		assert.throws(() => acceptInvite(token, "late@example.com", INVITE_TTL_MS + 1), (e: unknown) => e instanceof InviteError && e.code === "expired");
	});

	it("rejects a token used with another email", () => {
		const { token } = createInvite(owner, "right@example.com", "member");
		assert.throws(() => acceptInvite(token, "wrong@example.com"), (e: unknown) => e instanceof InviteError && e.code === "invalid_token");
	});
});

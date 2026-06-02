import { isAdminRequest } from "@/lib/auth/admin-guard";
import type { NextRequest } from "next/server";

const openapi = {
  openapi: "3.0.1",
  info: {
    title: "Smart Value Mireacoin - Admin API",
    version: "1.0.0",
    description: "Minimal OpenAPI spec for core admin endpoints used by the project.",
  },
  servers: [{ url: "/" }],
  paths: {
    "/api/admin/beta-applications": {
      get: {
        summary: "List beta applications",
        responses: { "200": { description: "OK", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/BetaApplication" } } } } } },
      },
      post: {
        summary: "Create a beta application",
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/BetaApplicationCreate" } } } },
        responses: { "201": { description: "Created" } },
      },
    },
    "/api/admin/beta-applications/{id}/action": {
      post: {
        summary: "Perform action on application (approve/reject)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { content: { "application/json": { schema: { type: "object", properties: { action: { type: "string", enum: ["approve", "reject"] }, note: { type: "string" } } } } } },
        responses: { "200": { description: "OK" } },
      },
    },
    "/api/admin/analytics": {
      get: { summary: "Admin analytics snapshot", responses: { "200": { description: "OK" } } },
    },
    "/api/admin/reports": {
      get: { summary: "List reports", responses: { "200": { description: "OK" } } },
    },
    "/api/admin/users": {
      get: { summary: "List users", responses: { "200": { description: "OK" } } },
    },
  },
  components: {
    schemas: {
      BetaApplication: {
        type: "object",
        properties: { id: { type: "integer" }, email: { type: "string" }, message: { type: "string" }, createdAt: { type: "string", format: "date-time" } },
      },
      BetaApplicationCreate: { type: "object", properties: { email: { type: "string" }, message: { type: "string" } }, required: ["email"] },
      User: { type: "object", properties: { id: { type: "integer" }, email: { type: "string" }, role: { type: "string" } } },
    },
  },
};

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify(openapi), { headers: { "Content-Type": "application/json" } });
}

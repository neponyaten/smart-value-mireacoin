import { isAdminRequest } from "@/lib/auth/admin-guard";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Swagger Admin</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
</head>
<body>
<div id="swagger" />
<script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
<script>
  window.onload = function() {
    SwaggerUIBundle({
      url: '/docs/swagger/spec',
      dom_id: '#swagger',
      presets: [SwaggerUIBundle.presets.apis],
    });
  };
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

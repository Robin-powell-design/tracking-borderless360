const fs = require("fs");
const path = require("path");

const outDir = ".vercel/output";
const staticDir = path.join(outDir, "static");
const fnDir = path.join(outDir, "functions", "_middleware.func");

// Clean and create output dirs
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(staticDir, { recursive: true });
fs.mkdirSync(fnDir, { recursive: true });

// Copy static files
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Files/dirs to copy as static assets
const staticFiles = [
  "index.html",
  "admin.html",
  "search-page.html",
  "tracking-demo.html",
  "multi-package.html",
  "icons",
  "images",
];

for (const file of staticFiles) {
  const src = path.join(".", file);
  const dest = path.join(staticDir, file);
  if (fs.existsSync(src)) {
    copyRecursive(src, dest);
  }
}

// Write middleware edge function
const middlewareCode = `
export default function middleware(request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const [, password] = decoded.split(":");
      if (password === process.env.SITE_PASSWORD) {
        return;
      }
    }
  }

  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Protected Site"',
    },
  });
}
`;

fs.writeFileSync(path.join(fnDir, "index.js"), middlewareCode);

fs.writeFileSync(
  path.join(fnDir, ".vc-config.json"),
  JSON.stringify({
    runtime: "edge",
    entrypoint: "index.js",
  })
);

// Write config
fs.writeFileSync(
  path.join(outDir, "config.json"),
  JSON.stringify({
    version: 3,
    routes: [
      {
        src: "/(.*)",
        middlewarePath: "_middleware",
        continue: true,
      },
    ],
  })
);

console.log("Build complete!");

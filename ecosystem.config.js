// PM2 process configuration for Hostinger VPS.
// Usage on the server:
//   pm2 start ecosystem.config.js
//   pm2 save
//   pm2 startup
const fs = require("fs");
const path = require("path");

const APP_DIR = path.resolve(__dirname);

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[ecosystem] .env not found at ${filePath}`);
    return {};
  }

  const env = {};

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    let value = rawValue.trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

const fileEnv = parseEnvFile(path.join(APP_DIR, ".env"));

if (!fileEnv.NEXTAUTH_SECRET) {
  console.warn(
    "[ecosystem] NEXTAUTH_SECRET is missing from .env — NextAuth will fail in production.",
  );
}

module.exports = {
  apps: [
    {
      name: "vitaro",
      script: "npm",
      args: "start",
      cwd: APP_DIR,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        ...fileEnv,
      },
    },
  ],
};

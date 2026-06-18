// PM2 process configuration for Hostinger VPS.
// Usage on the server:
//   pm2 start ecosystem.config.js
//   pm2 save
//   pm2 startup
module.exports = {
  apps: [
    {
      name: "vitaro",
      script: "npm",
      args: "start",
      // Update this if you deploy to a different path.
      cwd: "/var/www/vitaro",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};

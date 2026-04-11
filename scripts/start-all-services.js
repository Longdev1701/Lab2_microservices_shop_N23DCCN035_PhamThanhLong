const { spawn } = require("child_process");

const services = [
  {
    name: "product-service",
    command: "node",
    args: ["src/index.js"],
    cwd: "product-service",
  },
  {
    name: "auth-service",
    command: "node",
    args: ["src/index.js"],
    cwd: "auth-service",
  },
  {
    name: "order-service",
    command: "node",
    args: ["src/index.js"],
    cwd: "order-service",
  },
  {
    name: "api-gateway",
    command: "node",
    args: ["src/index.js"],
    cwd: "api-gateway",
  },
];

const children = services.map((service) => {
  const child = spawn(service.command, service.args, {
    cwd: service.cwd,
    env: process.env,
    stdio: "pipe",
  });

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`[${service.name}] ${chunk}`);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(`[${service.name}] ${chunk}`);
  });

  child.on("exit", (code, signal) => {
    const reason = signal || code;
    console.error(`[${service.name}] exited with ${reason}`);
    shutdown(code || 1);
  });

  return child;
});

let shuttingDown = false;

const shutdown = (code = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  setTimeout(() => process.exit(code), 1000);
};

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

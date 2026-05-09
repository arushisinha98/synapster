import { writeFileSync } from "node:fs";

const config = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "",
  PASSWORD: process.env.NEXT_PUBLIC_PASSWORD || "",
};

const out = `window.SYNAPSTER_CONFIG = ${JSON.stringify(config, null, 2)};\n`;
writeFileSync("dashboard/config.js", out);

console.log("[build-vercel] wrote dashboard/config.js");
console.log("  API_URL:", config.API_URL || "(empty)");
console.log("  PASSWORD:", config.PASSWORD ? "***set***" : "(empty - gate disabled)");

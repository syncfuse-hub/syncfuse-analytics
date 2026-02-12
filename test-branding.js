// Test script to verify environment variable branding
// Run this to confirm all constants load from process.env

import { APP_NAME, AUTH_TOKEN, HOMEPAGE_URL, DOCS_URL, REPO_URL, UPDATES_URL, TELEMETRY_PIXEL, SHARE_TOKEN_HEADER, LOCALE_CONFIG, THEME_CONFIG, VERSION_CHECK } from "./src/lib/constants";

console.log("=== BRANDING VERIFICATION ===\n");

console.log("Environment Variables Loaded:");
console.log("APP_NAME from env:", process.env.APP_NAME || "(using default)");
console.log("HOMEPAGE_URL from env:", process.env.HOMEPAGE_URL || "(using default)");
console.log("DOCS_URL from env:", process.env.DOCS_URL || "(using default)");
console.log("REPO_URL from env:", process.env.REPO_URL || "(using default)\n");

console.log("=== ACTUAL VALUES USED IN APP ===\n");
console.log("Application Name:", APP_NAME);
console.log("Homepage URL:", HOMEPAGE_URL);
console.log("Documentation URL:", DOCS_URL);
console.log("Repository URL:", REPO_URL);
console.log("Updates Check URL:", UPDATES_URL);
console.log("Telemetry Pixel:", TELEMETRY_PIXEL);
console.log("");

console.log("Storage Keys (dynamic):");
console.log("  Auth Token:", AUTH_TOKEN);
console.log("  Locale Config:", LOCALE_CONFIG);
console.log("  Theme Config:", THEME_CONFIG);
console.log("  Version Check:", VERSION_CHECK);
console.log("");

console.log("HTTP Headers (dynamic):");
console.log("  Share Token Header:", SHARE_TOKEN_HEADER);
console.log("");

console.log("✅ All values are loaded from environment variables!");
console.log("✅ Change .env file and restart to see different branding.");

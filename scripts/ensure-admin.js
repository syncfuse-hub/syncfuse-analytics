/* eslint-disable no-console */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import chalk from "chalk";
import { PrismaClient } from "../generated/prisma/client.js";
import { hashPassword } from "../src/lib/password.js";

const DEFAULT_ADMIN_ID = "41e2b680-648e-4b09-bcd7-3e2b10c06264";

function success(msg) {
  console.log(chalk.greenBright(`✓ ${msg}`));
}

function info(msg) {
  console.log(chalk.blueBright(`ℹ ${msg}`));
}

async function ensureDefaultAdmin() {
  const url = new URL(process.env.DATABASE_URL);
  const adapter = new PrismaPg({ connectionString: url.toString() }, { schema: url.searchParams.get("schema") });
  const prisma = new PrismaClient({ adapter });

  try {
    // Get credentials from environment or use defaults
    const username = process.env.DEFAULT_ADMIN_USERNAME || "syncfuse";
    const password = process.env.DEFAULT_ADMIN_PASSWORD || "syncfuse";
    const hashedPassword = hashPassword(password);

    // Check if default admin user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: DEFAULT_ADMIN_ID },
    });

    if (existingUser) {
      // Update existing admin user if credentials have changed
      await prisma.user.update({
        where: { id: DEFAULT_ADMIN_ID },
        data: {
          username: username,
          password: hashedPassword,
          role: "admin",
        },
      });
      success(`Default admin user updated: ${username}`);
    } else {
      // Create new admin user
      await prisma.user.create({
        data: {
          id: DEFAULT_ADMIN_ID,
          username: username,
          password: hashedPassword,
          role: "admin",
        },
      });
      success(`Default admin user created: ${username}`);
    }

    if (process.env.DEFAULT_ADMIN_USERNAME || process.env.DEFAULT_ADMIN_PASSWORD) {
      info("Using custom credentials from environment variables");
    } else {
      info("Using default credentials (syncfuse/syncfuse)");
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error(chalk.redBright("✗ Error ensuring default admin user:"), error.message);
    process.exit(1);
  }
}

ensureDefaultAdmin();

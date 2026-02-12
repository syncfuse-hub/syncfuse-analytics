/* eslint-disable no-console */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import chalk from "chalk";
import { PrismaClient } from "../generated/prisma/client.js";

const DEFAULT_ADMIN_ID = "41e2b680-648e-4b09-bcd7-3e2b10c06264";
const SALT_ROUNDS = 10;

function hashPassword(password) {
  return bcrypt.hashSync(password, SALT_ROUNDS);
}

function success(msg) {
  console.log(chalk.greenBright(`✓ ${msg}`));
}

function info(msg) {
  console.log(chalk.blueBright(`ℹ ${msg}`));
}

function warning(msg) {
  console.log(chalk.yellowBright(`⚠ ${msg}`));
}

function validatePassword(password) {
  if (password.length < 8) {
    warning("Password is less than 8 characters. Consider using a stronger password.");
  }
  if (password === "syncfuse" || password === "admin" || password === "password") {
    warning("You are using a common/default password. This is insecure for production!");
  }
}

async function ensureDefaultAdmin() {
  const url = new URL(process.env.DATABASE_URL);
  const adapter = new PrismaPg({ connectionString: url.toString() }, { schema: url.searchParams.get("schema") });
  const prisma = new PrismaClient({ adapter });

  try {
    // Get credentials from environment or use defaults
    const username = process.env.DEFAULT_ADMIN_USERNAME || "syncfuse";
    const password = process.env.DEFAULT_ADMIN_PASSWORD || "syncfuse";
    
    // Validate password security
    validatePassword(password);
    
    // Warn about default credentials
    if (!process.env.DEFAULT_ADMIN_USERNAME && !process.env.DEFAULT_ADMIN_PASSWORD) {
      warning("Using default credentials (syncfuse/syncfuse)");
      warning("SECURITY RISK: Change these credentials immediately in production!");
      if (process.env.NODE_ENV === "production") {
        console.error(chalk.redBright("✗ CRITICAL: Default credentials detected in production environment!"));
        console.error(chalk.redBright("  Set DEFAULT_ADMIN_USERNAME and DEFAULT_ADMIN_PASSWORD in your environment."));
      }
    }
    
    const hashedPassword = hashPassword(password);

    // Check if default admin user exists
    const existingUser = await prisma.use (username: ***)`);
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
      success(`Default admin user created (username: ***)`);
    }

    if (process.env.DEFAULT_ADMIN_USERNAME || process.env.DEFAULT_ADMIN_PASSWORD) {
      info("Using custom credentials from environment variables
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

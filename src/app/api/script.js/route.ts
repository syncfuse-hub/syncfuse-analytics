import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

/**
 * Dynamic script.js endpoint that injects APP_NAME at runtime
 * This allows changing branding without rebuilding the tracker
 */
export async function GET(request: NextRequest) {
  try {
    // Read the compiled tracker script
    const scriptPath = path.join(process.cwd(), "public", "script.js");
    let script = fs.readFileSync(scriptPath, "utf-8");

    // Replace the tracker name placeholder with actual APP_NAME
    const appName = (process.env.APP_NAME || "syncfuse").toLowerCase();
    script = script.replace(/__TRACKER_NAME__/g, appName);

    // Return as JavaScript with caching headers
    return new NextResponse(script, {
      status: 200,
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        "X-Tracker-Name": appName, // For debugging
      },
    });
  } catch (error) {
    return new NextResponse("// Tracker script not found", {
      status: 404,
      headers: {
        "Content-Type": "application/javascript",
      },
    });
  }
}

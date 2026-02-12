import type { Metadata } from "next";
import { SettingsLayout } from "./SettingsLayout";

export default function ({ children }) {
  if (process.env.cloudMode) {
    return null;
  }

  return <SettingsLayout>{children}</SettingsLayout>;
}

export const metadata: Metadata = {
  title: {
    template: `%s | Settings | ${process.env.APP_NAME || "Syncfuse"}`,
    default: `Settings | ${process.env.APP_NAME || "Syncfuse"}`,
  },
};

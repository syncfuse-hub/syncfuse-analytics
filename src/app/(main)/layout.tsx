import type { Metadata } from "next";
import { Suspense } from "react";
import { App } from "./App";

export default function ({ children }) {
  return (
    <Suspense>
      <App>{children}</App>
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: {
    template: `%s | ${process.env.APP_NAME || "Syncfuse"}`,
    default: process.env.APP_NAME || "Syncfuse",
  },
};

"use client";

import { routes } from "@/routes";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div>
      <span>This is login page</span>

      <button
        onClick={() => signIn("azure-ad-b2c", {
          callbackUrl: routes.dashboard.url,
        })}
        type="button"
      >
        Sign in
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      setStatus("error");
      setErrorMessage(error);
      toast.error("Authentication failed", {
        description: error,
      });
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    if (!token) {
      setStatus("error");
      setErrorMessage("No authentication token received");
      toast.error("Authentication failed", {
        description: "No authentication token received",
      });
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    // Verify state matches (CSRF protection)
    const savedState = sessionStorage.getItem("oauth_state");
    if (state && savedState && state !== savedState) {
      setStatus("error");
      setErrorMessage("State mismatch - possible CSRF attack");
      toast.error("Authentication failed", {
        description: "Security verification failed. Please try again.",
      });
      sessionStorage.removeItem("oauth_state");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    // Clear the saved state
    sessionStorage.removeItem("oauth_state");

    // Store the token
    localStorage.setItem("token", token);
    setStatus("success");

    toast.success("Welcome!", {
      description: "You have been signed in successfully.",
    });

    // Redirect to home
    router.push("/");
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        {status === "loading" && (
          <>
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-gray-100" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Completing sign in...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <svg
                className="h-6 w-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sign in successful! Redirecting...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <svg
                className="h-6 w-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-sm text-red-500 dark:text-red-400">
              {errorMessage}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Redirecting to login...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

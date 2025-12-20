"use client";

import { useCallback } from "react";
import { useAuth } from "@/src/context";
import { useRouter } from "next/navigation";

/**
 * Custom hook that provides a fetch function with automatic JWT refresh handling.
 * If a request returns 401, it will attempt to refresh the access token and retry.
 * If refresh fails, the user is logged out and redirected to login.
 */
export function useAuthFetch() {
  const { token, refreshAccessToken, logout } = useAuth();
  const router = useRouter();

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      // Add authorization header
      const headers = new Headers(options.headers);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      // Make the initial request
      let response = await fetch(url, { ...options, headers });

      // If 401 Unauthorized, try to refresh the token
      if (response.status === 401) {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
          // Get the new token from localStorage (since state might not be updated yet)
          const newToken = localStorage.getItem("buzzer_access_token");
          if (newToken) {
            headers.set("Authorization", `Bearer ${newToken}`);
            // Retry the request with new token
            response = await fetch(url, { ...options, headers });
          }
        } else {
          // Refresh failed, logout and redirect
          await logout();
          router.push("/login");
        }
      }

      return response;
    },
    [token, refreshAccessToken, logout, router]
  );

  return authFetch;
}

export default useAuthFetch;

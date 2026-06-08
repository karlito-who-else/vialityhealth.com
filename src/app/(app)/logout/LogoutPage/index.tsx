"use client";

import { Link } from "@/components/atoms/Link";
import React, { Fragment, useEffect, useState } from "react";

import { useAuth } from "@/providers/Auth";

export const LogoutPage: React.FC = (_props) => {
  const { logout } = useAuth();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        setSuccess("Logged out successfully.");
      } catch (_error) {
        console.error("Logout error:", _error);
        setError("You are already logged out.");
      }
    };

    void performLogout();
  }, [logout]);

  return (
    <Fragment>
      {(error || success) && (
        <div className="prose dark:prose-invert prose:h1:text-lg px-4">
          <h1>{error || success}</h1>
          <p>
            What would you like to do next?
            <Fragment>
              {" "}
              <Link href="/search">Click here</Link>
              {` to shop.`}
            </Fragment>
            {` To log back in, `}
            <Link href="/login">click here</Link>.
          </p>
        </div>
      )}
    </Fragment>
  );
};

"use client";

import { useEcommerce } from "@payloadcms/plugin-ecommerce/client/react";
import { useEffect, useRef } from "react";

import { useAuth } from "@/providers/Auth";

export const EcommerceAuthBridge: React.FC = () => {
  const { user } = useAuth();
  const { onLogin, onLogout } = useEcommerce();
  const lastUserIdRef = useRef<number | string | null | undefined>(undefined);

  useEffect(() => {
    const currentUserId = user?.id ?? null;
    const previousUserId = lastUserIdRef.current;

    if (currentUserId && currentUserId !== previousUserId) {
      void onLogin();
    } else if (!currentUserId && previousUserId) {
      onLogout();
    }

    lastUserIdRef.current = currentUserId;
  }, [user, onLogin, onLogout]);

  return null;
};

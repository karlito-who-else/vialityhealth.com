"use client";

import React, { createContext, useContext } from "react";

import type { Theme } from "@/providers/Theme/types";

export interface ContextType {
  headerTheme?: Theme | null;
  setHeaderTheme: (theme: Theme | undefined) => void;
}

const initialContext: ContextType = {
  headerTheme: "light",
  setHeaderTheme: () => null,
};

const HeaderThemeContext = createContext(initialContext);

export const HeaderThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <HeaderThemeContext.Provider value={initialContext}>{children}</HeaderThemeContext.Provider>;
};

export const useHeaderTheme = (): ContextType => useContext(HeaderThemeContext);

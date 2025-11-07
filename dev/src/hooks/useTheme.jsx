import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
      root.style.setProperty("--bg", "11 11 18");
      root.style.setProperty("--fg", "229 231 235");
      root.style.setProperty("--muted", "20 20 30");
      root.style.setProperty("--card", "16 16 24");
      root.style.setProperty("--border", "37 37 50");
    } else {
      root.classList.remove("dark");
      root.style.setProperty("--bg", "255 255 255");
      root.style.setProperty("--fg", "17 24 39");
      root.style.setProperty("--muted", "249 250 251");
      root.style.setProperty("--card", "255 255 255");
      root.style.setProperty("--border", "229 231 235");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  }
  return context;
}
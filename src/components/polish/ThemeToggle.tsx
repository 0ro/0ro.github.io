import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "polish-flashcards-theme";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return null;
}

function applyTheme(theme: Theme) {
  const app = document.querySelector(".polish-app");
  if (app) {
    app.setAttribute("data-theme", theme);
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const stored = getStoredTheme();
    const initial = stored ?? getSystemTheme();
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    if (mounted) {
      applyTheme(theme);
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <button className="theme-toggle" aria-label="Toggle theme">
        <span style={{ opacity: 0 }}>Light</span>
      </button>
    );
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${
        theme === "light" ? "dark" : "light"
      } mode`}
    >
      {theme === "light" ? "Dark" : "Light"}
    </button>
  );
}

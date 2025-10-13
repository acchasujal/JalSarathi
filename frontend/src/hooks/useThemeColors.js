import { useEffect, useState } from "react";

export default function useThemeColors() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return {
    isDarkMode,
    textColor: isDarkMode ? "#E5E7EB" : "#111827",
    gridColor: isDarkMode ? "#374151" : "#E5E7EB",
    tooltipBg: isDarkMode ? "#1F2937" : "#FFFFFF",
    tooltipText: isDarkMode ? "#F3F4F6" : "#111827",
    primary: isDarkMode ? "#38BDF8" : "#3B82F6",
  };
}

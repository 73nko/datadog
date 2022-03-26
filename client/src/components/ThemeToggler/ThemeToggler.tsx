import { useState, useEffect } from "react";
import "./themeToggler.css";

const ThemeToggler = (): JSX.Element => {
  const [theme, setTheme] = useState("light");
  const nextTheme = theme === "light" ? "dark" : "light";

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="toggler">
      <input
        onChange={() => setTheme(nextTheme)}
        type="checkbox"
        id="themeToggler"
      />
      <label htmlFor="themeToggler" />
    </div>
  );
};

export default ThemeToggler;

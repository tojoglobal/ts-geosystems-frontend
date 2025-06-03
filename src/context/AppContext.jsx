/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

export const AppContext = createContext(null);
const LOCK_KEY = "app_screen_locked";

export const AppProvider = ({ children }) => {
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_OPEN_APIURL);
  const [showSearch, setShowSearch] = useState(false);
  // const [locked, setLocked] = useState(false);

  // Initialize lock state from localStorage on first render
  const [locked, setLocked] = useState(() => {
    return localStorage.getItem(LOCK_KEY) === "true";
  });

  // Keep localStorage in sync with lock state
  useEffect(() => {
    if (locked) {
      localStorage.setItem(LOCK_KEY, "true");
    } else {
      localStorage.removeItem(LOCK_KEY);
    }
  }, [locked]);

  const lockScreen = useCallback(() => setLocked(true), []);
  const unlockScreen = useCallback(() => setLocked(false), []);

  // dark system set up
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const value = useMemo(
    () => ({
      apiUrl,
      setApiUrl,
      showSearch,
      setShowSearch,
      darkMode,
      setDarkMode,
      toggleDarkMode,
      locked,
      lockScreen,
      unlockScreen,
    }),
    [apiUrl, showSearch, darkMode, locked, lockScreen, unlockScreen]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

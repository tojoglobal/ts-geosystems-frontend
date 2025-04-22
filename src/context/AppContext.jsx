import { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_OPEN_APIURL);
  const [showSearch, setShowSearch] = useState(false);

  const value = useMemo(
    () => ({ apiUrl, setApiUrl, showSearch, setShowSearch }),
    [apiUrl, showSearch]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

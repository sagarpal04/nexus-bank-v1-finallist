import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState("");
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    let timer;

    if (isAuthenticated) {
      setRemainingTime(900);
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsAuthenticated("");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        remainingTime,
        setRemainingTime,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

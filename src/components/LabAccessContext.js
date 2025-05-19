import React, { createContext, useContext, useState } from 'react';

const LabAccessContext = createContext();

export const LabAccessProvider = ({ children }) => {
  const [canAccessLab, setCanAccessLab] = useState(false);
  return (
    <LabAccessContext.Provider value={{ canAccessLab, setCanAccessLab }}>
      {children}
    </LabAccessContext.Provider>
  );
};

export const useLabAccess = () => useContext(LabAccessContext);

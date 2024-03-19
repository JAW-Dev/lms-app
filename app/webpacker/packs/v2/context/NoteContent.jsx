import React, { createContext, useContext, useState } from 'react';

const NoteContentContext = createContext();

export const useNotesContent = () => {
  return useContext(NoteContentContext);
};

export const NoteContentProvider = ({ children }) => {
  const [showEditorMobile, setShowEditorMobile] = useState(false);

  return (
    <NoteContentContext.Provider
      value={{ showEditorMobile, setShowEditorMobile }}
    >
      {children}
    </NoteContentContext.Provider>
  );
};

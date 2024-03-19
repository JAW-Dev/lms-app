import { csrfToken } from '@rails/ujs';
import React, { useState, createContext, useEffect } from 'react';

const ContentContext = createContext();

function ContentProvider({ children }) {
  const [contentData, setContentData] = useState({ isLoading: true });
  const [showModal, setShowModal] = useState(false);

  const setModule = async ({ module, behavior }) => {
    const currBehavior = behavior || module.behaviors[0];
    const behaviorId = behavior ? behavior.id : module.behaviors[0].id;

    const behaviorData = await fetch('/api/v1/behaviors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': csrfToken(),
      },
      body: JSON.stringify({ behaviors: { id: behaviorId } }),
    });

    currBehavior.bundle = await behaviorData.json();
    setContentData({
      module,
      behavior: currBehavior,
      isLoading: false,
    });
    setShowModal(true);
  };

  useEffect(() => {
    if (contentData.behavior && contentData.module) {
      localStorage.setItem(
        'latestVideo',
        JSON.stringify({
          module: contentData.module,
          behavior: contentData.behavior,
        })
      );
    }
  }, [contentData]);

  return (
    <ContentContext.Provider
      value={{
        contentData,
        setModule,
        setContentData,
        showModal,
        setShowModal,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export { ContentContext, ContentProvider };

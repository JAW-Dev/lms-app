import React from 'react'; 

const PageLoading = () => {
  return (
    <div className="w-screen h-screen sticky top-0 left-0 overflow-hidden flex items-center justify-center bg-white-faint">
      <div id="outer">
        <div id="middle">
          <div id="inner"></div>
        </div>
      </div>
    </div>
  );
};

export default PageLoading;

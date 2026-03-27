import React from 'react';

const LoadingScreen = ({
  message = 'Loading...',
  fullScreen = true,
  coverPage = false,
}) => {
  const containerClass = coverPage
    ? 'fixed inset-0 z-[100]'
    : fullScreen
      ? 'min-h-screen'
      : 'min-h-[calc(100vh-4rem)]';

  return (
    <div
      className={`${containerClass} bg-gradient-to-b from-blue-50 via-white to-blue-100 flex items-center justify-center px-4`}
    >
      <div className="text-center">
        <img
          src="/assets/ce/logo.png"
          alt="IIT Indore logo"
          className="h-20 w-20 object-contain mx-auto"
        />

        <h1 className="mt-4 text-lg font-semibold text-blue-900">
          IIT Indore Civil Engineering
        </h1>

        <div className="mt-4 flex items-center justify-center gap-2 text-blue-700">
          <span className="inline-block h-4 w-4 rounded-full border-2 border-blue-200 border-t-blue-700 animate-spin" />
          <p className="text-sm font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
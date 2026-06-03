import './index.css';

import { navigateTo } from '@devvit/web/client';
import { context, requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

export const Splash = () => {
  return (
    <div className="flex relative flex-col justify-center items-center min-h-screen gap-4 bg-white dark:bg-gray-900 px-6">
      <img
        className="object-contain w-1/3 max-w-[180px] mx-auto"
        src="/snoo.png"
        alt="Snoo"
      />
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          ChefAid Food Radar
        </h1>
        <p className="text-base text-center text-gray-600 dark:text-gray-300 max-w-sm">
          Top posts this month from pizza, ramen, sushi, burgers, and 20+ culinary
          communities.
        </p>
      </div>
      <div className="flex items-center justify-center mt-3">
        <button
          className="flex items-center justify-center bg-[#d93900] dark:bg-orange-600 text-white w-auto h-10 rounded-full cursor-pointer transition-colors px-5 hover:bg-[#c23300] dark:hover:bg-orange-700 font-medium"
          onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
        >
          View trends
        </button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {context.username ? `Hi u/${context.username}` : 'Tap to expand'}
      </p>
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 text-[0.8em] text-gray-600 dark:text-gray-400">
        <button
          className="cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
          onClick={() => navigateTo('https://www.reddit.com/r/pizza')}
        >
          r/pizza
        </button>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <button
          className="cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
          onClick={() => navigateTo('https://www.reddit.com/r/ramen')}
        >
          r/ramen
        </button>
      </footer>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);

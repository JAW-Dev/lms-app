import React, { useEffect, useState } from 'react';
import Text from './Text';

const LinearProgressBar = ({ module, className }) => {
  const { behaviors } = module;

  const [isLoading, setIsLoading] = useState(true);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (!behaviors) return;
    const behaviorsCount = behaviors.length;
    const completedCount = behaviors.reduce(
      (acc, behavior) => (behavior.completed ? acc + 1 : acc),
      0
    );
    setProgressPercent(Math.round((completedCount / behaviorsCount) * 100));
    setIsLoading(false);
  }, [module]);

  const text = (
    <Text size="p" variant="p" className="mb-3">
      {progressPercent === 100
        ? "You've completed this module."
        : `You've completed ${progressPercent}% so far!`}
    </Text>
  );

  return (
    <div className={`flex flex-col ${className}`}>
      {!isLoading && text}
      <div className="linear-progress-bar h-3 bg-white relative">
        <div
          className="linear-progress-bar__progress h-full absolute pin-l pin-t bg-green-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default LinearProgressBar;

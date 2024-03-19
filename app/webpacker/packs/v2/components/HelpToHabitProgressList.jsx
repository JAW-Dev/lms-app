import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { h2hAPI } from '../api';

export const HelpToHabitProgressBar = ({
  num,
  denom,
  className,
  disableRatio,
}) => {
  const [progressPercent, setProgressPercent] = useState(
    Math.round((num / denom) * 100)
  );

  return (
    <div className={`flex items-center w-full ${className}`}>
      {!disableRatio && (
        <p className="text-gray-dark mr-2">
          {num}/{denom}
        </p>
      )}
      <div className="linear-progress-bar h-3 bg-gray-lightest relative w-full">
        <div
          className="linear-progress-bar__progress h-full absolute pin-l pin-t bg-green-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

function ProgressCard({
  progress,
  queue_position,
  behavior_title,
  total_content,
  poster: {
    small: { url: poster },
  },
}) {
  const progressText =
    queue_position === 1
      ? 'Current'
      : queue_position === 2
      ? 'Up Next'
      : `Queue: ${queue_position}`;

  return (
    <div
      style={{ boxShadow: ' rgba(0, 0, 0, 0.16) 0px 1px 4px' }}
      className="flex items-start p-4 rounded-lg "
    >
      <div
        style={{ minWidth: '32px' }}
        className="h-8 w-8 rounded-full relative mr-4 overflow-hidden"
      >
        <img
          src={poster}
          alt={behavior_title}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="mr-4">
        <h6 className="text-link-purple font-semibold mb-1 text-base">
          {behavior_title}
        </h6>
        <p className="text-sembiold text-gray-dark">{progressText}</p>
      </div>
      <div style={{ minWidth: '33.33%' }} className="w-1/3 ml-auto">
        <HelpToHabitProgressBar num={progress} denom={total_content} />
      </div>
    </div>
  );
}

function ProgressCardSkeleton() {
  return (
    <>
      <div className="flex items-start p-4 rounded-lg">
        <div
          style={{ minWidth: '32px' }}
          className="h-8 w-8 rounded-full relative mr-4 overflow-hidden loading-colors"
        />

        <div className="h-12 w-full rounded-lg loading-colors " />
      </div>
      <div className="flex items-start p-4 rounded-lg">
        <div
          style={{ minWidth: '32px' }}
          className="h-8 w-8 rounded-full relative mr-4 overflow-hidden loading-colors"
        />

        <div className="h-12 w-full rounded-lg loading-colors " />
      </div>
    </>
  );
}

export default function HelpToHabitProgressList() {
  const { data, isLoading } = useQuery('userHelpToHabitProgress', () =>
    h2hAPI.getProgresses()
  );

  return (
    <div style={{ gap: '12px' }} className="flex flex-col">
      {!!data?.length && !isLoading ? (
        data.map((h) => <ProgressCard key={h} {...h} />)
      ) : (
        <ProgressCardSkeleton />
      )}
    </div>
  );
}

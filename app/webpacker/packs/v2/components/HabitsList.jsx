import React from 'react';
import HabitCard from './HabitCard';

const HabitsList = ({ list }) => {
  return (
    <div className="">
      {list.map((course) => (
        <div key={course.id} className="">
          <span className="font-extrabold font-sans text-xs text-grey-dark mb-1">
            {course.title}
          </span>

          {course.behaviors.map((behavior) => (
            <div key={behavior.id} className="mb-12">
              <span className="text-charcoal font-extrabold font-sans mb-8 flex">
                {behavior.title}
              </span>
              {behavior.behavior_maps.map((behaviorMap, index) => (
                <>
                  {index !== 0 && (
                    <span className=" flex w-full h-px bg-gray-dark my-6" />
                  )}
                  <HabitCard
                    key={behaviorMap.id}
                    habit={behaviorMap}
                    imgShadow
                  />
                </>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HabitsList;

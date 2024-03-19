import React, { useContext } from 'react';
import Container from './Container';
import PlayButton from './PlayButton';

import AudioIcon from '../../../../assets/images/reskin-images/icon--audio.svg';
import HelpToHabitImg from '../../../../assets/images/reskin-images/img--help-to-habit.png';
import HelpToHabitIcon from '../../../../assets/images/reskin-images/img--eye-person.svg';
import { ContentContext } from '../context/ContentContext';

const ReminderCard = ({
  style,
  children,
  className,
  title,
  buttonText,
  buttonOnClick,
  href,
}) => {
  const El = href ? 'a' : 'button';

  return (
    <div
      style={{
        ...style,
      }}
      className={`reminder-card p-0 sm:p-8 ${className} bg-white-faint sm:bg-white flex flex-col`}
    >
      <div className="flex w-full items-center justify-between mb-6">
        <h4 className="font-sans font-black text-purple-500">{title}</h4>
        <El
          onClick={() => buttonOnClick()}
          type="button"
          className="font-sans font-black text-link-purple"
          href={href}
        >
          {buttonText}
        </El>
      </div>
      {children}
    </div>
  );
};

const ReminderSection = ({ courses, isLoading }) => {
  const featuredCourse = !isLoading && courses[0];
  const featuredBehavior = featuredCourse.behaviors && courses[0].behaviors[0];

  const loaded = featuredCourse && featuredBehavior;

  const { setModule } = useContext(ContentContext);

  const moduleInstance = loaded && (
    <div className="module-instance" style={{ maxWidth: '401px' }}>
      <div
        className="overflow-hidden relative sm:mb-4 cursor-pointer"
        onClick={() =>
          setModule({
            module: featuredCourse,
          })
        }
      >
        <img
          style={{ borderRadius: '16px' }}
          src={`https://play.vidyard.com/${featuredBehavior.player_uuid}.jpg`}
          alt={featuredBehavior.title}
          className="object-cover w-full"
        />

        <PlayButton
          style={{ transform: 'scale(0.5)' }}
          className="absolute m-auto pin-t pin-l pin-r pin-b"
        />
      </div>
      <h2
        onClick={() =>
          setModule({
            module: featuredCourse,
          })
        }
        className="text-charcoal font-extrabold text-3xl mb-4 cursor-pointer"
      >
        {featuredBehavior.title}
      </h2>
      <button type="button">
        <img src={AudioIcon} alt="Audio Icon" />
      </button>
    </div>
  );

  const habitInstance = loaded && (
    <div className="h-full">
      <div style={{ gap: '44px' }} className="h-full flex flex-col md:flex-row">
        <div className="flex flex-col justify-between items-start">
          <p style={{ lineHeight: '49px' }} className="text-4xl">
            &quot;Admired Leadership shows that excellence has routines. A
            technique is something that...&quot;
          </p>
          <button
            type="button"
            className="font-sans font-black text-link-purple text-left mt-8 md:mt-auto"
          >
            MODULE 1: On Being an Authentic Leader
          </button>
        </div>

        <div
          style={{ minWidth: '226px', width: '226px', borderRadius: '16px' }}
          className="habit-instance-cover-img h-full relative ml-auto"
        >
          <img
            style={{ borderRadius: '16px', objectPosition: '43% 50%' }}
            className="object-cover h-full"
            src={HelpToHabitImg}
            alt="Help to habit"
          />
          <div
            style={{
              minWidth: '104px',
              minHeight: '104px',
              left: '-52px',
              bottom: '50px',
            }}
            className="floating-img flex items-center justify-center absolute bg-gray-lightest rounded-full"
          >
            <img src={HelpToHabitIcon} alt="Man with eye icon" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Container
      containerize
      borderBottom
      className="py-10 flex flex-col xl:flex-row"
    >
      {!isLoading && featuredCourse && (
        <>
          <ReminderCard
            style={{ flex: 'auto' }}
            title="HELP TO HABIT"
            buttonText="VIEW ALL HABITS"
            href="/help-to-habit"
          >
            {habitInstance}
          </ReminderCard>
          <ReminderCard
            className="mt-8 xl:mt-0 xl:ml-6"
            title={'REVIEW ' + featuredCourse.title.toUpperCase()}
            buttonText="VIEW MODULE"
            buttonOnClick={() =>
              setModule({
                module: featuredCourse,
              })
            }
          >
            {moduleInstance}
          </ReminderCard>
        </>
      )}
    </Container>
  );
};

export default ReminderSection;

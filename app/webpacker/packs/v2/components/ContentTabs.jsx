import React, { useEffect, useState, useRef } from 'react';
import { useQuery } from "react-query";
import SVG from 'react-inlinesvg';
import { animateScroll as scroll } from 'react-scroll';
// Component
import HabitCard from './HabitCard';
import Button from './Button';
import Editor from './Editor';
import { GetRemindedButton } from './HelpToHabitCTA';
import CustomHorizontalCarousel from './CustomHorizontalCarousel';
// Hooks
import useResponsive from '../hooks/useResponsive';
// Context
import { useOverlay } from '../context/OverlayContext';
// API
import { h2hAPI } from "../api";
// Helpers
import hasValidParameter from '../helpers/hasValidParameter';
import { anchorSections } from './../helpers/localData/index';
// Icons
import GiftIcon from '../../../../assets/images/reskin-images/icon--gift.svg';
import useAuth from "../context/AuthContext";

const ListedNumbers = ({ data }) => (
  <div className="flex flex-col w-full py-8">
    {data.map((item) => {
      const { position, description } = item;

      return (
        <>
          <div style={{ gap: '16px' }} className="flex">
            <div
              style={{
                boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.15)',
                minWidth: '48px',
                minHeight: '48px'
              }}
              className="text-charcoal font-sans font-bold h-12 w-12 rounded-full flex items-center justify-center"
            >
              {position}
            </div>
            <p className="font-sans text-charcoal text-lg">{description}</p>
          </div>
          {position < data.length && (
            <span className="w-full h-px bg-gray my-6" />
          )}
        </>
      );
    })}
  </div>
);

const GiftTab = ({ displayed }) => (
  <div className="flex flex-col items-center py-10">
    <p className=" text-charcoal mb-6">
      For $25, you can gift the behavior{' '}
      <strong>{displayed.behavior.title}</strong> to another leader. It&apos;s a
      decision we celebrate. Thank you for helping them lead through your
      generosity.
    </p>

    <Button
      href={`/program/orders/new?behavior=${displayed.behavior.slug}&course=${displayed.module.slug}`}
    >
      Gift This Behavior
    </Button>
  </div>
);

const ContentTabs = ({ behaviorDetails, displayed }) => {
  const [activeTab, setActiveTab] = useState('notes');
  const { userData } = useAuth();
  const [showAll, setShowAll] = useState(false);
  const { overlay, setOverlay } = useOverlay();
  const { isMobile, isTablet } = useResponsive();
  const isBehaviorTab = hasValidParameter('tab', anchorSections);
  const openOverlay = overlay && isBehaviorTab;

  // Create a ref to the behavior-content element
  const behaviorContentRef = useRef(null);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  useEffect(() => {
    setShowAll(false); // Set showAll to false when activeTab changes
  }, [activeTab]);

  useEffect(() => {
    if (
      behaviorDetails.behavior_maps &&
      behaviorDetails.behavior_maps.length > 0
    ) {
      setActiveTab('notes');
    } else {
      setActiveTab('notes');
    }
  }, [behaviorDetails]);

  useEffect(() => {
    let timer;

    setOverlay(isBehaviorTab);

    const behaviorContentElement = behaviorContentRef.current;

    if (behaviorContentElement) {
      setActiveTab(isBehaviorTab);
      let scrollPosition;


      if (isMobile) {
        const programContentWrapper = document.getElementById('program-content-wrapper');
        if (programContentWrapper && behaviorContentElement) {
          scrollPosition = behaviorContentElement.offsetTop - window.innerHeight / 2;
          programContentWrapper.scrollTo({
            top: scrollPosition,
            behavior: 'instant',
          });
        }
      } else {
        scrollPosition = behaviorContentElement.offsetTop - window.innerHeight / 2;
        scroll.scrollTo(scrollPosition, {
          duration: 200,
          smooth: 'easeInOutQuart', 
          offset: -20, 
        });
      }
    }

    timer = setTimeout(() => {
      let opacity = 1;
      const decreaseOpacityInterval = setInterval(() => {
        opacity -= 0.1; // Decrease opacity by 0.1 at an interval
  
        if (overlayRef.current) {
          overlayRef.current.style.opacity = opacity.toString();
        }
      }, 3000); // Start decreasing opacity after 3 seconds
  
      setTimeout(() => {
        clearInterval(decreaseOpacityInterval); // Stop decreasing opacity after 6 seconds
        setOverlay(false); // Close the overlay
      }, 3000);
  
    }, 4000); // Start fading out after 5 seconds

    return () => {
      clearTimeout(timer);
    };

  }, [isBehaviorTab]);

  const tabsConfig = [
    { label: 'Take a Note', property: 'notes' },
    { label: 'Examples', property: 'examples' },
    { label: 'Discussion Questions', property: 'questions' },
    { label: 'Exercises', property: 'exercises' },
    { label: 'Behavior Map', property: 'behavior_maps' },
    {
      label: <SVG src={GiftIcon} />,
      property: 'gift',
      className: '',
      hide: displayed.module.title === 'Foundations'
    }
  ];

  const handleTabClick = (property) => {
    setActiveTab(property);
  };

  const renderTab = (tabConfig) => {
    const { label, property, className, hide } = tabConfig;
  
    const tabStylesOverlayActive = {
      border: '6px solid #A7C400',
      borderRadius: '24px',
      padding: '0.05rem 0.5rem'
    }
  
    const tabStylesOverlay = {
      border: '6px solid transparent',
      borderRadius: '24px',
      padding: '0.05rem 0.5rem'
    }
  
    const tabStyles = {
      border: 'none',
      paddingBottom: '0.5rem'
    }
  
    const isActiveTabOverlay = activeTab === property && overlay;
    const isNotActiveTabOverlay = activeTab !== property && overlay;
    const isActiveTab = activeTab === property && !overlay;
  
    let appliedStyle = tabStyles; // Default style
  
    if (
      property === 'gift' ||
      property === 'notes' ||
      (behaviorDetails[property] && behaviorDetails[property].length > 0)
    ) {
      if (isActiveTabOverlay) {
        appliedStyle = tabStylesOverlayActive;
      } else if (isNotActiveTabOverlay) {
        appliedStyle = tabStylesOverlay;
      }
  
      return (
        <button
          id={property}
          type="button"
          key={label}
          className={`${isActiveTab ? 'text-link-purple relative' : 'text-charcoal'} ${className} ${hide && 'hidden'} px-2 relative font-sans font-bold whitespace-no-wrap`}
          onClick={() => handleTabClick(property)}
          style={appliedStyle}
          disabled={overlay}
        >
          {label}
          {isActiveTab && (
            <span className="absolute pin-b pin-l w-full h-px bg-link-purple"></span>
          )}
        </button>
      );
    }
  };
  

  const behaviorId = displayed?.behavior?.id;
  const module = displayed?.module;
  const moduleBehaviors = module?.behaviors;
  const behaviorHabit = moduleBehaviors?.find(behavior => behavior.id === behaviorId);
  const query = {
    behaviorTitle: behaviorHabit?.title,
    behaviorID: behaviorHabit?.id,
    type: 'behavior',
    hasH2H: behaviorHabit?.has_h2h
  };

  const { data: h2hAPIdata } = useQuery("userHelpToHabitProgress", () =>
    h2hAPI.getProgresses(),
  );

  console.log('h2hAPIdata', h2hAPIdata);

  const registeredHabit = h2hAPIdata?.find(item => item.behavior_id === behaviorId);
  console.log('registeredHabit', registeredHabit);
  const stateIsQueued = registeredHabit?.behavior_id === behaviorId && registeredHabit.is_active !== true;
  const stateIsActive = registeredHabit?.behavior_id === behaviorId && registeredHabit.is_active === true;
  const h2hOptOut = userData?.h2h_opt_out;
  let h2hBehaviorState = 'activate';
  
  const h2hButtonText = {
    activate: 'Activate Help to Habit reminders for this behavior.',
    currentlyActive: 'You are currently receiving reminders for this module. Edit your Help to Habit settings.',
    add: 'Add Help to Habit reminders for this behavior to your queue.',
    currentlyQueue: 'Reminders for this module are currently in your queue.',
    stopped: 'You have cancelled Help to Habit. Text START to 833-202-9765 to enable your Help to Habit account.'
  }

  let buttonText = h2hButtonText.activate;

  if(h2hAPIdata?.length === 0) {
    buttonText = h2hButtonText.activate;
  }

  if(h2hAPIdata?.length > 0) {
    buttonText = h2hButtonText.add;
  }

  if(registeredHabit && stateIsQueued) {
    buttonText = h2hButtonText.currentlyQueue;
  }

  if(registeredHabit && stateIsActive) {
    buttonText = h2hButtonText.currentlyActive;
  }

  if(h2hOptOut) {
    buttonText = h2hButtonText.stopped;
  }

  const containerPadding = showAll ? 'p-6' : 'pt-6 px-6';
  const wrapperPadding = showAll ? 'py-8' :'pt-8';

  return (
    <>
      {query.type === 'behavior' && query.hasH2H && (
        <div
          className="flex items-center justify-between bg-purple-100 mb-9"
          style={{ margin: '-0.8rem 0 1rem 0', padding: '11px 8px', width: 'calc(100%)'}}
        >
          <GetRemindedButton query={query} text={buttonText} registeredHabit={registeredHabit} />
        </div>
      )}
      <div
        id="behavior-content"
        ref={behaviorContentRef}
        style={{ boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.1)', zIndex: openOverlay ? '99999' : '0' }}
        className={`behavior-content bg-white w-full rounded-2lg relative ${containerPadding}`}
      >
        <div className="border-b border-gray-dark flex w-full">
          <CustomHorizontalCarousel isBehaviorTab={isBehaviorTab} activeTab={activeTab} overlay={overlay}>
            <div style={{ gap: '32px' }} className="p-0 flex">
              {tabsConfig.map((tabConfig) => renderTab(tabConfig))}
            </div>
          </CustomHorizontalCarousel>
        </div>

        <div className="w-full flex justify-center mt-4">
          <div
            style={{
              maxHeight: !isTablet && activeTab !== 'notes' && '800px'
            }}
            className={`${
              activeTab !== 'notes' &&
              'customized-scrollbar  lg:overflow-y-scroll'
            } -mx-10 px-10 w-full`}
          >
            {activeTab === 'notes' && (
              <Editor className="-mx-10" behavior={displayed.behavior} module={displayed.module} />
            )}
            {activeTab === 'examples' && (
              <ListedNumbers data={behaviorDetails.examples} />
            )}
            {activeTab === 'questions' && (
              <ListedNumbers data={behaviorDetails.questions} />
            )}
            {activeTab === 'exercises' && (
              <ListedNumbers data={behaviorDetails.exercises} />
            )}
            {activeTab === 'behavior_maps' && (
              <div id="behavior-wrapper" className={`w-full relative ${wrapperPadding}`}>
                {behaviorDetails.behavior_maps.map((item, index) => (
                  <>
                    {(index < 3 || showAll) && (
                      <div className="relative">
                        {index !== 0 && (
                          <span className=" flex w-full h-px bg-gray-dark my-6" />
                        )}
                        <HabitCard habit={item} index={index} showAll={showAll} toggleShowAll={toggleShowAll}/>
                      </div>
                    )}
                  </>
                ))}
              </div>
            )}
            {activeTab === 'gift' && <GiftTab displayed={displayed} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentTabs;

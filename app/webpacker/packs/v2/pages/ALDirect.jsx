import React from 'react';
import { useQuery } from 'react-query';
import SVG from 'react-inlinesvg';
// Components
import { Main } from '../components/layouts/Layouts';
import Button from '../components/Button';
// Helpers
import { crmAPI } from '../api';
// Hooks
import useResponsive from '../hooks/useResponsive';
// Images
import CalendarMark from '../../../../assets/images/reskin-images/icon--calendar-mark.svg';
import Calendar from '../../../../assets/images/reskin-images/icon--calendar.svg';
import NextSession from '../../../../assets/images/ALD_subscriber_viewer_sm.jpg';
import PlayCircle from '../../../../assets/images/reskin-images/icon--play-circle-purple.svg';

// Assumes we're parsing Eastern time zone dates
const formatDate = (dateStr) => {
  const date = new Date(dateStr);

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeZone: 'America/New_York',
  }).format(date);
}

const formatTime = (dateStr) => {
  const date = new Date(dateStr);

  return new Intl.DateTimeFormat('en-US', {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone: 'America/New_York',
  }).format(date);
}

const formatDay = (dateStr) => {
  const date = new Date(dateStr);

  return new Intl.DateTimeFormat('en-US', {
    weekday: "short",
    timeZone: 'America/New_York',
  }).format(date);
}

const ALDirectContent = () => {
  const { isTablet, isMobile } = useResponsive();
  const { data: webinars } = useQuery('allWebinars', crmAPI.getWebinars);
  let nextWebinar = {};
  const upcomingWebinars = [];

  if (!webinars) {
    return null;
  }

  const { next_up: getNext, upcoming: getUpcoming, past: pastWebinars } = webinars;

  if (!getNext) {
    return null;
  }

  if (!getUpcoming) {
    return null;
  }

  for (let i = 0; i < getUpcoming.length; i++) {
    if (getUpcoming[i].id === getNext.id) {
      nextWebinar = getUpcoming[i];
    } else {
      upcomingWebinars.push(getUpcoming[i]);
    }
  }

  const webinarsWrapperStyles = {
    gap: '24px',
    flexDirection: isTablet ? 'column' : 'row'
  };

  const nextCardStyles = {
    borderRadius: '32px',
    backgroundColor: '#ffffff',
    gap: '18px',
    fontSize: '12px',
    lineHeight: '16px',
    fontFamily: 'Nunito Sans',
    width: isTablet ? '100%' : '465px',
    maxWidth: isTablet ? '100%' : '465px',
    boxShadow: '0 20px 50px rgba(0,0,0,.1)',
    flex: '1',
    alignSelf: isTablet ? 'center' : 'flex-start'
  };

  const upcomingCardStyles = {
    borderRadius: '32px',
    backgroundColor: '#F6F5F5',
    gap: '18px',
    fontSize: '12px',
    lineHeight: '16px',
    fontFamily: 'Nunito Sans',
    width: isTablet ? '100%' : '628px',
    maxWidth: isTablet ? '100%' : '628px',
    minHeight: isTablet ? 'none' : '493px',
    flex: '1',
    alignSelf: isTablet ? 'center' : 'flex-start'
  };

  const pastCardStyles = {
    borderRadius: '32px',
    backgroundColor: '#ffffff',
    fontFamily: 'Nunito Sans',
    width: '302px',
    boxShadow: '0 20px 50px rgba(0,0,0,.1)'
  };

  return (
    <>
      <h1 style={{ fontSize: '48px' }} className="text-charcoal font-extrabold  mb-4">Admired Leadership Direct</h1>
      <p>AL Direct sessions are private live events for Admired Leadership Direct subscribers. This is your opportunity to ask questions about course content and tough challenges you may be facing. Register now to participate!</p>
      <div className={`flex pt-10 pb-24 border-b border-gray-dark ${isTablet ? 'items-center' : ''}`} style={webinarsWrapperStyles}>
        <div className={`p-6 ${isTablet ? 'mb-8' : ''}`} style={nextCardStyles}>
          <div className="flex items-center pb-4" style={{ gap: '12px' }}>
            <SVG src={CalendarMark} />
            <span style={{ fontSize: '16px', fontWeight: '600', lineHeight: '24px' }}>Next Sesson</span>
          </div>
          <img style={{ borderRadius: '32px' }} src={NextSession} alt={nextWebinar.title} />
          <h3 className="py-4" style={{ fontSize: '20px' }}>{nextWebinar.title}</h3>
          <p style={{ fontSize: '20px' }}>{formatTime(nextWebinar.presented_at)}</p>
          <div className="pt-4 flex flex-col justify-end items-end flex-1 flex-wrap content-end">
            <Button className="capitalize" href={nextWebinar.registration_link} style={{ borderRadius: '12px', fontSize: '14px' }}>Register Now</Button>
          </div>
        </div>
        <div className="p-6" style={upcomingCardStyles}>
          <div className="flex items-center pb-4" style={{ gap: '12px' }}>
            <SVG src={Calendar} />
            <span style={{ fontSize: '16px', fontWeight: '600', lineHeight: '24px' }}>All Upcoming Sessions</span>
          </div>
          <div>
            {upcomingWebinars && (upcomingWebinars.map((webinar) => (
              <div
                key={crypto.randomUUID()}
                className={`flex ${isMobile ? 'flex-col' : 'flex-row'} border-t border-gray-dark`}
                style={{
								  gap: isTablet ? '12px' : '24px',
								  padding: '17px 0',
                  fontSize: '16px'
                }}
              >
                <div className="flex" style={{ gap: '24px' }}>
                  <div className="uppercase">{formatDay(webinar.presented_at)}</div>
                  <div>{formatDate(webinar.presented_at)}</div>
                </div>
                <div className="flex flex-1" style={{ gap: '24px' }}>
                  <div>{formatTime(webinar.presented_at)}</div>
                  <a className="capitalize font-normal text-link-purple" href={nextWebinar.registration_link} style={{ fontSize: '12px', marginLeft: 'auto' }}>Register</a>
                </div>
              </div>
            )))}
          </div>
        </div>
      </div>
      <h1 style={{ fontSize: '48px' }} className="text-charcoal font-extrabold  py-8">Past Sessions</h1>
      <div className="flex flex-wrap" style={{ gap: '24px', maxWidth: '1080px' }}>
        {pastWebinars && (pastWebinars.map((webinar) => {
          return (
            <div key={crypto.randomUUID()} className="p-4 flex flex-col" style={pastCardStyles}>
            <div style={{ fontSize: '16px', fontWeight: '600', lineHeight: '24px', marginBottom: '8px' }}>{formatDate(webinar.presented_at)}</div>
            <div style={{ fontSize: '12px', fontWeight: '600', lineHeight: '16px', marginBottom: '28px' }}>{Math.floor(webinar.video_length / 60)} mins</div>
            <a href={`/v2/program/AL-Direct/${webinar.id}`} className="capitalize font-normal text-link-purple flex items-center" style={{ marginLeft: 'auto', gap: '8px', padding: '4px', borderRadius: '8px', backgroundColor: 'rgba(139, 127, 219, 0.10)' }}>
              <SVG src={PlayCircle} stroke="#6357b5" />
              <span style={{ fontSize: '16px' }}>Watch</span>
            </a>
          </div>
          );
          
          }))}
      </div>
    </>
  );
};

const options = {
  layout: 'full',
  content: <ALDirectContent />,
  wrapperClasses: 'flex justify-center',
  innerStyle: { width: '100%', maxWidth: '1400px' }
};

const ALDirect = () => <Main options={options} />;

export default ALDirect;

import React from 'react';
import { useQuery } from 'react-query';
// Components
import { Main } from '../components/layouts/Layouts';
// Helpers
import { crmAPI } from '../api';

const ALDirectContent = () => {
  const url = new URL(window.location.href);
  const { pathname } = url;
  const webinarId = pathname.substring(pathname.lastIndexOf('/') + 1);
  const { data: webinar } = useQuery(['webinar', webinarId], () => crmAPI.getWebinarById(webinarId));

  if (!webinar) {
    return null;
  }

  return (
    <div className="h-full bg-grey-darkest lg:overflow-hidden">
      <div className="flex flex-col sm:flex-row overflow-x-hidden">
        <div className="flex-1 mb-4 sm:mb-0">
          <nav className="video-module__nav">
            <div className="flex items-center relative">
              <a className="absolute flex text-grey text-xl no-underline z-1" href="/v2/program/AL-Direct">
                <svg className="svg-inline--fa fa-angle-left fa-w-6" aria-hidden="true" focusable="false" data-prefix="far" data-icon="angle-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512" data-fa-i2svg="">
                  <path fill="currentColor" d="M4.2 247.5L151 99.5c4.7-4.7 12.3-4.7 17 0l19.8 19.8c4.7 4.7 4.7 12.3 0 17L69.3 256l118.5 119.7c4.7 4.7 4.7 12.3 0 17L168 412.5c-4.7 4.7-12.3 4.7-17 0L4.2 264.5c-4.7-4.7-4.7-12.3 0-17z" />
                </svg>
                <span className="hidden md:block ml-1 text-sm">Back</span>
              </a>
              <div className="flex-1">
                <div className="flex justify-center relative">
                  <h1 className="mx-2 text-base text-grey-lightest">
                    <span className="hidden lg:inline-block">Webinar</span>
                    <span className="hidden lg:inline-block mx-2 font-normal"> | </span>
                    <span className="font-normal">{webinar.title}</span>
                  </h1>
                </div>
              </div>
            </div>
          </nav>
          <div className="vidyard-player">
            <div className="vidyard-player-container" uuid={webinar.player_uuid} style={{ margin: 'auto', width: '100%', height: 'auto', overflow: 'hidden', display: 'block' }}>
              <div className={`vidyard-div-${webinar.player_uuid}`} role="region" aria-label="Vidyard media player" style={{ position: 'relative', paddingBottom: '56.25%', height: '0px', overflow: 'hidden', maxWidth: '100%', backgroundColor: 'transparent' }}>
                <div className={`vidyard-inner-container-${webinar.player_uuid}`} style={{ position: 'absolute', height: '100%', width: '100%' }} data-pl="false">
                  <iframe allow="autoplay; fullscreen; picture-in-picture; camera; microphone; display-capture" allowFullScreen="" allowTransparency="true" referrerpolicy="no-referrer-when-downgrade" className={`vidyard-iframe-${webinar.player_uuid}`} frameBorder="0" height="100%" width="100%" scrolling="no" src={`https://play.vidyard.com/${webinar.player_uuid}?disable_popouts=1&amp;v=4.3.13&amp;type=inline`} title={webinar.title} style={{ opacity: '1', backgroundColor: 'transparent', position: 'absolute', top: '0px', left: '0px' }} />
                  <img style={{ width: '100%', margin: 'auto', display: 'none' }} alt="" className="vidyard-player-embed inserted" src={`https://play.vidyard.com/${webinar.player_uuid}.jpg`} data-uuid={webinar.player_uuid} data-v="4" data-type="inline" data-rendered="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const options = {
  layout: 'full',
  mainStyle: { backgroundColor: '#3b3e44' },
  content: <ALDirectContent />,
  contentStyle: { padding: '0 0 0' },
  wrapperClasses: 'flex justify-center',
  innerStyle: { width: '100%' }
};

const ALDirectVideo = () => <Main options={options} />;

export default ALDirectVideo;

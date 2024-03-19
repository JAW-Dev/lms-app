import React from 'react';
// Hooks
import useResponsive from '../../hooks/useResponsive';
// Components
import { Main } from '../../components/layouts/Layouts';
import { HubspotForm } from '../../components/forms/Forms';
// Images
import HeadShot from './../../../../../assets/images/reskin-images/img--access-teams.jpg';

const BasicCard = ({children, classes}) => {
	return (
		<div
		className={`bg-white px-10 py-8 ${classes}`}
		style={{borderRadius: '32px', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 10px 50px'}}>
			{children}
		</div>
	);
}

const RightColumn = () => {
	const formProps = {
		portalId: '6588352',
		formId: '6db0e5e9-e8b7-494b-89a6-f773d8443215',
		cssClass: 'full-width lg:max-w-3/4',
		submitButtonClass: 'w-full md:w-auto mb-4 md:mb-0 px-6 py-3 text-center is-highlighted capitalize',
		target: 'access-teams',
		wrapperProps: { className: 'form-wrapper' },
	};

  return (
    <div className="md:mt-12 mb-8 md:mb-0ß" style={{color: '#3C3C3C'}}>
      <BasicCard>
        <h6 className="mb-6 font-bold" style={{fontSize: '20px'}}>Sign up for more information</h6>
				<HubspotForm {...formProps}/>
      </BasicCard>
    </div>
  )
}

const LeftColumn = () => {
  const imageStyles = {
    width: '138px',
    height: '138px',
    borderRadius: '100%',
    backgroundImage: `url(${HeadShot})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center center',
		backgroundRepeat: 'no-repeat',
    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 10px 50px'
  }

  return (
    <>
      <div className="mb-6" style={imageStyles}></div>
      <h1 style={{ fontSize: '36px', lineHeight: '1.4', maxWidth: '14ch'  }} className="text-charcoal font-black mb-8">
				Develop a team of great leaders
      </h1>
			<h6 className="pb-2 font-bold" style={{ fontSize: '20px' }}>Group Pricing</h6>
      <p className="pb-10">Progressively priced per leader, Admired Leadership subscriptions are set during the time of first set-up in groups of 10-49 and 50+ leaders.</p>
			<h6 className="pb-2 font-bold" style={{ fontSize: '20px' }}>Team Dialogues</h6>
			<p className="pb-10">Admired Leadership Dialogues creates an environment that allows rich dialogue among peer-like leaders in a series of relevant and timely leadership topics.</p>
			<h6 className="pb-2 font-bold" style={{ fontSize: '20px' }}>Individual Coaching</h6>
			<p className="pb-10">1:1 coaching sessions allows each leader full access to advice as real-time issues arrive. Alternative options include coaching office hours to support the leaders in a scalable and cost-effective way.</p>
    </>
  )
}

const PageContent = () => {
	const { isTablet } = useResponsive();

  const columnStyles = {
    width: isTablet ? '100%' : 'calc(50% - 36px)'
  }

  return (
    <div className="flex flex-col md:flex-row pt-12" style={{gap: '72px'}}>
      <div style={columnStyles}><LeftColumn/></div>
      <div style={columnStyles}><RightColumn/></div>
    </div>
  );
};

const options = {
  content: <PageContent />,
  layout: 'full',
  wrapperClasses: 'flex justify-center',
  innerStyle: { width: '100%', maxWidth: '1400px' }
};

const AccesTeam = () => <Main options={options} />;

export default AccesTeam;
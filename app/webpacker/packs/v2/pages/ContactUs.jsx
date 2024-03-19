/* eslint-disable */
import React from 'react';
import SVG from 'react-inlinesvg';
// Components
import { Main } from './../components/layouts/Layouts';
import { HubspotForm } from './../components/forms/Forms';
import Button from '../components/Button';
import Text from '../components/Text';
// Hooks
import useResponsive from '../hooks/useResponsive';
// Icons
import PhoneIcon from '../../../../assets/images/reskin-images/icon--phone.svg';
import MailIcon from '../../../../assets/images/reskin-images/icon--mail.svg';
import MapPinIcon from '../../../../assets/images/reskin-images/icon--map-pin.svg';

const ContactUsSidebar = ({isTablet}) => {

	return (
		<>
			<h3 className="leading-tight  text-charcoal font-bold text-xl lg:text-3xl">Need Support?</h3>
			<Text variant="p-l" className="my-5">
				Feel free to reach out to us with any other quesions or concerns. We'll get back to you right away.
			</Text>
			<div className="contact-us__contact flex flex-row">
				<SVG src={PhoneIcon} /> (877) 898-7337
			</div>
			<div className="contact-us__contact flex flex-row">
				<SVG src={MailIcon} /> <a className="text-link-purple" href="mailto:support@admiredleadership.com">support@admiredleadership.com</a>
			</div>
			<div className="contact-us__contact flex flex-row">
				<SVG src={MapPinIcon} /> 4 Radnor Corporate Center<br/>#250<br/> Radnor, PA 19087
			</div>
			<h3 className="leading-tight font-sans text-charcoal font-extrabold text-xl lg:text-3xl mt-8">Not sure where to start?</h3>
			<p className="my-5  text-charcoal font-normal">
				Check out our <a className="text-link-purple" href="/program/course-navigation">Course Navigation</a> for some quick suggestions on how to progress through the modules.
			</p>
		</>
	);
};

const ContactUsContent = ({isTablet}) => {
	const formProps = {
		portalId: '6588352',
		formId: 'a885e828-e9a6-4018-9c92-12fc7669a63a',
		cssClass: 'ull-width lg:max-w-3/4',
		submitButtonClass: 'w-full md:w-auto mb-4 md:mb-0 px-6 py-3 text-center is-highlighted',
		target: 'contact-us',
		wrapperProps: { className: 'form-wrapper' },
	};

  return (
		<>
			<h1 style={{ fontSize: '48px' }} className="text-charcoal font-extrabold  mb-4">Contact Us</h1>
			<div className="">
				<HubspotForm {...formProps}/>
			</div>
		</>
  );
}

const ContactUs = () => {
	const { isTablet } = useResponsive();

	const options = {
		layout: 'left',
		content: <ContactUsContent isTablet={isTablet}/>,
		sidebar: <ContactUsSidebar isTablet={isTablet}/>,
		sidebarClasses: 'lg:border-l lg:border-gray bg-white-faint overflow-visible overflow-y-visible',
		sidebarStyle: {minHeight: '100%'},
		contentStyle: {minHeight: isTablet ? '0' : 'calc(100vh - 130px)'},
		menu: false
	};

	return <Main options={options} />;
};

export default ContactUs;

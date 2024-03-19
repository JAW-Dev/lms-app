import React from 'react';
// Hooks
import useResponsive from '../../hooks/useResponsive';
// Components
import { Main } from '../../components/layouts/Layouts';
import { HubspotForm } from '../../components/forms/Forms';
// Images
import HeadShot from './../../../../../assets/images/reskin-images/img--access-non-profit.jpg';

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
		formId: 'fc38463a-dc7f-4b98-a088-3017690d74ef',
		cssClass: 'ull-width lg:max-w-3/4',
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
      <h1 style={{ fontSize: '36px', lineHeight: '1.4', maxWidth: '18ch'  }} className="text-charcoal font-black mb-8">
				Leadership excellence is for everyone
      </h1>
      <p className="pb-6">The content in the Admired Leadership course is for anyone who is serious about developing their leadership abilities.</p>
			<p className="pb-6">And that should include leaders who may be a long way from Wall Street.</p>
			<p className="pb-6 font-bold">For individuals, the course is $1,000 for full access to all 10 modules. But for leaders in non-profit endeavors, we have attractive course options to make enrollment a real option.</p>
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

const AccessNonprofit = () => <Main options={options} />;

export default AccessNonprofit;
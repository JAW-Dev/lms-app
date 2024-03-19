import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
// Packages
import SVG from 'react-inlinesvg';
// Context
import useAlarm from '../../context/AlarmContext';
import useModal from '../../context/ModalContext';
// Hooks
import useResponsive from '../../hooks/useResponsive';
// API
import { registerNew } from '../../api/user';
// Components
import { Main } from '../../components/layouts/Layouts';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
// Icons
import Danger from '../../../../../assets/images/reskin-images/icon--danger.svg';
import Chevron from '../../../../../assets/images/reskin-images/icon--select-chevron.svg'
// Images
import HeadShot from './../../../../../assets/images/reskin-images/img--access-individual.jpg';

const InspiredList = [
  {
    value: '',
    label: ''
  },
  {
    value: 'Listened to Randall Stutman speak about Admired Leadership on a podcast',
    label: 'Listened to Randall Stutman speak about Admired Leadership on a podcast'
  },
  {
    value: 'Heard the sponsor message on The Knowledge Project podcast with Shane Parrish',
    label: 'Heard the sponsor message on The Knowledge Project podcast with Shane Parrish'
  },
  {
    value: 'Heard someone speak about Admired Leadership at a conference',
    label: 'Heard someone speak about Admired Leadership at a conference'
  },
  {
    value: 'Referred from a CRA | Admired Leadership employee',
    label: 'Referred from a CRA | Admired Leadership employee'
  },
  {
    value: 'Word of mouth referred from a family, friend, or work colleagues',
    label: 'Word of mouth referred from a family, friend, or work colleagues'
  }
];

const BasicCard = ({children, classes}) => {
	return (
		<div
		className={`bg-white px-10 py-8 ${classes}`}
		style={{borderRadius: '32px', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 10px 50px'}}>
			{children}
		</div>
	);
}

const ModalContent = () => {
  return (
    <>
      <p className="mb-4">Welcome and thank you for your interest in Admired Leadership.</p>
      <p className="mb-4">When you view our content and use our services, you are agreeing to our terms, so please read the User Agreement below.</p>
      <p className="mb-4">This agreement is a legal contract between you and Admired Leadership. You acknowledge that you have read, understood and agree to be bound by the terms of this agreement. If you do not agree to this contract, you should not use or view Admired Leadership.</p>
      <p className="mb-4">The User agrees not to present, teach, distribute or in any way share the content of Admired Leadership. The User understands and agrees that the Admired Leadership content is for personal use and personal development only and that any distribution, downloading, re-transmission or sharing of the content of Admired Leadership, without the express written consent of Admired Leadership, is strictly prohibited.</p>
    </>
  )
}

const RightColumn = ({isTablet}) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    what_inspired_you_to_buy_admired_leadership_: ''
  });
  const [errors, setErrors] = useState({messages: []});
  const [showErrors, setShowErrors] = useState(false);
  const queryClient = useQueryClient();
  const { setAlarm } = useAlarm();
  const { setContent } = useModal();

  const { mutate } = useMutation(registerNew, {
    onSuccess: (data) => {
      setAlarm({ type: 'success', message: data.message });
      queryClient.invalidateQueries('currentUser');
      window.location.href = '/welcome/confirm';
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company_name: '',
        what_inspired_you_to_buy_admired_leadership_: ''
      });
    },
    onError: (error) => {
      setAlarm({ type: 'error', message: error.message });
    }
  });

  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
   }

  const validateForm = () => {
    let newErrors = { messages: [] };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      newErrors.messages.push('Valid email address is required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors?.messages).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isFormValid = validateForm();

    if (isFormValid) {
      const newFormData = {
        email: formData.email || '',
        profile_attributes: {
          first_name: formData.first_name || '',
          last_name: formData.last_name || '',
          phone: formData.phone || '',
          company: formData.company_name || '',
          hubspot: {
            what_inspired_you_to_buy_admired_leadership_: formData.what_inspired_you_to_buy_admired_leadership_ || '',
          }
        }
      };

      mutate(newFormData);
    }

    if (!isFormValid) {
      setShowErrors(true);
    }
  };

  const onClickHandler = () => {
    setContent({
      titleCallout: 'User Agreement',
      modalTitle: 'User Agreement',
      content: <ModalContent/>,
    });
  };

  return (
    <div className="md:mt-12 mb-8 md:mb-0" style={{color: '#3C3C3C'}}>
      <BasicCard>
        <h6 className="mb-6 font-bold" style={{fontSize: '20px'}}>Sign me up for new insights on leadership!</h6>
        <form className="h-full user-profile-form" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row pb-6" style={{gap: '24px'}}>
            <div style={{width: isTablet ? '100%' : '50%' ,fontSize: '14px'}}>
              <FormInput
                label="First Name"
                name="first_name"
                type="text"
                handleChange={handleChange}
                value={formData.first_name || ''}
              />
            </div>
            <div style={{width: isTablet ? '100%' : '50%' ,fontSize: '14px'}}>
              <FormInput
                label="Last Name"
                name="last_name"
                type="text"
                handleChange={handleChange}
                value={formData.last_name || ''}
              />
            </div>
          </div>

          <div className="pb-6" style={{fontSize: '14px'}}>
            <FormInput
              label="Email*"
              name="email"
              type="text"
              handleChange={handleChange}
              value={formData.email || ''}
            />
          </div>

          <div className="flex flex-col md:flex-row pb-6" style={{gap: '24px'}}>
            <div style={{width: isTablet ? '100%' : '50%' ,fontSize: '14px'}}>
              <FormInput
                label="Phone"
                name="phone"
                type="text"
                handleChange={handleChange}
                value={formData.phone || ''}
              />
            </div>
            <div style={{width: isTablet ? '100%' : '50%' ,fontSize: '14px'}}>
              <FormInput
                label="Company Name"
                name="company_name"
                type="text"
                handleChange={handleChange}
                value={formData.company_name || ''}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-charcoal font-bold pb-1">What inspired you to sign up?</label>
            <div className="relative">
              <select
                id="what_inspired_you_to_buy_admired_leadership_"
                name="what_inspired_you_to_buy_admired_leadership_"
                value={formData.what_inspired_you_to_buy_admired_leadership_ || ''}
                onChange={handleChange}
                className="border-2 border-gray p-2 w-full appearance-none"
                style={{borderRadius: '12px'}}
              >
                {InspiredList.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute flex items-center pr-3 pointer-events-none" style={{top: '8px', right: '0'}}>
                <SVG src={Chevron} />
              </div>
            </div>
          </div>

          <div className="mb-6">
            {showErrors && errors?.messages?.length > 0 && errors?.messages?.map((message, index) => (
              <div className="flex mb-2 mt-6" style={{gap: '10px'}} key={index}>
                <div style={{width: '24px', height: '24px'}}>
                  <SVG src={Danger} alt="error" />
                </div>
                <div>{message}</div>
              </div>
            ))}
            <Button type="submit" variant="default-lowewrcase" className="font-bold capitalize mt-6" style={{ borderRadius: '16px' }}>Sign Up</Button>
          </div>
          <p style={{fontSize: '14px'}}>By creating an account, you are agreeing to the terms of our <a href="#" onClick={() => onClickHandler()} className="text-link-purple">User Agreement</a>.</p>
          <p className="mt-4" style={{fontSize: '14px'}}><span className="font-bold mt-4">Get the complete course for just $1,000.</span> The full access is valid for 1-year from date of purchase. Renewal is $200 a year and does not automatically renew.</p>
        </form>
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
      <h1 style={{ fontSize: '36px', lineHeight: '1.4', maxWidth: '25ch' }} className="text-charcoal font-black mb-8 mt-8 md:mt-24">
			Five foundational videos to change the way you think about leadership. <span style={{color: '#8b7fdb'}}>Free.</span>
      </h1>
      <h6 style={{fontSize: '20px'}} className='mb-3'>An Introduction to Admired Leadership®</h6>
      <ul className="pb-8" style={{paddingLeft: '1.5rem'}}>
        <li className='mb-1'>A Behavioral View of Leadership Excellence</li>
        <li className='mb-1'>On Being an Authentic Leader</li>
        <li className='mb-1'>The Difference Between Technique and Routine</li>
        <li className='mb-1'>Leadership Wisdom: What Counts as an Admired Leadership Behavior?</li>
				<li>Are Leaders Born or Made?</li>
      </ul>
      <p className="pb-8">This module is complimentary.</p>
      <p className="font-bold">Sign up now for instant access to all five videos, plus other great insights from Admired Leadership.</p>
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
      <div style={columnStyles}><RightColumn isTablet={isTablet}/></div>
    </div>
  );
};

const options = {
  content: <PageContent />,
  layout: 'full',
  wrapperClasses: 'flex justify-center',
  innerStyle: { width: '100%', maxWidth: '1400px' }
};

const AccessDirect = () => <Main options={options} />;

export default AccessDirect;
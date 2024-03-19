import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Components
import { Main } from '../components/layouts/Layouts';
import { HubspotForm } from '../components/forms/Forms';
// Context
import useAuth from '../context/AuthContext';


const PageContent = () => {
	const { userData, isLoading } = useAuth();
	const navigate = useNavigate();
  const location = useLocation();

	const formProps = {
		portalId: '6588352',
		formId: '35f833d2-86a3-40e0-abac-b26a9c23caa9',
		cssClass: 'ull-width lg:max-w-3/4',
		submitButtonClass: 'w-full md:w-auto mb-4 md:mb-0 px-6 py-3 text-center is-highlighted',
		target: 'study-groups',
		wrapperProps: { className: 'form-wrapper' },
	}

  useEffect(() => {
		if (!isLoading) {
			const params = new URLSearchParams({ email: userData?.email, firstname: userData?.profile?.first_name }).toString();
			navigate(`${location.pathname}?${params}`, { replace: true });
		}
  }, [userData]);

  return (
    <div style={{maxWidth: '700px'}}>
      <h1 className="font-extrabold  text-charcoal text-5xl mb-8">
				Community Discussion Groups
      </h1>
			<p className="mb-4">One of the best ways to engage with Admired Leader behaviors at a deeper level is by participating in one of our community discussion groups. You’ll be involved in straight forward discussion about leadership challenges and behavioral strategies. It’s about the content, but also connecting with other leaders.</p>
			<p className="mb-4">The groups meet online once a month. There are a number of days and times available. An Admired Leadership coach will be on hand to facilitate the conversation. There is no additional fee.</p>
			<p className="mb-4">However, a study group only works if those involved are truly committed to participating. This doesn’t mean 100% attendance is required — just that we are looking for folks who are serious about this process.</p>
			<p className="mb-4">Because we deeply believe in the power of discussion and dialogue, we are confident that participation in an Admired Leadership study group will enrich and accelerate your progress toward becoming a better leader.</p>
			<p className="mb-4">To get started, use the sign-up form below and we’ll be in touch.</p>

			{ !isLoading && (
					<div className="bg-white px-8 py-6 w-full flex flex-col mt-12" style={{borderRadius: '32px', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 10px 50px'}}>
						<HubspotForm {...formProps}/>
					</div>
				)
			}

    </div>
  );
};

const options = {
  content: <PageContent />,
  layout: 'full',
  wrapperClasses: 'flex justify-center',
  innerStyle: { width: '100%', maxWidth: '1400px' }
};

const StudyGroups = () => <Main options={options} />;

export default StudyGroups;
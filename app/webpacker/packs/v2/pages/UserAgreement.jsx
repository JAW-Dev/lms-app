import React from 'react';
// Compoenents
import { Main } from '../components/layouts/Layouts';

const UserAgreementContent = () => (
  <>
    <h1 style={{ fontSize: '48px' }} className="text-charcoal font-extrabold  mb-4">User Agreement</h1>
    <p className="mb-4">Welcome to Admired Leadership®. We’re happy you’re here.</p>
    <p className="mb-4">When you view our content and use our services, you are agreeing to our terms, so please read the User Agreement below.</p>
    <p className="mb-4">This agreement is a legal contract between you and Admired Leadership. You acknowledge that you have read, understood and agree to be bound by the terms of this agreement. If you do not agree to this contract, you should not use or view Admired Leadership.</p>
    <p className="mb-4">The User agrees not to present, teach, distribute or in any way share the content of Admired Leadership. The User understands and agrees that the Admired Leadership content is for personal use and personal development only and that any distribution, downloading, re-transmission or sharing of the content of Admired Leadership, without the express written consent of Admired Leadership, is strictly prohibited.</p>
  </>
);

const options = {
  layout: 'full',
  content: <UserAgreementContent />,
  wrapperClasses: 'flex justify-center',
  innerStyle: { width: '100%', maxWidth: '1400px' }
};

const UserAgreement = () => <Main options={options} />;

export default UserAgreement;

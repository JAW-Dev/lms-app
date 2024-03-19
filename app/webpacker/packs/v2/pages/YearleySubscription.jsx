
import React from 'react';
// Compoenents
import { Main } from '../components/layouts/Layouts';
import Text from '../components/Text';
import Button from '../components/Button';

const UserAgreementContent = () => (
  <>
    <p className="text-grey font-bold mb-4">Subscribe to Admired Leadership</p>
    <Text size="h2" variant="h2" className="text-charcoal font-extrabold font-inter mb-6">Continue your leadership journey by setting up subscribing.</Text>
    <p className="mb-8">Extending your membership in the Admired Leadership community is easy. And a great value — <sapn className="font-bold">just $200 for another full year</sapn>.</p>

    <p className="mb-8">Here are your benefits:</p>
    <ul className="pb-6" style={{paddingLeft: '1rem'}}>
      <li style={{fontSize: '16px'}}>Continued access to all course content (including updated videos)</li>
      <li style={{fontSize: '16px'}}>Continuity of tracking history and notes</li>
      <li style={{fontSize: '16px'}}>Opportunity for involvement in monthly study groups</li>
      <li style={{fontSize: '16px'}}>Access to private “subscribers only” webinars</li>
      <li style={{fontSize: '16px'}}>Invitation to our annual Admired Leadership Community Conference</li>
      <li style={{fontSize: '16px'}}>Access to weekly book summaries to help you stay abreast of the current writings on leadership</li>
    </ul>
    <div className="flex" style={{gap: '10px'}}>
      <Button href="/program/subscriptions/new" variant="default-lowewrcase" className="font-bold capitalize" style={{ borderRadius: '12px' }}>Renew</Button>
      <Button href="/v2/contact-us" variant="outline" className="font-bold capitalize" style={{ borderRadius: '12px' }}>Talk to Someone First</Button>
    </div>
</>
);

const options = {
  layout: 'full',
  content: <UserAgreementContent />,
  wrapperClasses: 'flex justify-center',
  innerStyle: { width: '100%', maxWidth: '650px' }
};

const YearleySubscription = () => <Main options={options} />;

export default YearleySubscription;
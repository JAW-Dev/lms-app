import React from 'react';

const GiftExpired = () => {
  return (
    <div
      style={{ minHeight: '100vh' }}
      className="container mx-auto mt-12 pt-12 text-charcoal"
    >
      <h1
        style={{ letterSpacing: '-1.4px', lineHeight: '44px', maxWidth: '30ch' }}
        className="text-4xl font-extrabold mb-5"
      >
        Your Complimentary Access Has Expired
      </h1>
      <p style={{ maxWidth: '40ch' }} className="mb-4 text-md">
        The video you&apos;ve been gifted is no longer available to watch. We hope you enjoyed this sneak peek into our platform. To continue enjoying exclusive content from Admired Leadership, sign up today!
      </p>
      <a
        style={{
          background: 'linear-gradient(90deg, #6357B5 0%, #8B7FDB 100%)',
          borderRadius: '16px',
        }}
        className="text-sm text-white  font-bold items-center justify-center py-3 px-6 inline-flex"
        href="/v2/users/access"
      >
        Get Access
      </a>
    </div>
  );
};

export default GiftExpired;

import React, { useEffect } from 'react';

const HubspotForm = ({ target, wrapperProps = {}, ...props }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.hsforms.net/forms/shell.js';
    document.body.appendChild(script);

    script.addEventListener('load', () => {
      if (window.hbspt) {
        window.hbspt.forms.create({ ...props, target: `#${target}` });
      }
    });
  }, []);

  return <div id={target} {...wrapperProps} />;
};

export default HubspotForm;

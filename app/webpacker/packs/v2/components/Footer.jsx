import React from 'react';
import useResponsive from '../hooks/useResponsive';
import { footerMenu } from '../helpers/localData';

const Footer = () => {
  const { isTablet } = useResponsive();

  return (
    <footer
      className="bg-white-faint w-full flex justify-center relative"
      style={{ zIndex: '99' }}
    >
      <div className="w-full container">
        <div
          style={{ padding: '28px 45px ', gap: !isTablet ? '100px' : '20px' }}
          className="pb-24 pt-24 mb-24 w-full rounded-2lg lg:rounded-full flex justify-center items-center bg-faint-charcoal flex-wrap"
        >
          {footerMenu.map((link) => (
            <a
              key={crypto.randomUUID()}
              href={link.href}
              style={{ gap: '14px' }}
              className="flex items-center"
            >
              <p className="text-charcoal">{link.text}</p>
            </a>
          ))}
          <p>© Admired Leadership 2023</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

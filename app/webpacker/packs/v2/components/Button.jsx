import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Button = ({ className, href, onClick, children, variant, to, style }) => {
  const El = href ? 'a' : 'button';

  // const buttonClass =
  //   variant === 'purpleText'
  //     ? 'text-link-purple text-sm font-black'
  //     : 'flex px-6 py-3 bg-link-purple text-white font-extrabold uppercase rounded-full hover:bg-purple-500';

  const [buttonClass, setButtonClass] = useState();

  const buttonClassFunc = () => {
    switch (variant) {
      case 'purpleText':
        return 'text-link-purple text-sm font-black';
      case 'purpleTextNormal':
        return 'text-link-purple';
      case 'outline':
        return 'text-link-purple px-6 py-3 bg-white font-extrabold flex rounded-full border-2 border-link-purple hover:text-white hover:bg-link-purple';
      case 'outline-transparent':
        return 'text-link-purple px-6 py-3 bg-transparent font-extrabold flex rounded-full border-2 border-link-purple hover:text-white hover:bg-link-purple';

      default:
        return 'flex px-6 py-3 bg-link-purple border-2 border-link-purple text-white font-extrabold uppercase rounded-full hover:bg-purple-500 hover:border-purple-500';
    }
  };

  useEffect(() => {
    const res = buttonClassFunc();
    setButtonClass(res);
  }, []);

  return to ? (
    <Link
      style={{ width: 'fit-content', ...style }}
      className={`uppercase no-underline ${buttonClass} ${className}`}
      to={to}
    >
      <div>{children}</div>
    </Link>
  ) : (
    <El
      style={{ width: 'fit-content', ...style }}
      href={href}
      onClick={onClick}
      className={`uppercase no-underline ${buttonClass} ${className}`}
    >
      <div>{children}</div>
    </El>
  );
};

export default Button;

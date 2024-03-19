import React from 'react';

const SIZE_MAP = {
  h0: 'text-5xl md:text-9xl',
  h1: 'text-5xl lg:text-7xl',
  h2: 'text-2xl lg:text-3xl',
  h3: 'text-xl lg:text-3xl',
  h6: 'text-sm',
  'p-l': 'lg:text-xl',
  p: ''
};

const VARIANT_MAP = {
  h1: ' font-extrabold lg:font-black text-charcoal leading-none',
  h2: ' font-bold ',
  h3: 'leading-tight  text-charcoal lg:font-bold lg:font-sans',
  h4: 'leading-tight font-sans text-charcoal font-extrabold',
  'p-l': ' text-charcoal font-normal',
  p: ' text-charcoal font-medium lg:font-sans lg:font-bold',
  bold: 'font-sans font-black text-charcoal',
  boldPurple: 'font-sans text-purple-500 font-black',
  linkPurple: 'font-sans text-link-purple font-black'
};

const Text = ({ children, variant, size, className, ...rest }) => (
  <span
    className={`inline-flex items-center ${VARIANT_MAP[variant]} ${SIZE_MAP[size]} ${className}`}
    {...rest}
  >
    {children}
  </span>
);

export default Text;

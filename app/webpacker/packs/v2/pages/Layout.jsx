import React from 'react';
import { Main } from '../components/layouts/Layouts';

const Content = () => {
  const elements = Array.from({ length: 2 }, (_, index) => (
    <p key={index}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ut erat sed magna placerat ultricies. In est lectus, efficitur non feugiat ut, tempus a libero. Quisque et dapibus risus. Aliquam porttitor dolor ac lacus lacinia vehicula. Etiam aliquam diam laoreet risus imperdiet sollicitudin. Quisque sit amet turpis viverra nunc suscipit condimentum.</p>
  ));
  return (
    <>
      {elements}
    </>
  );
};

const Sidebar = () => {
  const elements = Array.from({ length: 20 }, (_, index) => (
    <li key={index}>Menu item {index}</li>
  ));
  return (
    <>
      <ul>{elements}</ul>
    </>
  );
};

const Layout = () => {
  const options = {
    layout: 'right',
    content: <Content />,
    sidebar: <Sidebar />
  };


  return <Main options={options} />;
};

export default Layout;

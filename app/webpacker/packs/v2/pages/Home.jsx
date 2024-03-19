/* eslint-disable */
import React from 'react';
import Introduction from '../components/Introduction';
import BookSummaries from '../components/BookSummaries';
import FieldNoteEventSection from '../components/FieldNoteEventSection';
import HelpToHabitCallout from '../components/HelpToHabitCallout';
import StayInTheKnow from '../components/StayInTheKnow';
import useAuthRedirect from '../hooks/useAuthRedirect';
import useAuth from '../context/AuthContext';
import GetAccess from './GetAccess';

const Home = () => {
  const { isLoading, isLoggedIn } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <>
      {isLoggedIn ? (
        <>
          <Introduction />
          <HelpToHabitCallout />
          <FieldNoteEventSection />
          <StayInTheKnow />
          <BookSummaries />
        </>
      ) : (
        <GetAccess/>
      )}
    </>
  );
};

export default Home;

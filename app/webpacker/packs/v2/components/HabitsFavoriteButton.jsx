import React from 'react';
import SVG from 'react-inlinesvg';
import { useMutation, useQueryClient } from 'react-query';
// Context
import useData from '../context/DataContext';
// API
import { habitAPI } from '../api';
// Icons
import IconHeart from '../../../../assets/images/reskin-images/icon--heart.svg';
import IconFilledHeart from '../../../../assets/images/reskin-images/icon--filled-heart.svg';

/**
 * A component that renders a button to mark a habit as a favorite.
 * @param {string} id - The ID of the habit.
 * @returns {JSX.Element} - The JSX for the button.
 */
const HabitsFavoriteButton = ({id}) => {
  // Retrieve user habits data from DataContext
  const { userHabits } = useData();

  // Instantiate a query client for managing and caching queries
  const queryClient = useQueryClient();

  // useMutation hook for mutating data, in this case to create or destroy user habits
  const { mutate } = useMutation(habitAPI.createOrDestroyUserHabit, {
    // Upon successful mutation, invalidate 'userHabits' queries to refetch fresh data
    onSuccess: () => {
      queryClient.invalidateQueries('userHabits');
    }
  });

  // Check if the current habit is already marked as a favorite by the user
  const isFavorited = userHabits?.some(
    (userHabit) => userHabit.curriculum_behavior_map_id === id
  );

  // Return a button that, when clicked, triggers the mutation for favorite habits
  // The button displays a filled heart if the habit is already a favorite, otherwise it displays a regular heart
  return (
    <button
      className="flex items-center mt-auto"
      type="button"
      onClick={() => mutate({ behaviorMapId: id })}
    >
      <SVG src={isFavorited ? IconFilledHeart : IconHeart} />{' '}
      <p className="text-sm  text-charcoal ml-2">
        {isFavorited ? 'Favorited Habit' : 'Favorite Habit'}
      </p>
    </button>
  );
};

export default HabitsFavoriteButton;
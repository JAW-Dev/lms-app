import { useQuery } from 'react-query';
import { noteAPI } from '../api';

const getCurrentBehaviorNote = (behavior) => {
  const { data } = useQuery(['currentNote', { behavior_id: behavior.id }], noteAPI.getNote);

  return data?.notes[0];
};

export default getCurrentBehaviorNote;

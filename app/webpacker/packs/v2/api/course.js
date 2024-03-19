import { apiFetch } from './apiFetch';

export const getContentData = () =>
  apiFetch({
    url: '/api/v2/courses',
  });

export const getCourse = ({ courseId }) => {
  return apiFetch({
    url: `/api/v2/courses/${courseId}`,
  });
}


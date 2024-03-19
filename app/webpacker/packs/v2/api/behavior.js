import { apiFetch } from './apiFetch';

export const getBehavior = ({ behaviorId }) => {
  apiFetch({
    url: '/api/v1/behaviors',
    method: 'POST',
    body: { behaviors: { id: behaviorId } },
  });
}

export const getBehaviors = () => {
  apiFetch({
    url: '/api/v2/behaviors/get_behaviors',
    method: 'GET',
  });
}

export const getBeahviorDetails = ({ behaviorId }) => {
  apiFetch({
    url: '/api/v2/behaviors',
    method: 'POST',
    body: { behaviors: { id: behaviorId } },
  });
}
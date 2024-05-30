import {getAxiosInstance} from './Api';

export function getLiveStreamUrl({token}) {
  return getAxiosInstance({token}).get('/api/v1/consumers/streaming', {
    params: {},
  });
}

export function getScheduleEventList({token}) {
  return getAxiosInstance({token}).get(
    '/api/v1/consumers/schedule_event_details',
    {
      params: {},
    },
  );
}

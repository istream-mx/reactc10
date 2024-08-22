import {getAxiosInstance} from './Api';

export function getNews({token, filter}) {
  return getAxiosInstance({token}).get(`/api/v1/news`, {
    params: filter,
  });
}

export function getNewById({token, id}) {
  return getAxiosInstance({token}).get(`/api/v1/new`, {params: {id}});
}

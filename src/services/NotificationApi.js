import {getAxiosInstance} from './Api';

export function createTokenNotification({
  token,
  tokenNotification,
  typeDevice,
}) {
  return getAxiosInstance({token}).post(`/api/v1/push_notification/token`, {
    token: tokenNotification,
    type_device: typeDevice,
  });
}

import { Platform } from 'react-native'
export const getDeepLink = (path = "") => {
  const scheme = 'vidupapp-scheme'
  const prefix = Platform.OS == 'android' ? `${scheme}://vidupapp-host/` : `${scheme}://`
  return prefix + path
}
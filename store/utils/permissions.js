import { PermissionsAndroid } from 'react-native';

export const _requestPermission = async (permission, response) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.permission);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          response(true)
      } else {
        response(false)
      }
    } catch (err) {
    }
  };
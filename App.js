import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { View, Text, Image, Platform, Linking } from 'react-native';
import configureStore from './store/configureStore';
const { store } = configureStore();
import DeviceInfo from 'react-native-device-info';
import MainApp from './src/App';
import { Root } from 'native-base';
import FlashMessage, { renderFlashMessageIcon } from 'react-native-flash-message';
import { noUserPlaceholder } from 'assets';
import checkVersion from 'react-native-store-version';
import { UpdateApp } from './src/components/update-app';
const customRenderFlashMessageIcon = (icon, style = {}, authToken = '', customProps = {}) => {
  if (icon == 'noProfilePic') {
    return (
      <Image
        source={noUserPlaceholder}
        style={{
          width: 45,
          height: 45,
          borderRadius: 45,
          marginHorizontal: 15,
        }}
      />
    );
  }
  if (icon != 'noProfilePic') {
    return (
      <Image
        source={{
          uri: icon,
          headers: {
            Authorization: `jwt ${authToken}`,
          },
        }}
        style={{
          width: 45,
          height: 45,
          borderRadius: 45,
          marginHorizontal: 15,
        }}
      />
    );
  }
  // it's good to inherit the original method...
  return renderFlashMessageIcon(icon, style, customProps);
};

export const Loading = () => (
  <View>
    <Text>Loading....</Text>
  </View>
);

export default App = () => {
  const init = async () => {
    try {
      const check = await checkVersion({
        version: DeviceInfo.getVersion(), // app local version
        iosStoreURL: 'https://apps.apple.com/la/app/picram/id1525223582',
        androidStoreURL: 'https://play.google.com/store/apps/details?id=com.picramapp',
        country: 'pk', // default value is 'jp'
      });
      if (check.result === 'new') {
        setUpdate(true);
      }
    } catch (e) {
      // console.log(e);
    }
  };

  useEffect(() => {
    // Update the links
    // init();
  }, []);

  const [update, setUpdate] = useState(false);
  return (
    <Provider store={store}>
      <Root>
        <MainApp />
        <UpdateApp
          onPress={() =>
            Platform.OS === 'ios'
              ? Linking.openURL('https://apps.apple.com/la/app/picram/id1525223582')
              : Linking.openURL('https://play.google.com/store/apps/details?id=com.picramapp')
          }
          isVisible={update}
          isLoading={false}
          discriptionText={'New update available  \n Please update to the new version'}
        />
        <FlashMessage renderFlashMessageIcon={customRenderFlashMessageIcon} position="top" />
      </Root>
    </Provider>
  );
};

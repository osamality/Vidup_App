import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'native-base';
import { styles } from './styled';
import { connect } from 'react-redux';
import { Color, FontFamily } from 'constants';
import { logout, darkLogout } from 'assets';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import { Topheader } from '../../../../../components';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { WebView } from 'react-native-webview';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { BASE_URL_API } from '../../../../../../store/utils/Config';

const PrivacyPolicy = (props) => {
  const { navigation } = props;
  const { colors } = useTheme();

  const openLink = async (url) => {
    if (await InAppBrowser.isAvailable()) {
      const result = await InAppBrowser.open(url);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
      <View style={{ overflow: 'hidden' }}>
        <Topheader
          onPressLeft={() => navigation.goBack()}
          currentIndex={colors.background == '#fff' ? 0 : 1}
          origin={'Privacy Policy'}
          showChatIcon={false}
        />
      </View>
      <View style={{ flex: 1, marginTop: 10, marginHorizontal: widthPercentageToDP(3) }}>
        <WebView
          bounces={false}
          source={{ uri: `${BASE_URL_API}/api/apps/user_service/privacy_policy/` }}
        />
      </View>
    </SafeAreaView>
  );
};
function mapStateToProps(state) {
  return {
    user: state.user.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearStateDispatch: () =>
      dispatch({
        type: 'Clear_Auth',
        payload: {},
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivacyPolicy);

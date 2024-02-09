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
import { Switch } from 'native-base';
import { Topheader } from '../../../../../components';
import { WebView } from 'react-native-webview';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { BASE_URL_API } from '../../../../../../store/utils/Config';

const LegalInformation = (props) => {
  const { navigation } = props;
  const { colors } = useTheme();

  return (
    <View style={{ backgroundColor: colors.card, flexGrow: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
        <View style={{ overflow: 'hidden' }}>
          <Topheader
            onPressLeft={() => navigation.goBack()}
            currentIndex={colors.background == '#fff' ? 0 : 1}
            origin={'Legal Information'}
            showChatIcon={false}
          />
        </View>
        <View style={{ flex: 1, marginTop: 10, marginHorizontal: widthPercentageToDP(3) }}>
          <WebView
            source={{ uri: `${BASE_URL_API}/api/apps/user_service/terms_and_conditions/` }}
          />
        </View>
      </SafeAreaView>
    </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(LegalInformation);

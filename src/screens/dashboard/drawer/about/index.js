import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'native-base';
import { styles } from './styled';
import { connect } from 'react-redux';
import { Color, FontFamily } from 'constants';
import { logout, darkLogout } from 'assets';
import { Topheader, Statusbar, Modalbtn } from '../../../../components';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import { Switch } from 'native-base';
const About = (props) => {
  const { navigation } = props;
  const { colors } = useTheme();

  return (
    <View style={{ backgroundColor: colors.card, flexGrow: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
        {/* <View style={{ overflow: 'hidden', paddingBottom: 5 }}>
                    <View style={[styles.topBar, { backgroundColor: colors.card }]}>
                        <TouchableHighlight onPress={() => navigation.goBack()} underlayColor="none">
                            <Icon type="Entypo" name='chevron-thin-left' style={{ fontSize: 18, color: colors.text }} />
                        </TouchableHighlight>
                        <Text style={{ fontSize: RFValue(14), color: colors.text, fontFamily: FontFamily.medium }}>About</Text>
                        <View></View>
                    </View>
                </View> */}
        <View style={{ overflow: 'hidden' }}>
          <Topheader
            currentIndex={colors.background == '#fff' ? 0 : 1}
            onPressLeft={() => navigation.goBack()}
            origin={'About'}
            showChatIcon={false}
          />
        </View>
        <View style={{ paddingHorizontal: 20, backgroundColor: colors.background, flex: 1 }}>
          <View
            style={{
              borderBottomWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 15,
              borderBottomColor: colors.background == '#fff' ? '#e4e4e4' : colors.inputBorder,
            }}>
            <Image
              source={{
                uri: colors.background == '#fff' ? 'privacypolicydim' : 'privacypolicydark',
              }}
              style={styles.bodyIcon}
              resizeMode={'contain'}
            />
            <TouchableOpacity
              onPress={() => navigation.push('PrivacyPolicyScreen')}
              underlayColor="none">
              <Text style={[styles.bodyText, { color: colors.text }]}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 15,
              borderBottomColor: colors.background == '#fff' ? '#e4e4e4' : colors.inputBorder,
            }}>
            <Image
              source={{
                uri: colors.background == '#fff' ? 'legalinformationdim' : 'legalinformationdark',
              }}
              style={styles.bodyIcon}
              resizeMode={'contain'}
            />
            <TouchableOpacity
              onPress={() => navigation.push('LegalInformation')}
              underlayColor="none">
              <Text style={[styles.bodyText, { color: colors.text }]}>Legal Information</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 15,
              borderBottomColor: colors.background == '#fff' ? '#e4e4e4' : colors.inputBorder,
            }}>
            <Image
              source={{ uri: colors.background == '#fff' ? 'supportdim' : 'supportdark' }}
              style={styles.bodyIcon}
              resizeMode={'contain'}
            />
            <TouchableOpacity onPress={() => navigation.push('SupportScreen')} underlayColor="none">
              <Text style={[styles.bodyText, { color: colors.text }]}>Support</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={{ color: colors.text, marginTop: RFValue(10) }}>App Version 1.0.0</Text>
          </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);

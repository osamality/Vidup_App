import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'native-base';
import { styles } from './styled';
import { connect } from 'react-redux';
import { Color, FontFamily } from 'constants';
import { RFValue } from 'react-native-responsive-fontsize';
import { Topheader, Statusbar, Modalbtn } from '../../../../components';
import { lightVerifyBadge, darkVerifyBadge, resetEmailIcon } from 'assets';
import { useTheme } from '@react-navigation/native';
import { verifyAccountCheck } from '../../../../../store/actions/user';
import testProps from 'locatorId';

const ManageAccount = (props) => {
  const {
    navigation,
    verifyAccountRequestDispatch,
    userVerifiedStatus,
    changeEmailRequestedStatus,
  } = props;
  const { colors } = useTheme();

  useEffect(() => {
    changeEmailRequestedStatus();
    verifyAccountRequestDispatch();
  }, []);

  return (
    <View style={{ backgroundColor: colors.card, flexGrow: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
        <View style={{ overflow: 'hidden' }}>
          <Topheader
            onPressLeft={() => navigation.goBack()}
            currentIndex={colors.background == '#fff' ? 0 : 1}
            origin={'Manage Account'}
            showChatIcon={false}
          />
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 5,
            backgroundColor: colors.background,
            flex: 1,
          }}>
          <View
            style={{
              borderBottomWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 15,
              borderBottomColor: colors.background == '#fff' ? '#e4e4e4' : colors.inputBorder,
            }}>
            <Image
              source={colors.background == '#fff' ? lightVerifyBadge : darkVerifyBadge}
              style={styles.bodyIcon}
              resizeMode={'contain'}
            />
            <TouchableOpacity
              {...testProps('manageAccountVerificationBtn')}
              onPress={() => {
                userVerifiedStatus?.message
                  ? userVerifiedStatus.message ==
                      'Your account verification is in progress.This may take upon 14 working days.' &&
                    navigation.navigate('VerifyProgressScreen')
                  : {};

                if (userVerifiedStatus.data) {
                  if (
                    userVerifiedStatus.data.result_code === 1 ||
                    userVerifiedStatus.data.result_code === 2
                  ) {
                    navigation.navigate('VerifyProgressScreen');
                  } else {
                    navigation.navigate('AccountVerificationScreen');
                  }
                }
              }}
              underlayColor="none">
              <Text style={[styles.bodyText, { color: colors.text }]}>Request Verification</Text>
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
              source={resetEmailIcon}
              style={{
                ...styles.bodyIcon,
                tintColor: colors.background == '#fff' ? '#1C1C1C' : '#FFFFFF',
              }}
              resizeMode={'contain'}
            />
            <TouchableOpacity
              {...testProps('ChangeEmailScreenInManageAccount')}
              onPress={() => navigation.push('ChangeEmailScreenInManageAccount')}
              underlayColor="none">
              <Text style={[styles.bodyText, { color: colors.text }]}>Change Email Address</Text>
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
              source={{ uri: colors.background == '#fff' ? 'passworddim' : 'passworddark' }}
              style={styles.bodyIcon}
              resizeMode={'contain'}
            />
            <TouchableOpacity
              {...testProps('manageAccountPasswordBtn')}
              onPress={() => navigation.push('ResetPasswordScreenInManageAccount')}
              underlayColor="none">
              <Text style={[styles.bodyText, { color: colors.text }]}>Change Password</Text>
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
            <TouchableOpacity
              {...testProps('manageAccountDeactivateAccountBtn')}
              onPress={() => navigation.push('DeactivateAccountScreen')}
              underlayColor="none">
              <Text style={[styles.bodyText, { color: '#007AFF', marginLeft: RFValue(5) }]}>
                Deactivate Account
              </Text>
            </TouchableOpacity>
          </View>
          {/* <View style={{ borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomColor: colors.background == '#fff' ? '#e4e4e4' : colors.inputBorder }}>
            <TouchableOpacity onPress={() => navigation.push('SavedScreen')} underlayColor="none">
              <Text style={[styles.bodyText, { color: '#007AFF', marginLeft: RFValue(5) }]}>Delete Account</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </SafeAreaView>
    </View>
  );
};
function mapStateToProps(state) {
  return {
    userVerifiedStatus: state.user.userVerifiedStatus,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    verifyAccountRequestDispatch: (payload) => dispatch(verifyAccountCheck(payload)),
    changeEmailRequestedStatus: () => {
      dispatch({
        type: 'CHANGE_EMAIL_REQUEST',
        payload: false,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageAccount);

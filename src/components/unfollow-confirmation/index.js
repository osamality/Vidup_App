import React from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  View,
  Keyboard,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import testProps from 'locatorId';
import { DarkTheme, useTheme, DefaultTheme } from '@react-navigation/native';
import { Icon, Text, Thumbnail, Picker, Item, Button } from 'native-base';
import { ProfileThumb } from 'components';
import { styles } from './styled';
import { noUserFound, noUserPlaceholder, darkNoUserFound } from 'assets';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import { Color, FontFamily } from 'constants';
import Modal from 'react-native-modal';

export const UnfollowConfirmation = ({
  type,
  user,
  isVisible,
  isLoading,
  onUnfollow,
  hideConfirmation,
  placeholderTextColor = Color.LightGrey1,
  editable = true,
}) => {
  const { colors } = useTheme();

  return (
    <View>
      <Modal
        testID={'modal'}
        isVisible={isVisible}
        onBackdropPress={hideConfirmation}
        swipeDirection={['up', 'left', 'right', 'down']}
        style={styles.view}>
        <View style={{ backgroundColor: colors.card, borderRadius: RFValue(10) }}>
          <View
            style={{
              width: '100%',
              paddingVertical: RFValue(10),
              borderBottomWidth: 0,
              borderBottomColor: colors.background == '#fff' ? '#F2F2F7' : Color.LightGrey3,
            }}>
            <View
              style={{
                borderWidth: 3,
                borderRadius: 50,
                borderColor: Color.LightGrey1,
                width: RFValue(50),
                alignSelf: 'center',
                marginTop: 10,
              }}></View>
          </View>
          <View style={{ width: '100%', paddingTop: RFValue(5) }}>
            {type != 'signout' && type != 'discardVideo' && type != 'removeDocument' && (
              <View>
                {user?.profile_pic ? (
                  <ProfileThumb profilePic={user.profile_pic} style={styles.thumbnail} />
                ) : (
                  <Thumbnail source={noUserPlaceholder} style={styles.thumbnail} />
                )}
              </View>
            )}

            {type == 'discardVideo' ? (
              <Text
                style={{
                  marginHorizontal: RFValue(8),
                  color: colors.text,
                  alignSelf: 'center',
                  textAlign: 'center',
                  fontFamily: FontFamily.normal,
                  paddingTop: RFValue(15),
                }}>
                Your video will be discarded, Are you sure to go back?
              </Text>
            ) : (
              <Text
                style={{
                  marginHorizontal: RFValue(8),
                  color: colors.text,
                  alignSelf: 'center',
                  textAlign: 'center',
                  fontFamily: FontFamily.normal,
                  paddingTop: RFValue(15),
                }}>
                {`Are you sure you want to ${
                  type == 'remove'
                    ? 'remove'
                    : type == 'signout'
                    ? 'sign out'
                    : type == 'removeDocument'
                    ? 'remove selected document'
                    : 'unfollow'
                }`}
                <Text
                  style={{
                    color: colors.text,
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontFamily: FontFamily.normal,
                    fontWeight: 'bold',
                    paddingTop: RFValue(15),
                  }}>
                  {type != 'signout' && type != 'removeDocument' && ` @${user?.username} `}
                </Text>
                ?
              </Text>
            )}

            <View
              style={{
                marginBottom: RFValue(35),
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'center',
              }}>
              <TouchableHighlight
                onPress={onUnfollow}
                underlayColor="none"
                style={{ marginTop: RFValue(20) }}>
                <Button
                  onPress={onUnfollow}
                  style={[styles.outlineButton, { maxWidth: 100, marginRight: RFValue(10) }]}
                  transparent>
                  <Text
                    {...testProps('supportBtn')}
                    style={{
                      width: '100%',
                      color: '#FB6200',
                      textAlign: 'center',
                      alignSelf: 'center',
                      fontSize: 12,
                      fontFamily: FontFamily.regular,
                      fontWeight: '400',
                      textTransform: 'capitalize',
                    }}>
                    {type == 'remove' || type == 'removeDocument'
                      ? 'Remove'
                      : type == 'signout'
                      ? 'Sign out'
                      : type == 'discardVideo'
                      ? 'Go Back'
                      : 'Unfollow'}
                  </Text>
                </Button>
              </TouchableHighlight>
              {isLoading ? (
                <TouchableHighlight underlayColor="none" style={{ marginTop: RFValue(20) }}>
                  <LinearGradient
                    colors={['#FB6200', '#EF0059']}
                    start={{ x: 1, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={[styles.loginButton, { maxWidth: 100, minWidth: 100 }]}>
                    <ActivityIndicator color={'#fff'} size={'small'} style={{ fontSize: 12 }} />
                  </LinearGradient>
                </TouchableHighlight>
              ) : (
                <TouchableHighlight
                  underlayColor="none"
                  style={{ marginTop: RFValue(20) }}
                  onPress={hideConfirmation}>
                  <LinearGradient
                    colors={['#FB6200', '#EF0059']}
                    start={{ x: 1, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={[styles.loginButton, { maxWidth: 100, minWidth: 100 }]}>
                    <Text
                      {...testProps('supportBtn')}
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        alignSelf: 'center',
                        color: '#fff',
                        fontSize: 12,
                        fontFamily: FontFamily.regular,
                        fontWeight: '400',
                        textTransform: 'capitalize',
                      }}>
                      Cancel
                    </Text>
                  </LinearGradient>
                </TouchableHighlight>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

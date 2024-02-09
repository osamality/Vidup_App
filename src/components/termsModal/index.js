import { Text, View, Image, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { Button, CheckBox } from 'native-base';
import React, { useState } from 'react';
import { styles } from './styled';
import { Color, FontFamily } from 'constants';
import { closeIcon, badgeChecdVerified } from 'assets';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import testProps from 'locatorId';

import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Feather';
import { BASE_URL_API } from '../../../store/utils/Config';

export const TermsModal = ({ onBackClick, isVisible, onAcceptTerms }) => {
  const { colors } = useTheme();
  const [check, setCheck] = useState(false);

  return (
    <View>
      <Modal
        testID={'modal'}
        isVisible={isVisible}
        useNativeDriver={true}
        // onBackdropPress={onBackClick}
        style={{ margin: 20, marginVertical: 40 }}>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: RFValue(10),
          }}>
          {/* <Pressable
            onPress={onBackClick}
            style={{ position: 'absolute', right: 20, top: 20, zIndex: 9 }}>
            <Image resizeMode={'contain'} source={closeIcon} style={{ width: 16, height: 16 }} />
          </Pressable> */}
          <View style={{ height: hp(72), width: wp(80), alignSelf: 'center' }}>
            <WebView
              //   scrollEnabled={false}
              //   show
              source={{ uri: `${BASE_URL_API}/api/apps/user_service/terms_and_conditions/` }}
              style={{ marginTop: 15 }}
            />
          </View>
          <View
            style={{
              marginBottom: 18,
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 5,
                marginLeft: 15,
                justifyContent: 'center',
              }}>
              {check ? (
                <TouchableOpacity onPress={() => setCheck(!check)}>
                  <View
                    style={{
                      height: 18,
                      width: 18,
                      backgroundColor: check ? Color.Orange : 'white',
                      borderWidth: 0,
                      borderColor: Color.Orange,
                      borderRadius: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 1,
                    }}>
                    <Icon name={'check'} color={'white'} size={15} style={{ marginTop: 2 }} />
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setCheck(!check)}>
                  <View
                    style={{
                      height: 18,
                      width: 18,
                      backgroundColor: check ? Color.Orange : 'white',
                      borderWidth: 1,
                      borderColor: Color.Orange,
                      borderRadius: 5,
                      marginTop: 1,
                    }}></View>
                </TouchableOpacity>
              )}
              <Text
                style={{
                  width: wp(72),
                  marginLeft: wp(3),
                  fontSize: RFValue(12),
                  color: '#818181',
                }}>
                I have read and accept the changes in Terms and Conditions
              </Text>
            </View>
            {check ? (
              <TouchableOpacity
                onPress={onAcceptTerms}
                underlayColor="none"
                style={{ marginTop: RFValue(4), alignItems: 'flex-end' }}>
                <LinearGradient
                  colors={['#FB6200', '#EF0059']}
                  start={{ x: 1, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={{
                    maxWidth: 80,
                    minWidth: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    height: 35,
                    marginRight: 25,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      alignSelf: 'center',
                      color: '#fff',
                      fontFamily: FontFamily.regular,
                      fontWeight: '400',
                      fontSize: 12,
                      textTransform: 'capitalize',
                    }}>
                    Done
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                disabled={true}
                onPress={onAcceptTerms}
                underlayColor="none"
                style={{ marginTop: RFValue(10), alignItems: 'flex-end' }}>
                <LinearGradient
                  colors={['#FB6200', '#EF0059']}
                  start={{ x: 1, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={{
                    maxWidth: 80,
                    opacity: 0.5,
                    minWidth: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    height: 35,
                    marginRight: 25,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      alignSelf: 'center',
                      color: '#fff',
                      fontFamily: FontFamily.regular,
                      fontWeight: '400',
                      fontSize: 12,
                      textTransform: 'capitalize',
                    }}>
                    Done
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

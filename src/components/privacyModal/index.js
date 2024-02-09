import { Text, View, Image, ScrollView, Pressable } from 'react-native';
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
import { color } from 'react-native-reanimated';
import { BASE_URL_API } from '../../../store/utils/Config';

export const PrivacyModal = ({ onBackClick, isVisible }) => {
  const { colors } = useTheme();
  const [check, setCheck] = useState(false);

  return (
    <View>
      <Modal
        testID={'modal'}
        isVisible={isVisible}
        onBackdropPress={onBackClick}
        style={{ margin: 20, marginVertical: 40 }}>
        <ScrollView
          style={{
            backgroundColor: '#fff',
            height: hp(88),
            borderRadius: RFValue(10),
          }}>
          <Pressable
            onPress={onBackClick}
            style={{ position: 'absolute', right: 20, top: 20, zIndex: 9 }}>
            <Image resizeMode={'contain'} source={closeIcon} style={{ width: 16, height: 16 }} />
          </Pressable>
          <View style={{ height: hp(77), width: wp(80), alignSelf: 'center' }}>
            <WebView
              showsVerticalScrollIndicator={false}
              //   scrollEnabled={false}
              //   show
              source={{ uri: `${BASE_URL_API}/api/apps/user_service/privacy_policy/` }}
              style={{ marginTop: 40 }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              marginLeft: 10,
            }}>
            <CheckBox
              checked={check}
              onPress={() => setCheck(!check)}
              style={{
                backgroundColor: check ? Color.Orange : 'white',
                borderWidth: 0,
                borderColor: Color.Orange,
                borderRadius: 5,
              }}
            />
            <Text style={{ width: wp(70), marginLeft: wp(5) }}>
              I have read and accept the changes in Terms and Conditions
            </Text>
          </View>
          <Pressable
            onPress={onBackClick}
            underlayColor="none"
            style={{ marginTop: RFValue(10), alignItems: 'flex-end' }}>
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
                marginRight: 30,
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
          </Pressable>
        </ScrollView>
      </Modal>
    </View>
  );
};

import { Text, View, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Badge, Icon } from 'native-base';
import React from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { dmIcon, cameraFlip, lightMessageIcon, darkMessageIcon } from 'assets';
import { Color, FontFamily } from 'constants';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import testProps from 'locatorId';

//onPress={onPressRight}- Add at TouchableWithoutFeedback if you want to activate Chat screen   marginBottom: colors.background == '#fff' ? 10 : 0
export const TopHeader = ({
  currentIndex = 0,
  origin = 'home',
  onPressLeft = null,
  onPressRight = null,
  showChatIcon = false,
  textTransform = 'capitalize',
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.topHeader,
        { backgroundColor: colors.card, marginBottom: currentIndex == 0 ? 10 : 0 },
      ]}>
      {origin == 'home' ? (
        <View style={{ alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
          <Image
            {...testProps('homeTopHeaderLogoImg')}
            style={styles.logo}
            source={require('../../assets/images/logo/logo-small.png')}
          />
          <Text
            {...testProps('homeTopHeaderLogoText')}
            style={[styles.logoText, { color: colors.text }]}>
            VIDUP
          </Text>
        </View>
      ) : (
        <View {...testProps('homeTopHeaderBackBtn')} style={{ width: 30 }}>
          <Icon
            onPress={onPressLeft}
            type="Entypo"
            name="chevron-thin-left"
            style={{ fontSize: 20, color: colors.text }}
          />
        </View>
      )}

      {origin !== 'home' && (
        <View style={{ flexGrow: 1, alignContent: 'center', alignItems: 'center' }}>
          <Text
            {...testProps('TopHeaderOriginText')}
            style={[
              styles.logoText,
              {
                marginLeft: 0,
                color: colors.text,
                fontFamily: FontFamily.medium,
                fontSize: RFValue(16),
                textTransform: textTransform,
                marginLeft: -30,
              },
            ]}>
            {origin}
          </Text>
        </View>
      )}
      {showChatIcon ? (
        <TouchableWithoutFeedback>
          <View>
            <Image
              style={[styles.logo, { width: wp('5%'), height: wp('5%') }]}
              source={colors.background == '#fff' ? lightMessageIcon : darkMessageIcon}
            />
            <Badge
              style={{
                backgroundColor: Color.Orange,
                height: 15,
                width: 15,
                position: 'absolute',
                top: -5,
                right: -5,
              }}>
              <Text {...testProps('TopHeaderChatBtn')} style={{ fontSize: 5, color: 'white' }}>
                2
              </Text>
            </Badge>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: hp('3%'),
    // marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4.65,
    elevation: 6,
    zIndex: 9999,
  },
  logo: {
    width: 23.2,
    height: 18.6,
  },
  logoText: {
    fontWeight: '500',
    marginLeft: 10,
    fontSize: 16,
  },
});

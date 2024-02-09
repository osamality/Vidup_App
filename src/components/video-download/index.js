import React, { useState } from 'react';
import { Input, Item, Icon } from 'native-base';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Color, FontFamily } from 'constants';
import testProps from 'locatorId';
import { DarkTheme, useTheme, DefaultTheme } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const VideoDownloadModal = ({ incommingText = 'Exporting Video...' }) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 99999,
        alignContent: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          width: wp('40%'),
          height: wp('28%'),
          backgroundColor: 'black',
          opacity: 0.6,
          borderRadius: 8,
        }}>
        <ActivityIndicator color={'white'} size="large" />
        <Text
          style={{
            marginTop: 15,
            fontSize: 16,
            color: 'white',
            fontFamily: FontFamily.bold,
          }}>
          {incommingText}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: hp('6%'),
    fontSize: hp('1.7%'),
    paddingLeft: 20,
  },
});

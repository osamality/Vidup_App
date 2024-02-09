import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Container, Text, View, Thumbnail, Icon } from 'native-base';
import {
  TouchableHighlight,
  Image,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { RFValue } from 'react-native-responsive-fontsize';
import { Color, FontFamily } from 'constants';
import moment from 'moment';
import testProps from 'locatorId';
import { _Toast } from 'components';
import FastImage from 'react-native-fast-image';



export const renderWeeklyVideos = ({ item }, colors, loggedInUser, navigation) => {
    console.log("-------- " ,item)
  return (
    <View style={{ paddingHorizontal: wp('5%') }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: Color.Orange,
              width: 10,
              height: 10,
              borderRadius: 100,
              marginRight: 5,
            }}></View>
          <Text
            style={{
              fontSize: RFValue(12),
              fontFamily: FontFamily.regular,
              color: colors.text,
            }}>
            {moment(item.created_at).format('MMM DD, YYYY')}{' '}
            <Text
              style={{
                fontSize: RFValue(12),
                fontFamily: FontFamily.bold,
                color: colors.text,
              }}>
              {moment(item.created_at).format('h:mm a')}
            </Text>
          </Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          {/* <Icon type="SimpleLineIcons" name='lock' style={{ fontSize: 16, marginRight: 10 }} /> */}
          <Menu>
            <MenuTrigger
              customStyles={{
                triggerText: {
                  color: 'white',
                },
                triggerWrapper: {
                  backgroundColor: 'transparent',
                },
                triggerTouchable: {
                  underlayColor: 'transparent',
                  activeOpacity: 70,
                },
              }}>
              <Icon
                type="Entypo"
                name="dots-three-vertical"
                style={{ fontSize: 16, color: colors.text }}
              />
            </MenuTrigger>
            <MenuOptions
              optionsContainerStyle={{
                marginTop: RFValue(25),
                width: RFValue(130),
                marginRight: RFValue(10),
                marginLeft: -10,
                paddingVertical: 10,
                backgroundColor: colors.card,
              }}>
              <MenuOption style={{ marginVertical: RFValue(5) }} onSelect={()=> onsubmit(item.id)}>
                <Text
                  style={{
                    color: colors.text,
                    paddingLeft: RFValue(15),
                  }}>
                  Share
                </Text>
              </MenuOption>
              <MenuOption
                style={{ marginVertical: RFValue(5) }}
                onSelect={() => _exportAndShare(item)}>
                <Text
                  style={{
                    color: colors.text,
                    paddingLeft: RFValue(15),
                  }}>
                  Edit
                </Text>
              </MenuOption>
              <MenuOption
                style={{ marginVertical: RFValue(5) }}
                onSelect={() => openDialog(item.id)}>
                <Text
                  style={{
                    color: colors.text,
                    paddingLeft: RFValue(15),
                  }}>
                  Delete
                </Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            backgroundColor: Color.Orange,
            width: 2,
            marginTop: -8,
            marginLeft: 3.5,
            height: wp('26%'),
            marginRight: 5,
          }}></View>
        <View
          style={{
            marginVertical: 10,
            marginLeft: 10,
            height: wp('18%'),
          }}>
          <TouchableHighlight
            onPress={() =>
              navigation.navigate('weeklyVideoViewScreen', {
                uri: item.media_file,
                videoData: item,
                thumbnails: item.thumbnails_list,
              })
            }
            underlayColor="none">
            <View
              style={{
                overflow: 'hidden',
                width: wp('82%'),
                marginLeft: 10,
                flexDirection: 'row',
              }}>
              {item?.thumbnails_list.map((thumbs) => {
                return (
                  <FastImage
                    {...testProps('profileWeeklyThumb')}
                    style={{ width: 50, height: 60 }}
                    resizeMode={FastImage.resizeMode.stretch}
                    source={{
                      uri: thumbs,
                      priority: FastImage.priority.high,
                      headers: {
                        Authorization: `jwt ${loggedInUser.token}`,
                      },
                    }}
                  />
                );
              })}
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
};

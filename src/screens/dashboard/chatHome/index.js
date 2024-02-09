import React, { useEffect } from 'react';
import { Thumbnail, Text, View, Icon, Input, Item, Badge } from 'native-base';
import { styles } from './styled';
import { TouchableHighlight, StatusBar, FlatList, TouchableWithoutFeedback } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { heightPercentageToDP, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Statusbar } from './../../../components';
import { RFValue } from 'react-native-responsive-fontsize';
import { Color, FontFamily } from 'constants';

const Tab = createMaterialTopTabNavigator();

const DATA = [
  {
    id: '@john.doe',
    title: 'First Item',
    uri: require('../../../assets/images/post-1.jpg'),
    time: '19:11',
    message: 'Your video is very impressive',
  },
  {
    id: '@william.josh',
    title: 'Second Item',
    uri: require('../../../assets/images/post-1.jpg'),
    time: '18:22',
    message: 'Sure and thanks',
  },
  {
    id: '@martin.rakesh',
    title: 'Third Item',
    uri: require('../../../assets/images/post-1.jpg'),
    time: '09:56',
    message: 'Its funny i agree',
  },
];

const ChatHome = ({ navigation }) => {
  return (
    <View style={[styles.MainContainer, { marginTop: RFValue(15) }]}>
      <Statusbar />
      <View style={{ overflow: 'hidden', paddingBottom: 5 }}>
        <View style={[styles.topHeader, { justifyContent: 'space-between' }]}>
          <Icon
            onPress={() => navigation.goBack()}
            type="Entypo"
            name="chevron-thin-left"
            style={{ fontSize: 20, color: '#464646' }}
          />
          <Text
            style={{ fontFamily: FontFamily.medium, fontSize: RFValue(16), color: Color.DarkGrey }}>
            Chat
          </Text>
          <View></View>
          {/* <TouchableHighlight onPress={() => navigation.navigate("ChatScreen")} underlayColor="white">
                        <Icon type="Feather" name='edit'
                            style={{ fontSize: 20, color: '#464646' }} />
                    </TouchableHighlight> */}
        </View>
      </View>
      <View style={{ flex: 1, paddingHorizontal: wp('4%') }}>
        <Item rounded style={{ width: '100%', marginTop: wp('3%') }}>
          <Icon
            type="EvilIcons"
            name="search"
            style={{ fontSize: RFValue(20), marginLeft: RFValue(5), paddingRight: 0 }}
          />
          <Input
            placeholder="Search..."
            style={{ fontSize: RFValue(14), fontFamily: FontFamily.light }}
          />
        </Item>

        <Text
          style={{
            marginVertical: wp('6%'),
            fontSize: RFValue(12),
            fontFamily: FontFamily.medium,
            color: Color.DarkGrey,
          }}>
          Online
        </Text>

        <View>
          <FlatList
            showsVerticalScrollIndicator={false}
            horizontal
            data={DATA}
            renderItem={({ item, index, separators }) => (
              <TouchableWithoutFeedback onPress={() => navigation.navigate('ChatScreen')}>
                <View
                  style={{
                    width: wp('17%'),
                    overflow: 'hidden',
                    justifyContent: 'space-between',
                    marginRight: 10,
                  }}>
                  <Thumbnail source={require('../../../assets/images/profile.jpg')} />
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: RFValue(10),
                      fontFamily: FontFamily.regular,
                      color: Color.MediumGrey,
                      marginTop: RFValue(5),
                    }}>
                    {item.id}
                  </Text>
                  <Badge
                    success
                    style={{
                      height: RFValue(10),
                      width: RFValue(10),
                      position: 'absolute',
                      top: 4,
                      right: RFValue(14),
                    }}></Badge>
                </View>
              </TouchableWithoutFeedback>
            )}
          />
        </View>

        <Text
          style={{
            marginVertical: wp('6%'),
            fontSize: RFValue(12),
            fontFamily: FontFamily.medium,
            color: Color.DarkGrey,
          }}>
          Recent Chats
        </Text>

        <View style={{ height: heightPercentageToDP('62%') }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={DATA}
            renderItem={({ item, index, separators }) => (
              <TouchableWithoutFeedback onPress={() => navigation.navigate('ChatScreen')}>
                <View
                  style={{
                    flexDirection: 'row',
                    flexGrow: 1,
                    justifyContent: 'space-between',
                    marginVertical: RFValue(8),
                  }}>
                  <View style={{ overflow: 'hidden', justifyContent: 'space-between' }}>
                    <Thumbnail source={require('../../../assets/images/profile.jpg')} />
                    {index < 2 && (
                      <Badge
                        success
                        style={{ height: 12, width: 10, position: 'absolute', top: 0, right: 0 }}
                      />
                    )}
                  </View>
                  <View style={{ flex: 1, flexGrow: 1, marginLeft: 10 }}>
                    <Text
                      style={{
                        marginBottom: 5,
                        fontFamily: index < 2 ? FontFamily.bold : FontFamily.regular,
                        fontSize: RFValue(12),
                        color: Color.DarkGrey,
                      }}>
                      Jhon Doe
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: RFValue(12),
                        color: Color.MediumGrey,
                        fontFamily: index < 2 ? FontFamily.bold : FontFamily.regular,
                      }}>
                      {item.message}
                    </Text>
                  </View>
                  <View style={{ alignSelf: 'center' }}>
                    <Text style={{ fontSize: 12, color: 'gray' }}>{item.time}</Text>
                    {index < 2 && (
                      <View
                        style={{
                          alignSelf: 'center',
                          backgroundColor: 'red',
                          height: 20,
                          width: 20,
                          borderRadius: 100,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: RFValue(5),
                        }}>
                        <Text style={{ textAlign: 'center', fontSize: 10, color: 'white' }}>
                          {`4` - index}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default ChatHome;

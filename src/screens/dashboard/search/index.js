import React, { useEffect, useState } from 'react';
import { Container, Text, View, Icon, Input, Item } from 'native-base';
import { styles } from './styled';
import {
  TouchableHighlight,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UserScreen from './users';
import VideoSection from './videos';
import Hashtags from './hashtags/Hashtags';
import TopResults from './top';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Color, FontFamily } from 'constants';
import testProps from 'locatorId';

//Redux
import { updateSearchKeyword } from '../../../../store/actions/searh';
import { connect } from 'react-redux';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '@react-navigation/native';
const Tab = createMaterialTopTabNavigator();

const SearchScreen = (props) => {
  const { colors } = useTheme();
  const {
    requests,
    getFollowerRequest,
    updateSearchKeywordDispatch,
    navigation,
    acceptRejectFollowerRequest,
    keyWord,
    requestStatus,
  } = props;

  const [searchText, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // const onClickHashtag = (text) => {
  //   setSearch(text);
  //   updateSearchKeywordDispatch(text);
  // };

  const onSubmit = (email, status) => {
    acceptRejectFollowerRequest(email, status);
  };

  const testComponent = () => {
    return <Text>Test</Text>;
  };

  handleFocus = () => {
    setIsFocused(true);
  };

  handleBlur = () => {
    setIsFocused(false);
  };

  const clearSearchText = () => {
    setSearch('');
    updateSearchKeywordDispatch('');
  };
  useEffect(() => {
    // if (requestStatus.successed) {
    //     navigation.navigate("Profile");
    //     getFollowerRequest();
    // }
  }, [keyWord]);

  const _handleBack = () => {
    Keyboard.dismiss();
    navigation.goBack();
  };

  const searchTag = (text) => {
    setSearch(text);
    updateSearchKeywordDispatch(text);
  };
  function MyCustomTabs({ state, descriptors, navigation, ...rest }) {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View
          style={{
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: colors.card,
            paddingHorizontal: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.05,
            shadowRadius: 4.65,

            elevation: 6,
            zIndex: colors.background == '#fff' ? 9999 : 0,
            marginBottom: colors.background == '#fff' ? 0 : 0,
          }}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };
            const isFocusedProps = {
              borderBottomColor: isFocused ? '#FB6200' : 'transparent',
              borderBottomWidth: 2,
              paddingBottom: 10,
              paddingLeft: 10,
              paddingRight: 10,
            };
            return (
              <TouchableOpacity
                key={label}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                {...testProps(options.tabBarTestID)}
                onPress={onPress}
                onLongPress={onLongPress}>
                <View style={{ ...isFocusedProps }}>
                  <Text style={{ color: isFocused ? '#FB6200' : colors.text, textAlign: 'center' }}>
                    {label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.card }]} edges={['top']}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.topHeader}>
          <TouchableHighlight
            {...testProps('searchScreenBackBtn')}
            onPress={() => _handleBack()}
            underlayColor="none">
            <View style={{ width: 40 }}>
              <Icon
                type="Entypo"
                name="chevron-thin-left"
                style={{ fontSize: RFValue(17), color: colors.text }}
              />
            </View>
          </TouchableHighlight>
          <Item
            rounded
            style={{
              borderRadius: 5,
              marginLeft: '3%',
              width: '82%',
              height: 46,
              borderWidth: 2,
              borderColor: isFocused ? Color.Orange : colors.inputBorder,
              backgroundColor: colors.inputInnerColor,
            }}>
            <Icon
              testID={'searchScreenInputSearchIcon'}
              type="EvilIcons"
              name="search"
              onPress={() => updateSearchKeywordDispatch(searchText)}
              style={{ fontSize: RFValue(18), color: colors.text }}
            />

            <Input
              testProp={'searchScreenSearchInput'}
              placeholder="Search..."
              value={keyWord}
              onChangeText={(text) => searchTag(text)}
              style={{ fontSize: RFValue(12), color: colors.text, paddingRight: 20 }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <>
              {
                // isFocused &&
                keyWord.length !== 0 ? (
                  <Icon
                    type="EvilIcons"
                    name="close"
                    onPress={() => clearSearchText()}
                    style={{ fontSize: RFValue(18), color: colors.text }}
                  />
                ) : (
                  <View></View>
                )
              }
            </>
          </Item>
        </View>
      </TouchableWithoutFeedback>

      <View style={[styles.wrapper, { backgroundColor: colors.card }]}>
        <Text
          {...testProps('searchScreenExploreTest')}
          style={{
            marginLeft: 20,
            paddingVertical: 15,
            fontSize: RFValue(16),
            color: colors.text,
            fontFamily: FontFamily.medium,
          }}>
          Explore
        </Text>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Tab.Navigator
            tabBar={(props) => <MyCustomTabs {...props} />}
            initialRouteName="Top"
            tabBarOptions={{
              inactiveTintColor: Color.LightGrey2,
            }}>
            <Tab.Screen name="Top" component={TopResults} />
            <Tab.Screen name="Users" component={UserScreen} />
            <Tab.Screen name="Videos" component={VideoSection} />
            <Tab.Screen name="Hashtags" children={(props) => <Hashtags {...props} />} />
          </Tab.Navigator>
        </View>
      </View>
    </SafeAreaView>
  );
};

function mapStateToProps(state) {
  return {
    requests: state.followFollowing.followersRequest,
    requestStatus: state.followFollowing.followersRequestLoader,
    keyWord: state.SearchReducer.searchKeyword,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getFollowerRequest: () => dispatch(FollowerRequests()),
    acceptRejectFollowerRequest: (email, status) =>
      dispatch(AcceptRejectFollowerRequest(email, status)),
    updateSearchKeywordDispatch: (payload) => dispatch(updateSearchKeyword(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);

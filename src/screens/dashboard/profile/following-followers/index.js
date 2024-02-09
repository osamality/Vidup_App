import React from 'react';
import { styles } from './styled';
import { Text, Icon } from 'native-base';
import { TouchableOpacity, View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FollowerComponent from './followers';
import FollowingComponent from './following';
import { connect } from 'react-redux';
import { useTheme } from '@react-navigation/native';
import { Color, FontFamily } from 'constants';
import { RFValue } from 'react-native-responsive-fontsize';
import testProps from 'locatorId';
const Tab = createMaterialTopTabNavigator();

const FollowingFollowers = (props) => {
  const { navigation, user, route, followings, followers } = props;
  const { colors } = useTheme();

  function MyCustomTabs({ state, descriptors, navigation, ...rest }) {
    return (
      <View
        style={{
          paddingBottom: 5,
          backgroundColor: colors.card,
          marginBottom: colors.background == '#fff' ? 10 : 0,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.05,
          shadowRadius: 4.65,
          elevation: 6,
          zIndex: 9999,
        }}>
        <View
          style={{
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'space-between',
            paddingLeft: 50,
            paddingRight: 50,
            marginTop: 10,
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
      </View>
    );
  }
  return (
    <View style={[styles.MainContainer, { backgroundColor: colors.card }]}>
      <SafeAreaView style={[styles.MainContainer, { backgroundColor: colors.card }]}>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.topBar}>
              <TouchableOpacity
                {...testProps('profileFollowBackBtn')}
                onPress={() => navigation.navigate('HomeScreen')}>
                <View style={{ width: 50 }}>
                  <Icon
                    type="Entypo"
                    name="chevron-thin-left"
                    style={{ fontSize: 18, color: colors.text }}
                  />
                </View>
              </TouchableOpacity>
              <View {...testProps('profileFollowNameTitle')}>
                <Text
                  style={{
                    color: colors.text,
                    marginLeft: -50,
                    color: colors.text,
                    fontFamily: FontFamily.medium,
                    fontSize: RFValue(16),
                    textTransform: 'lowercase',
                  }}>
                  @{route.params?.user ? route.params?.user.username : user.username}
                </Text>
              </View>
              <View>
                <></>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Tab.Navigator
              initialRouteName={route.params.type == '1' ? 'Following' : 'Followers'}
              tabBar={(props) => <MyCustomTabs {...props} />}>
              <Tab.Screen
                name="Following"
                initialParams={{ user: route.params?.user ? route.params?.user : 'personal' }}
                component={FollowingComponent}
                options={{
                  tabBarLabel: `Following (${
                    route.params?.user ? route.params?.user.followings : followings.length
                  })`,
                }}
              />
              <Tab.Screen
                name="Followers"
                component={FollowerComponent}
                initialParams={{ user: route.params?.user ? route.params?.user : 'personal' }}
                options={{
                  tabBarLabel: `Followers (${
                    route.params?.user ? route.params?.user.followers : followers.length
                  })`,
                }}
              />
            </Tab.Navigator>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user.user,
    followings: state.followFollowing.followings,
    followers: state.followFollowing.followers,
  };
}

export default connect(mapStateToProps, null)(FollowingFollowers);

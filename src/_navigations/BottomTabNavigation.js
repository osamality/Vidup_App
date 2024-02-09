import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image, Platform } from 'react-native';
import { Icon } from 'native-base';
import { CameraScreen } from 'screens';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import SearchStack from './SearchStack';
import NotificationStack from './NotificationStack';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { TransitionSpecs, HeaderStyleInterpolators } from '@react-navigation/stack';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import testProps from 'locatorId';
import { _Toast } from 'components';

const Tab = createBottomTabNavigator();

const MyTransition = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  headerStyleInterpolator: HeaderStyleInterpolators.forFade,
};

function PlusIcon() {
  return (
    <View
      {...testProps('bottomTabBarPlusBtn')}
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.29,
        shadowRadius: 2.62,
        elevation: 4,
        marginTop: 1,
      }}>
      <LinearGradient
        colors={['#FB6200', '#EF0059']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={{
          borderRadius: RFValue(5),
          alignItems: 'center',
          justifyContent: 'center',
          width: RFValue(39),
          height: RFValue(39),
        }}>
        <Icon type="AntDesign" name="plus" style={{ fontSize: RFValue(20), color: '#fff' }} />
      </LinearGradient>
    </View>
  );
}

function DashboardTabs(props) {
  const { colors } = useTheme();
  const { navigation, clearStateDispatch, notificationCount, mediaUploadStatus } = props;
  const onLogout = () => {
    clearStateDispatch();
  };
  //tabBar={props => (<MyCustomTabBar {...props} />)}
  const iconSize = RFValue(20);
  const iconSizeL = RFValue(24);
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: {
          borderTopWidth: 0,
          backgroundColor: colors.background,
          borderColor: 'transparent',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 4.62,
          elevation: 4,
          // paddingVertical: 15
        },
        showLabel: false,
        activeTintColor: 'red',
      }}>
      <Tab.Screen
        name="HScreen"
        component={HomeStack}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            navigation.popToTop();
          },
        })}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Image
                {...testProps('bottomTabBarHomehighlightedBtn')}
                source={{ uri: 'homehighlighted' }}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
            ) : colors.background == '#fff' ? (
              <Image
                {...testProps('bottomTabBarHomedimBtn')}
                source={{ uri: 'homedim' }}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
            ) : (
              <Image
                {...testProps('bottomTabBarHomedarkBtn')}
                source={{ uri: 'homedark' }}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
            ),
        }}
      />
      <Tab.Screen
        name="SearchScreen"
        component={SearchStack}
        options={{
          tabBarLabel: 'Search',
          ...MyTransition,
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Image
                {...testProps('bottomTabBarSearchhighlightedBtn')}
                source={{ uri: 'searchhighlighted' }}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
            ) : colors.background == '#fff' ? (
              <Image
                {...testProps('bottomTabBarSearchdimBtn')}
                source={{ uri: 'searchdim' }}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
            ) : (
              <Image
                {...testProps('bottomTabBarSearchdarkBtn')}
                source={{ uri: 'searchdark' }}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
            ),
        }}
      />
      <Tab.Screen
        name="RecordScreen"
        component={CameraScreen}
        options={{
          tabBarLabel: 'hello',
          tabBarIcon: ({ color, fontSize }) => <PlusIcon />,
          tabBarVisible: false,
          unmountOnBlur: true,
        }}
        listeners={({ defaultHandler }) => ({
          tabPress: (e) => {
            let timeElapsed = Math.abs(new Date(mediaUploadStatus.create_at) - new Date());
            console.log(
              'elapsed: ',
              timeElapsed,
              ' Old: ',
              mediaUploadStatus.create_at,
              ' Current: ',
              new Date(),
              '  check: ',
              mediaUploadStatus.isRequested,
            );
            if (mediaUploadStatus.isRequested && timeElapsed < 60000) {
              _Toast('danger', 'Please wait your previous video is still in process.');
              e.preventDefault();
            }
          },
        })}
      />
      <Tab.Screen
        name="FavouriteScreen"
        component={NotificationStack}
        options={{
          tabBarLabel: 'Favourite',
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Image
                {...testProps('bottomTabBarNotificationshighlightedBtn')}
                source={{ uri: 'notificationshighlighted' }}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
            ) : colors.background == '#fff' ? (
              <Image
                {...testProps('bottomTabBarNotificationsdimBtn')}
                source={{ uri: 'notificationsdim' }}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
            ) : (
              <Image
                {...testProps('bottomTabBarNotificationsdarkBtn')}
                source={{ uri: 'notificationsdark' }}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
            ),
          tabBarBadge: notificationCount > 0 ? notificationCount : 0,
          tabBarBadgeStyle:
            notificationCount == 0
              ? { display: 'none', transform: [{ scale: 0 }] }
              : {
                  paddingHorizontal: 5,
                  fontSize: 10,
                  height: 21,
                  paddingTop: Platform.OS == 'ios' ? 2 : 0,
                },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Image
                {...testProps('bottomTabBarUserhighlightedBtn')}
                source={{ uri: 'userhighlighted' }}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
            ) : colors.background == '#fff' ? (
              <Image
                {...testProps('bottomTabBarUserdimBtn')}
                source={{ uri: 'userdim' }}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
            ) : (
              <Image
                {...testProps('bottomTabBarUserdarkBtn')}
                source={{ uri: 'userdark' }}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
            ),
          unmountOnBlur: true,
        }}
      />
    </Tab.Navigator>
  );
}
function mapStateToProps(state) {
  return {
    user: state.user.user,
    notificationCount: state.user.totalNotifications,
    mediaUploadStatus: state.postsReducer.mediaUpload,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    clearStateDispatch: () =>
      dispatch({
        type: 'Clear_Auth',
        payload: {},
      }),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(DashboardTabs);

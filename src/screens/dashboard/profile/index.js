import React, { useEffect } from 'react';
import { Text, Thumbnail, View } from 'native-base';
import { styles } from './styled';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TouchableOpacity, Image } from 'react-native';
import { GetFollowings, GetFollowers } from '../../../../store/actions/follow-following';
import { fetchUserById } from '../../../../store/actions/user';
import ProfileHome from './profileHome';
import WeeklyScreen from './weekly';
import { SafeAreaView } from 'react-native-safe-area-context';
import { noUserPlaceholder, badgeChecdVerified } from 'assets';
import { connect } from 'react-redux';
import MyCustomTabs from './custom-tabs';
import { getPersonalPosts } from '../../../../store/actions/posts';
import { Color, FontFamily } from 'constants';
import { useTheme } from '@react-navigation/native';
import { ProfileThumb } from 'components';
import testProps from 'locatorId';

const Tab = createMaterialTopTabNavigator();
import { AboutScreen } from 'screens';
import { RFValue } from 'react-native-responsive-fontsize';
import { Touch } from '../../../components/touch';
import { Pressable } from 'react-native';

const ProfileScreen = (props) => {
  const {
    navigation,
    getFollowings,
    getFollowers,
    totalFollowings,
    fetchUserDispatch,
    route,
    getPersonalPostsDispatch,
    totalFollowers,
    user,
  } = props;
  const { colors } = useTheme();
  useEffect(() => {
    const unsubscribe1 = navigation.addListener('focus', () => {
      if (user.token) {
        fetchUserDispatch(user.id);
        getFollowings();
        getFollowers();
      }
      // getPersonalPostsDispatch();
    });
    return () => {
      unsubscribe1();
    };
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.card }]} edges={['top']}>
      <View style={styles.topBar}>
        <Touch onPress={() => navigation.navigate('SettingsScreen')}>
          <View style={{ width: 50 }}>
            <Image
              {...testProps('profileHeaderDrawerBtn')}
              source={{
                uri: colors.background == '#fff' ? 'hamburgermenudim' : 'hamburgermenudark',
              }}
              style={[styles.bodyIcon, styles.drawerIcon]}
              resizeMode={'contain'}
            />
          </View>
        </Touch>

        <Touch onPress={() => navigation.push('ProfileUpdateScreen')}>
          <View style={{ width: 50 }}>
            <Image
              {...testProps('profileHeaderEditProfileBtn')}
              source={{ uri: colors.background == '#fff' ? 'editdim' : 'editdark' }}
              style={[styles.bodyIcon, styles.drawerIcon, { alignSelf: 'flex-end' }]}
              resizeMode={'contain'}
            />
          </View>
        </Touch>
      </View>
      <View style={styles.thumbnailSection}>
        {user.profile_pic ? (
          <ProfileThumb
            testProp={'profileScreenThumbImage'}
            profilePic={user.profile_pic}
            style={{ borderRadius: 82, height: 82, width: 82 }}
          />
        ) : (
          <Thumbnail
            style={{ borderRadius: 82, height: 82, width: 82 }}
            source={noUserPlaceholder}
          />
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            {...testProps('profileScreenUserName')}
            style={{
              fontSize: RFValue(16),
              fontFamily: FontFamily.medium,
              marginTop: 10,
              color: colors.text,
            }}>
            {user.name}
          </Text>
          {user.is_account_verified && (
            <Image
              {...testProps('profileHeaderDrawerBtn')}
              source={badgeChecdVerified}
              style={{ ...styles.verifyIcon }}
              resizeMode={'contain'}
            />
          )}
        </View>

        <Text
          {...testProps('profileScreenUserUsername')}
          style={{
            fontSize: RFValue(12),
            marginTop: 5,
            fontFamily: FontFamily.regular,
            color: colors.text,
          }}>
          @{user.username}
        </Text>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 5,
            fontSize: RFValue(12),
            fontFamily: FontFamily.regular,
            color: Color.DarkGrey,
          }}>
          <Text
            {...testProps('profileScreenFollowingBtn')}
            style={{ fontSize: 12, fontWeight: 'normal', color: colors.text }}
            onPress={() =>
              navigation.push('FollowingFollowersScreen', { nStack: 'HScreen', type: '1' })
            }>
            {totalFollowings.length} Following
          </Text>
          <Text
            {...testProps('profileScreenFollowersBtn')}
            style={{ fontSize: 12, fontWeight: 'normal', marginLeft: 20, color: colors.text }}
            onPress={() =>
              navigation.push('FollowingFollowersScreen', { nStack: 'HScreen', type: '0' })
            }>
            {totalFollowers.length} Followers
          </Text>
        </View>
      </View>

      <Tab.Navigator
        initialRouteName={route?.params?.notificationType == 11 ? 'Weekly' : 'All'}
        tabBar={(props) => <MyCustomTabs {...props} />}>
        <Tab.Screen name="All" component={ProfileHome} />
        <Tab.Screen name="Weekly" component={WeeklyScreen} />
        <Tab.Screen name="About" component={AboutScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};
function mapStateToProps(state) {
  return {
    user: state.user.user,
    totalFollowings: state.followFollowing.followings,
    totalFollowers: state.followFollowing.followers,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getFollowings: () => dispatch(GetFollowings()),
    getFollowers: () => dispatch(GetFollowers()),
    getPersonalPostsDispatch: (page) => dispatch(getPersonalPosts(page)),
    fetchUserDispatch: (userId) => dispatch(fetchUserById(userId)),
    visitingUserDispatch: (user) =>
      dispatch({
        type: 'Visiting_User',
        payload: user,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

import React, { useEffect } from 'react';
import { Badge, Container, Text, Thumbnail, View, Icon, Spinner } from 'native-base';
import { styles } from './styled';
import { ScrollView, Image, FlatList, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  AcceptRejectFollowerRequest,
  FollowerRequests,
} from '../../../../../store/actions/follow-following';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lightMessageIcon, badgeChecdVerified } from 'assets';
import { heightPercentageToDP, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Color, FontFamily } from 'constants';
import { noUserFound, noUserPlaceholder, darkNoUserFound } from 'assets';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useTheme } from '@react-navigation/native';
import { Topheader, Statusbar, ProfileThumb } from '../../../../components';
import testProps from 'locatorId';
import { Touch } from '../../../../components/touch';
const uri = 'https://facebook.github.io/react-native/docs/assets/favicon.png';

const FollowersRequestScreen = (props) => {
  const {
    requests,
    getFollowerRequest,
    navigation,
    acceptRejectFollowerRequest,
    requestStatus,
    requestEnd,
    currentLoggedInUser,
  } = props;
  const { colors } = useTheme();
  const onSubmit = (email, status) => {
    acceptRejectFollowerRequest(email, status);
  };
  useEffect(() => {
    // if (requestStatus.successed) {
    getFollowerRequest();
    //navigation.navigate("Profile");
    // }
  }, [requestStatus]);
  return (
    <Container>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
        {/* <View style={{ overflow: 'hidden', paddingBottom: 5 }}>
          <View
            style={[
              styles.topHeader,
              { backgroundColor: colors.card, marginBottom: colors.background == '#fff' ? 10 : 0 },
            ]}>
            <TouchableHighlight onPress={() => navigation.goBack()} underlayColor="none">
              <Icon
                type="Entypo"
                name="chevron-thin-left"
                style={{ fontSize: 20, color: colors.text }}
              />
            </TouchableHighlight>
            <Text
              style={{ fontSize: RFValue(16), color: colors.text, fontFamily: FontFamily.medium }}>
              Followers Request ({requests.length > 0 ? requests.length : 0})
            </Text>
            <TouchableWithoutFeedback>
              <Image
                style={[styles.logo, { width: wp('5%'), height: wp('5%') }]}
                source={colors.background == '#fff' ? lightMessageIcon : darkMessageIcon}
              />
            </TouchableWithoutFeedback>
          </View>
        </View> */}

        <View style={{ overflow: 'hidden' }}>
          <Topheader
            currentIndex={colors.background == '#fff' ? 0 : 1}
            onPressLeft={() => navigation.goBack()}
            origin={`Followers Request (${requests.length > 0 ? requests.length : 0})`}
            showChatIcon={false}
          />
        </View>

        <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
          <View style={styles.notificationSection}>
            {requests.length > 0 ? (
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={requests}
                renderItem={({ item, index, separators }) => (
                  <View style={styles.notificationItem}>
                    <Touch
                      onPress={() => {
                        if (item.follower.id === currentLoggedInUser.id)
                          navigation.navigate('Profile', {
                            screen: 'ProfileHome',
                          });
                        else
                          navigation.push('HomeScreen', {
                            screen: 'HScreen',
                            params: {
                              screen: 'PublicProfileScreen',
                              params: {
                                publicProfile: item.follower,
                              },
                            },
                          });
                      }}
                      style={{ flexDirection: 'row' }}>
                      {item.follower.profile_pic ? (
                        <ProfileThumb
                          testProp={'followRequestUserThumb'}
                          profilePic={item.follower.profile_pic}
                          style={{ height: 45, width: 45 }}
                        />
                      ) : (
                        <Thumbnail style={{ height: 45, width: 45 }} source={noUserPlaceholder} />
                      )}

                      <View
                        style={{
                          maxWidth: wp(40),
                          marginLeft: 15,
                          flexGrow: 1,
                          justifyContent: 'center',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            numberOfLines={1}
                            testProp={'followRequestUserName'}
                            style={{ fontSize: 14 }}>
                            {item.follower.name}
                          </Text>
                          {item.follower.is_account_verified && (
                            <Image
                              {...testProps('userPorfileVerifiedIcon')}
                              source={badgeChecdVerified}
                              style={{
                                width: RFValue(12),
                                height: RFValue(12),
                                marginLeft: 5,
                                marginRight: 5,
                                marginTop: 0,
                              }}
                              resizeMode={'contain'}
                            />
                          )}
                        </View>
                        <Text
                          testProp={'followRequestUserUserName'}
                          numberOfLines={1}
                          style={{ fontSize: 10 }}>
                          @{item.follower.username}
                        </Text>
                      </View>
                    </Touch>
                    <View style={styles.buttonWrapper}>
                      <TouchableOpacity onPress={() => onSubmit(item.follower.email, 'accepted')}>
                        <LinearGradient
                          colors={['#FB6200', '#EF0059']}
                          start={{ x: 1, y: 1 }}
                          end={{ x: 0, y: 0 }}
                          style={styles.gradientButton}>
                          <Text
                            testProp={'followRequestAcceptBtn'}
                            style={{ color: '#fff', fontSize: 14 }}>
                            Accept
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => onSubmit(item.follower.email, 'rejected')}>
                        <Icon
                          type="AntDesign"
                          name="close"
                          style={{ fontSize: 20, color: '#464646', marginLeft: 10 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            ) : (
              <View style={{ fontSize: 18, flex: 1, justifyContent: 'center' }}>
                <Image
                  source={colors.background == '#fff' ? noUserFound : darkNoUserFound}
                  style={{ alignSelf: 'center' }}
                />
                <Text
                  testProp={'followRequestNotFound'}
                  style={{
                    color: Color.LightGrey1,
                    alignSelf: 'center',
                    marginTop: RFValue(10),
                    fontSize: RFValue(12),
                    fontFamily: FontFamily.regular,
                  }}>
                  No New Request Found.
                </Text>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Container>
  );
};

function mapStateToProps(state) {
  return {
    currentLoggedInUser: state.user.user,
    requests: state.followFollowing.followersRequest,
    requestStatus: state.followFollowing.followersRequestLoader,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getFollowerRequest: () => dispatch(FollowerRequests()),
    acceptRejectFollowerRequest: (email, status) =>
      dispatch(AcceptRejectFollowerRequest(email, status)),
    requestEnd: () =>
      dispatch({
        type: 'FollowersRequestsLoader',
        payload: { requested: false, successed: false, error: false },
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowersRequestScreen);

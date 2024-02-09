import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import testProps from 'locatorId';
import { Color, FontFamily } from 'constants';
import { useTheme } from '@react-navigation/native';
import { connect } from 'react-redux';
import { updateSearchKeyword } from '../../../store/actions/searh';

const TopHashtags = (props) => {
  const { updateSearchKeywordDispatch, hash, navigation } = props;
  const { colors } = useTheme();

  const [follow, setfollow] = useState(true);
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10,
      }}
      onPress={() => {
        updateSearchKeywordDispatch(hash.keyword);
        navigation.navigate('HashtagVideosScreen');
      }}>
      <View style={{ width: '18%' }}>
        <View
          style={{
            borderRadius: 50,
            padding: 10,
            height: 45,
            borderColor: colors.border,
            borderWidth: 1,
            width: 45,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: colors.text }}>#</Text>
        </View>
      </View>
      <View style={{ width: '50%' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 12, color: colors.text }}>{hash.keyword}</Text>
        <Text style={{ color: colors.border, fontSize: 12 }}>{`${hash.total} ${
          hash.total > 1 ? `posts` : `post`
          // hash.total > 1 ? `followers` : `follower`
        }`}</Text>
      </View>
      <View style={{ width: '25%' }}>
        {/* {follow ? (
          <LinearGradient
            colors={['#FB6200', '#EF0059']}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.gradientTouchableOpacity}>
            <TouchableOpacity
              title={'tyftyf'}
              style={[styles.outlineTouchableOpacity, { borderWidth: 0 }]}
              transparent
              onPress={() => console.log('hi')}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 10,
                  textTransform: 'capitalize',
                }}>
                Follow
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <View>
            <TouchableOpacity
              style={[styles.outlineTouchableOpacity, { paddingHorizontal: 3 }]}
              transparent
              title={'tyftyf'}
              onPress={() => console.log('hi')}>
              <Text
                style={{
                  color: '#FB6200',
                  fontSize: 10,
                  textTransform: 'capitalize',
                }}>
                UnFollow
              </Text>
            </TouchableOpacity>
          </View>
        )} */}
      </View>
    </TouchableOpacity>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    updateSearchKeywordDispatch: (payload) => dispatch(updateSearchKeyword(payload)),
  };
}

export default connect(null, mapDispatchToProps)(TopHashtags);

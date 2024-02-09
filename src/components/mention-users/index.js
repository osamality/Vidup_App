import React, { useState, useRef, useEffect } from 'react';
import { Text, View, Thumbnail } from 'native-base';
import { Pressable } from 'react-native';
import { _Toast, Statusbar, ProfileThumb } from '../../components';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { noUserPlaceholder } from 'assets';
import { Color, FontFamily } from 'constants';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { _MentionSearch } from '../../../store/actions/follow-following';
import { useTheme } from '@react-navigation/native';

export const renderSuggestions =
  (mentions, returnMentions, returnTagged, position = 'bottom', setIsSuggestionsopened) =>
  ({ keyword, onSuggestionPress }) => {
    const { colors } = useTheme();
    const [previousKeyWord, setKeyWord] = useState('');

    useEffect(() => {
      if (previousKeyWord != keyword) {
        setKeyWord(keyword);
      }
    }, []);

    if (keyword == null) {
      return null;
    }
    if (keyword != previousKeyWord) {
      setKeyWord(keyword);
      _MentionSearch(keyword, (callBack) => {
        if (keyword != previousKeyWord && keyword != '@') {
          setIsSuggestionsopened && setIsSuggestionsopened(true);
        }
        returnMentions(callBack);
      });
    } else {
      {
        setIsSuggestionsopened && setIsSuggestionsopened(true);
      }
      if (previousKeyWord == '@') {
        {
          setIsSuggestionsopened && setIsSuggestionsopened(false);
        }
      }
    }

    return (
      <View
        style={
          position == 'top'
            ? {
                backgroundColor: colors.background,
                position: 'absolute',
                bottom: 50,
                paddingHorizontal: 15,
                left: 0,
              }
            : {}
        }>
        {mentions.map((one) => (
          <TouchableWithoutFeedback
            key={one.following_follower.id}
            onPress={() => {
              {
                setIsSuggestionsopened && setIsSuggestionsopened(false);
              }
              onSuggestionPress(one.following_follower), returnTagged(one.following_follower);
            }}
            style={{
              flexDirection: 'row',
              marginBottom: 5,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <View>
              {one.following_follower.profile_pic ? (
                <ProfileThumb
                  profilePic={one.following_follower.profile_pic}
                  style={{ width: 45, height: 45 }}
                />
              ) : (
                <Thumbnail style={{ width: 45, height: 45 }} source={noUserPlaceholder} />
              )}
            </View>
            <View key={one.following_follower.id} style={{ padding: 12 }}>
              <View>
                <Text
                  style={{
                    color: colors.text,
                    fontFamily: FontFamily.regular,
                    fontSize: 12,
                    fontWeight: '500',
                  }}>
                  {one.following_follower.first_name} {one.following_follower.last_name}
                </Text>
                <Text style={{ color: colors.text, fontFamily: FontFamily.regular, fontSize: 12 }}>
                  @{one.following_follower.username}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    );
  };

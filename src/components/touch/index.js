import React, { useState } from 'react';
import {
  StyleSheet,
  Platform,
  View,
  Pressable,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import {} from 'react-native-gesture-handler';

export const Touch = ({ children, onPress, text, style }) => {
  const { colors } = useTheme();
  // let disabled = false;
  const [disabled, setDisabled] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('transparent');

  onPressTouch = () => {
    setDisabled(true);
    onPress();
    setTimeout(() => {
      setDisabled(false);
    }, 400);
  };

  return Platform.OS === 'ios' ? (
    <Pressable
      onPressIn={() => {
        setBackgroundColor('red');
      }}
      onPress={onPressTouch}
      disabled={disabled}>
      <View style={{ ...style }}>{children}</View>
    </Pressable>
  ) : (
    <Pressable
      onPressIn={() => {
        setBackgroundColor('red');
      }}
      onPress={onPressTouch}
      disabled={disabled}>
      <View style={{ ...style }}>{children}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({});

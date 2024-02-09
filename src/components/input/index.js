import React, { useState } from 'react';
import { Input, Item, Icon, Text } from 'native-base';
import { StyleSheet, Keyboard, Image, Pressable } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Color } from 'constants';
import testProps from 'locatorId';
import { DarkTheme, useTheme, DefaultTheme } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const InputComponent = ({
  autoCapitalize = null,
  name = null,
  placeholder = null,
  testProp = null,
  isSecure = false,
  keyboardType,
  onChangeText,
  value,
  placeholderTextColor = Color.LightGrey1,
  editable = true,
}) => {
  const { colors } = useTheme();
  const [isPasswordSecured, setIsPasswordSecured] = useState(isSecure);
  const [showPassword, setShowPassword] = useState(true);

  const showPasswordInput = () => {
    setShowPassword(!showPassword);
    setIsPasswordSecured(!isPasswordSecured);
  };
  return (
    <Item
      style={{ backgroundColor: colors.card, borderColor: colors.border, borderRadius: 5 }}
      rounded>
      <Input
        editable={editable}
        autoCorrect={false}
        placeholderTextColor={placeholderTextColor}
        name={name}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[styles.input, { color: colors.text }]}
        value={value}
        placeholder={placeholder}
        secureTextEntry={isPasswordSecured}
        onChangeText={onChangeText}
        blurOnSubmit={false}
        {...testProps(testProp)}
        onSubmitEditing={() => Keyboard.dismiss()}
      />
      {isSecure ? (
        <Pressable onPress={showPasswordInput}>
          <Image
            source={{
              uri:
                colors.background == '#fff'
                  ? showPassword
                    ? 'eyewithline'
                    : 'eyewithoutline'
                  : showPassword
                  ? 'darkpasswordhide'
                  : 'darkpasswordshow',
            }}
            style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 10 }}
          />
        </Pressable>
      ) : (
        // <Icon type="Entypo" name={showPassword ? 'eye-with-line' : 'eye'}
        // style={{ fontSize: RFValue(18), color: colors.text }} onPress={showPasswordInput}/>
        <></>
      )}
    </Item>
  );
};

const styles = StyleSheet.create({
  input: {
    height: hp('6%'),
    fontSize: hp('1.7%'),
    paddingLeft: 20,
  },
});

import React, { useEffect, useState } from 'react';
import { Text, Icon, Thumbnail, View } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { Color, FontFamily } from 'constants';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import testProps from 'locatorId';

const _styles = {
  childTab: {},
  view: {
    backgroundColor: '#EF0059',
    borderRadius: 5,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 12,
    paddingLeft: 12,
    marginLeft: 3,
    marginRight: 3,
    minWidth: 70,
    textAlign: 'center',
  },
};

function MyCustomTabs({ state, descriptors, navigation, ...rest }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: colors.card,
        alignItems: 'center',
        // marginTop: 10,
        paddingTop: heightPercentageToDP('2%'),
        marginBottom: 0,
        fontSize: RFValue(12),
        fontFamily: FontFamily.regular,
        color: Color.DarkGrey,
        paddingBottom: RFValue(10),
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
          backgroundColor: isFocused ? '["#FB6200", "#EF0059"]' : 'transparent',
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
            <LinearGradient
              colors={isFocused ? ['#FB6200', '#EF0059'] : ['transparent', 'transparent']}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={{ ..._styles.view, ...isFocusedProps }}>
              <Text
                style={{
                  color: isFocused ? 'white' : colors.text,
                  textAlign: 'center',
                  fontFamily: FontFamily.regular,
                }}>
                {label}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default MyCustomTabs;

import React from 'react';
import { Input, Item } from 'native-base';
import { StyleSheet, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import testProps from 'locatorId';
import { useTheme } from "@react-navigation/native";
import { RFValue } from 'react-native-responsive-fontsize';
import { Color, FontFamily } from 'constants';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native';

export const ModalBtn = ({ onPress, text, testProp }) => {

    const { colors } = useTheme();

    return (
        <TouchableOpacity onPress={onPress}>
            <Text {...testProps(testProp)} style={{ color: colors.text, alignSelf: 'flex-start', fontFamily: FontFamily.normal, paddingTop: RFValue(15) }}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    input: {
        height: hp("6%"),
        fontSize: hp("1.7%"),
        paddingLeft: 20
    }
});
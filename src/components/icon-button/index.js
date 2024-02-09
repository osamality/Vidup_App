import React, { useEffect } from 'react';
import { Text, TouchableWithoutFeedback, StyleSheet, Image } from 'react-native';
import { DarkTheme, useTheme, DefaultTheme } from "@react-navigation/native";
import testProps from 'locatorId';

export const IconButtonComponent = ({ source, onPress, text, testProp }) => {

    const { colors } = useTheme();

    return (
        <TouchableWithoutFeedback
            onPress={onPress}
            style={[styles.container, { backgroundColor: colors.card }]}>
            <Image {...testProps(testProp)} style={styles.icon} source={source} />
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 11,
        borderRadius: 5,
        width: 40,
        height: 40,
        shadowColor: "#000",
        backgroundColor: '#fff',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    },
    icon: {
        width: 20,
        height: 20,
    }
});

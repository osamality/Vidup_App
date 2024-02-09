import { Text } from 'native-base';
import React from 'react';
import { TouchableHighlight } from 'react-native-gesture-handler';
import testProps from 'locatorId';
import { RFValue } from 'react-native-responsive-fontsize';

export const LinkComponent = ({label, fontSize, onPress, testProp= null}) => {
    return (
        <TouchableHighlight onPress={onPress} style={{ justifyContent: 'center'}} underlayColor="none">
            <Text {...testProps(testProp)} style={{ color: '#007aff', textDecorationLine: 'underline', fontSize: fontSize ? RFValue(fontSize) : RFValue(14), fontFamily: 'Roboto-Medium' }}>{label ? label : 'Sample Text'}</Text>
        </TouchableHighlight>
    );
}
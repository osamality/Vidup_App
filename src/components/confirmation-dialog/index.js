import React from 'react';
import { StyleSheet, TouchableHighlight, View, Keyboard, TextInput, Platform, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import testProps from 'locatorId';
import { DarkTheme, useTheme, DefaultTheme } from "@react-navigation/native";
import { Icon, Text, Thumbnail, Picker, Item, Button } from 'native-base';
import { styles } from "./styled";
import { noUserFound, noUserPlaceholder, darkNoUserFound } from 'assets';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import { Color, FontFamily } from 'constants';
import Modal from 'react-native-modal';

export const ConfirmationDialog = ({ 
    onPress, isVisible, isLoading, 
    hideConfirmation, actionName = 'Yes', 
    cancellationName = 'No', title = null, 
    secondPress = hideConfirmation,
    discriptionText = null }) => {
    const { colors } = useTheme();

    return (
        <View>
            <Modal
                testID={'modal'}
                isVisible={isVisible}
                onBackdropPress={hideConfirmation}
                swipeDirection={['up', 'left', 'right', 'down']}
                style={styles.view}>
                <View style={{ paddingHorizontal: 10, backgroundColor: colors.card, borderRadius: RFValue(10) }}>
                    <View style={{ width: '100%', paddingVertical: RFValue(10), borderBottomWidth: 0, borderBottomColor: colors.background == '#fff' ? Color.LightGrey1 : Color.LightGrey3 }}>
                        <View style={{ borderWidth: 3, borderRadius: 50, borderColor: Color.LightGrey1, width: RFValue(50), alignSelf: 'center', marginTop: 10 }}></View>
                    </View>
                    {title &&
                        <View style={{ borderBottomWidth: 1, borderBottomColor: colors.background == '#fff' ? Color.LightGrey1 : Color.LightGrey3 }}>

                            <Text style={{ color: colors.text, alignSelf: 'center', textAlign: 'center', fontFamily: FontFamily.bold, marginTop: 10, paddingBottom: 15 }}>{title} </Text>
                        </View>
                    }
                    <View>
                        <Text style={{ color: colors.text, textAlign: 'center', alignSelf: 'center', fontFamily: FontFamily.regular, marginTop: 25 }}>{discriptionText} </Text>
                    </View>
                    <View style={{ width: '100%' }}>
                        <View style={{ marginBottom: RFValue(35), flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                            <TouchableHighlight
                                onPress={onPress}
                                underlayColor="none" style={{ marginTop: RFValue(20) }}>
                                <Button onPress={onPress}
                                     style={[styles.outlineButton, { maxWidth: 100, marginRight: RFValue(10) }]} transparent>
                                    <Text {...testProps('supportBtn')} 
                                        style={{ 
                                            width: '100%', color: '#FB6200', 
                                            textAlign: 'center', alignSelf: 'center', 
                                            fontFamily: FontFamily.regular, 
                                            fontWeight: '400', fontSize: 12, textTransform: 'capitalize' }}>{actionName}</Text>
                                </Button>
                            </TouchableHighlight>
                            {
                                isLoading ?
                                    <TouchableHighlight 
                                         onPress={secondPress}
                                        underlayColor="none" style={{ marginTop: RFValue(20) }}>
                                        <LinearGradient colors={['#FB6200', '#EF0059']} start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }}
                                            style={[styles.loginButton, { maxWidth: 100, minWidth: 100 }]}>
                                            <ActivityIndicator color={'#fff'} size={'small'} />
                                        </LinearGradient>
                                    </TouchableHighlight>


                                    :
                                    <TouchableHighlight 
                                        underlayColor="none" style={{ marginTop: RFValue(20) }} 
                                        onPress={secondPress}>
                                        <LinearGradient colors={['#FB6200', '#EF0059']} start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }}
                                            style={[styles.loginButton, { maxWidth: 100, minWidth: 100 }]}>
                                            <Text {...testProps('supportBtn')} 
                                                style={{ 
                                                    width: '100%', textAlign: 'center', alignSelf: 'center', 
                                                    color: '#fff', fontFamily: FontFamily.regular, 
                                                    fontWeight: '400', fontSize: 12,
                                                    textTransform: 'capitalize' }}>{cancellationName}</Text>
                                        </LinearGradient>
                                    </TouchableHighlight>
                            }
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

import { Text, View, TouchableHighlight } from 'react-native';
import { Button } from 'native-base';
import React from 'react';
import { styles } from "./styled";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import testProps from 'locatorId';

import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from "@react-navigation/native";
import { Color, FontFamily } from 'constants';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import { ModalBtn } from '../../../components/modalpressabletxt';

export const ReportModal = ({
    onBackClick, reported, isVisible, finishReport,
    reportConfirm, proceedReport, cancelReport }) => {

    const { colors } = useTheme();

    return (
        <View>
            <Modal
                testID={'modal'}
                isVisible={isVisible}
                onBackdropPress={onBackClick}
                swipeDirection={['up', 'left', 'right', 'down']}
                style={{ justifyContent: 'flex-end', margin: 0 }}>
                <View style={{ backgroundColor: colors.card, borderRadius: RFValue(10) }}>
                    <View style={{ width: '100%', paddingVertical: RFValue(10), borderBottomWidth: 1, borderBottomColor: colors.background == '#fff' ? Color.LightGrey1 : Color.LightGrey3 }}>
                        <View style={{ borderWidth: 3, borderRadius: 50, borderColor: Color.LightGrey1, width: 60, alignSelf: 'center', marginTop: 10 }}></View>
                        {!reported &&
                            <Text style={{ color: colors.text, alignSelf: 'center', fontSize: RFValue(15), fontFamily: FontFamily.medium, paddingTop: RFValue(15) }}>{reportConfirm != '' ? 'You are about to report this post!' : 'Report'}</Text>
                        }
                        {reported &&
                            <Text style={{ color: colors.text, alignSelf: 'center', fontSize: RFValue(15), fontFamily: FontFamily.medium, paddingTop: RFValue(15) }}>Thank you for reporting!</Text>
                        }
                    </View>
                    {reportConfirm != '' && !reported ?
                        <View style={{ width: '100%', padding: RFValue(5), paddingHorizontal: RFValue(20), paddingBottom: RFValue(20) }}>
                            <Text style={{ color: colors.text, alignSelf: 'center', fontFamily: FontFamily.normal, paddingTop: RFValue(15) }}>{`Reason: ${reportConfirm}`}</Text>
                            <View style={{ marginBottom: RFValue(35), flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                                {/* <TouchableHighlight onPress={() => setIsVisible(false)} underlayColor="none" style={{ marginTop: RFValue(20) }}> */}
                                <Button onPress={proceedReport} style={[styles.outlineButton, { maxWidth: RFValue(140), marginTop: RFValue(20), marginRight: RFValue(10) }]} transparent>
                                    <Text {...testProps('modalReportBtnConform')} style={{ width: '100%', color: '#FB6200', textAlign: 'center', alignSelf: 'center' }}>Report</Text>
                                </Button>
                                <TouchableHighlight
                                    onPress={cancelReport}
                                    underlayColor="none"
                                    style={{ marginTop: RFValue(20) }}>
                                    <LinearGradient colors={['#FB6200', '#EF0059']} start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }}
                                        style={[styles.loginButton, { maxWidth: 180, minWidth: 180 }]}>
                                        <Text {...testProps('modalReportBtnCancel')} style={{ color: '#fff' }}>Cancel</Text>
                                    </LinearGradient>
                                </TouchableHighlight>
                            </View>
                        </View>
                        :
                        (reported ?
                            <View style={{ width: '100%', alignItems: 'center', padding: RFValue(5), paddingHorizontal: RFValue(20), paddingBottom: RFValue(20) }}>
                                <Text style={{ color: colors.text, alignSelf: 'center', fontFamily: FontFamily.normal, paddingTop: RFValue(15) }}>{reportConfirm}</Text>
                                <View style={{ marginBottom: RFValue(35), flexDirection: 'row', width: '100%', justifyContent: 'center' }}>

                                    <TouchableHighlight
                                        onPress={finishReport}
                                        underlayColor="none"
                                        style={{ alignSelf: 'center', marginTop: RFValue(20) }}>
                                        <LinearGradient colors={['#FB6200', '#EF0059']} start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }}
                                            style={[styles.loginButton, { padding: 15, paddingHorizontal: 40 }]}>
                                            <Text {...testProps('modalReportBtnOk')} style={{ color: '#fff' }}>Ok</Text>
                                        </LinearGradient>
                                    </TouchableHighlight>
                                </View>
                            </View>
                            :
                            <View style={{ width: '100%', padding: RFValue(5), paddingHorizontal: RFValue(20), paddingBottom: RFValue(20) }}>
                                <Text style={{ color: colors.text, alignSelf: 'flex-start', fontSize: RFValue(15), fontFamily: FontFamily.medium, paddingTop: RFValue(15) }}>Why are you reporting this post? </Text>
                                <ModalBtn testProp={'modalReportBtnSpam'} onPress={() => selectReason('Its spam')} text={'Its spam'} />
                                <ModalBtn testProp={'modalReportBtnSexual'} onPress={() => selectReason('Nudity or sexual activity')} text={'Nudity or sexual activity'} />
                                <ModalBtn testProp={'modalReportBtnHateSpeech'} onPress={() => selectReason('Hate speech or symbols')} text={'Hate speach or symbols'} />
                                <ModalBtn testProp={'modalReportBtnIllegal'} onPress={() => selectReason('Sale of illegal or regulated goods')} text={'Sale of illegal or regulated products'} />
                                <ModalBtn testProp={'modalReportBtnBullying'} onPress={() => selectReason('Bullying or harassment')} text={'Bullying or harassment'} />
                                <ModalBtn testProp={'modalReportBtnViolation'} onPress={() => selectReason('Intellectual property violation')} text={'Intellectual property violation'} />
                                <ModalBtn testProp={'modalReportBtnSucide'} onPress={() => selectReason('Suicide, self-injury or eating disorders')} text={'Suicide, self-injury or eating disorders'} />
                            </View>
                        )
                    }
                </View>
            </Modal>
        </View>
    )
}



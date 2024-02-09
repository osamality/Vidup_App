import React, { useState } from 'react';
import { connect } from 'react-redux';
// import all the components we are going to use
import {
    SafeAreaView,
    View,
    Text,
    Image,
    Button,
    StatusBar,
} from 'react-native';
import { styles } from './styled';

//import AppIntroSlider to use it
import AppIntroSlider from 'react-native-app-intro-slider';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import testProps from 'locatorId';
import { useTheme } from "@react-navigation/native";
const AppIntro = (props) => {

    const { setAppIntroDispatch } = props;
    const { colors } = useTheme();
    const onDone = () => {
        setAppIntroDispatch();
    };

    const onSkip = () => {
        setAppIntroDispatch();
    };

    const RenderItem = ({ item }) => {
        return (
            <View style={{
                flex: 1,
                backgroundColor: item.backgroundColor,
            }}>
                <View style={{alignItems: 'flex-end', display: 'flex', alignContent: 'flex-end', marginRight: 0}}>
                    <TouchableWithoutFeedback onPress={onSkip} style={{zIndex: 999}}><Text {...testProps('skipIntroBtn')} style={{ color: colors.text, textAlign: 'right', fontSize: RFValue(14), marginTop: RFValue(10), marginHorizontal: RFValue(20), }}>{item.key == 's3' ? 'Done' : 'Skip'}</Text></TouchableWithoutFeedback>
                </View>
                <View style={{alignItems: 'center'}}>
                <StatusBar barStyle={colors.background == '#fff' ? 'dark-content' : 'light-content'} backgroundColor={colors.background == '#fff' ? '#fff' : '#000'} />
                <Image style={styles.introImageStyle} source={colors.background == '#fff' ? item.image : item.darkImage} />
                <Text style={[styles.introTitleStyle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.introTextStyle, { color: colors.text }]}>{item.text}</Text>
                </View>
            </View>
        );
    };
    const slides = [
        {
            key: 's1',
            title: 'Record the Moments',
            text: 'The moments we capture in time are what make experiences worth reliving.',
            image: require('../../assets/images/walk-through/screen1.png'),
            darkImage: require('../../assets/images/walk-through/darkScreen1.png'),
            backgroundColor: colors.background,
        },
        {
            key: 's2',
            title: 'Stitch 30s Videos',
            text: 'Advanced Machine Learning Algorithm Creates a Stitched 30-seconds meaningful video of your memories weekly.',
            image: require('../../assets/images/walk-through/screen2.png'),
            darkImage: require('../../assets/images/walk-through/darkScreen2.png'),
            backgroundColor: colors.background,
        },
        {
            key: 's3',
            title: 'Share with Friends',
            text: 'Use the all-new VidUp to create and share videos of your exciting adventures with lush visuals!',
            image: require('../../assets/images/walk-through/screen3.png'),
            darkImage: require('../../assets/images/walk-through/darkScreen3.png'),
            backgroundColor: colors.background,
        }
    ];
    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <AppIntroSlider
                data={slides}
                renderItem={RenderItem}
                onDone={onDone}
                showDoneButton={false}
                showSkipButton={false}
                showNextButton={false}
                onSkip={onSkip}
                dotStyle={{ backgroundColor: colors.text }}
                activeDotStyle={{ backgroundColor: 'red' }}
            />
        </SafeAreaView>
    );
};

function mapDispatchToProps(dispatch) {
    return {
        setAppIntroDispatch: () => dispatch({
            type: 'App_Intro',
            payload: '1'
        })
    };
}

export default connect(null, mapDispatchToProps)(AppIntro);







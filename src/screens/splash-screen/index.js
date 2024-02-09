import React, {useEffect} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axiosCongif from "../../../store/utils/axiosCongif";
import {Login} from "../../../store/actions/user";
import {connect} from "react-redux";

const Splash = (props) => {
    const { navigation, user } = props;
    useEffect(() => {
        // const token = user.token;
        // axiosCongif.init(token);
        setTimeout(() => {
            navigation.navigate('App');
            // if (token) {
            //     navigation.navigate('Dashboard');
            // } else {
            //     navigation.navigate('Auth');
            // }
        }, 300)
    }, []);

    return (
        <LinearGradient colors={['#FB6200', '#EF0059']} style={styles.home}>
            <Image source={require('assets/images/logo/white-logo-small.png')} resizeMode="contain"/>
        </LinearGradient>
    );
};
const styles = StyleSheet.create({
    home: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
function mapStateToProps(state) {
    return {
        user: state.user.user
    };
}
export default connect(mapStateToProps, null)(Splash);
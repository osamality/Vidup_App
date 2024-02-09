import {StyleSheet} from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    loginButton: {
        height: hp("6%"),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    whiteColor: {
        color: '#fff'
    },
});
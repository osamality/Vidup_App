import {StyleSheet} from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    MainContainer: {
        backgroundColor: '#fff',
    },
    container: {
        marginLeft: 40,
        marginRight: 40,
        height: '100%',
    },
    logoContainer: {
        marginTop: 100,
        alignItems: 'center'
    },
    signIntext: {
        fontSize: 16,
        color: '#464646',
        fontWeight: '600',
        marginTop: 66
    },
    loginButton: {
        height: hp("6%"),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    whiteColor: {
        color: '#fff'
    },
    buttonMargin: {
        marginTop: 10,
        marginBottom: 10
    },
    bottomText: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column-reverse',
        marginBottom: 20
    }
});
import {StyleSheet} from "react-native";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
export const styles = StyleSheet.create({
    MainContainer: {
        backgroundColor: '#fff',
    },
    topHeader: {
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingVertical: hp('2%'),
        marginBottom: hp('1%'),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4.65,
        elevation: 6,
        zIndex: 9999,
    },
    container: {
        marginLeft: 40,
        marginRight: 40,
        height: '100%',
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
        marginVertical: 10
    }
});
import {StyleSheet} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
export const styles = StyleSheet.create({
    topHeader: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10
    },
    wrapper: {
        display: 'flex',
        height: '100%',
        backgroundColor: "#fff"
    },
    topBar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    followersRequest: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    notificationSection: {
        marginTop: 20,
        flexGrow: 1
    },
    notificationItem: {
        marginTop: 30,
        display: 'flex',
        flexDirection: 'row'
    },
    gradientButton: {
        borderRadius: 5,
        height: 26,
        textAlign: 'center',
        alignItems: 'center',
        height: 26
    },
    outlineButton: {
        borderRadius: 5,
        height: 26,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FB6200'
    },
    buttonWrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection:'row',
        alignItems: 'center',
        flexGrow: 1


    }
});
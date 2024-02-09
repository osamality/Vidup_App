import {StyleSheet} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1
    },
    topHeader: {
        display: 'flex',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: hp('2%')
    },
    wrapper: {
        display: 'flex',
        flex: 1,
        backgroundColor: '#fff'
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
        width: 80,
        height: 32,
        paddingTop: 7,
        paddingBottom: 5,
        paddingLeft: 18
    },
    buttonWrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection:'row',
        alignItems: 'center',
        flexGrow: 1,
    }
});
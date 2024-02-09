import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Color } from 'constants';
export const styles = StyleSheet.create({
    topHeader: {
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: hp('3%'),
        // marginBottom: 10,
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
    wrapper: {
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1,
    },
    topBar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    followersRequest: {
        display: 'flex',
        flexDirection: 'row',
    },
    notificationSection: {
        marginTop: 15,
        flex: 1
    },
    notificationItem: {
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row'
    }
});
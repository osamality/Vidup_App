import {StyleSheet} from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
export const styles = StyleSheet.create({
    MainContainer: {
        backgroundColor: '#fff',
    },
    container: {
        height: '100%'
    },
    topBar: {
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: wp('5%'),
        paddingTop: wp('4%'),
        marginBottom: wp('7%'),
        justifyContent: 'space-between'
    },
    thumbnailSection: {
        alignItems: 'center'
    },
    view: {
        backgroundColor: '#EF0059',
        borderRadius: 5,
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 12,
        paddingLeft: 12,
        marginLeft: 3,
        marginRight: 3,
        minWidth: 70,
    }
});
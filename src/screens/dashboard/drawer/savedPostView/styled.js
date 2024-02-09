import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Color, FontFamily } from 'constants';


export const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: Color.LightGrey2
    },
    topHeader: {
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingVertical: 10
    },
    logo: {
        resizeMode: 'stretch',
        width: wp("7%"),
        height: hp("2.5%")
    },
    logoText: {
        fontWeight: '500',
        marginLeft: 10,
        fontSize: hp("1.8%")
    },
    videoPlayer: {
        width: wp('99%'),
        height: ('100%'),
        backgroundColor: 'black',
    },
    videoThumbnail: {
        height: hp('30%'),
        width: wp('99%'),
        backgroundColor: 'black'
    },
    postImage: {
        height: hp('30%'),
        width: wp('99%'),
        backgroundColor: 'black'
    },
    userView: {
        flexDirection: 'row',
        flexGrow: 1,
        justifyContent: 'space-between',
        marginVertical: 10
    },
    postDescription: {
        flex: 1,
        flexGrow: 1,
        marginLeft: 10
    },
    postDescriptionText: {
        marginBottom: 5,
        color: 'gray',
        fontSize: 12
    },
    nestedRowView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10
    },
    rowView: {
        flexDirection: 'row'
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
    postOverlay: {
        position: 'absolute', top: 0,
        left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }, view: {
        justifyContent: 'flex-end',
        margin: 0
    },
    loginButton: {
        paddingTop: 12,
        alignItems: 'center',
        borderRadius: 5,
        height: 37
    },
    outlineButton: {
        borderRadius: 5,
        textAlign: 'center',
        alignItems: 'center',
        height: 37,
        width: '100%',
        paddingTop: 8,
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 1,
        borderColor: '#FB6200',

    },
    topHeader: {
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingVertical: 10
    },

});
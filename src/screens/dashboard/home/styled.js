import { StyleSheet, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Color, FontFamily} from 'constants';

export const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: Color.LightGrey2
    },
    videoPlayer: {
        width: wp('100%'), 
        height: ('100%'), 
        backgroundColor: 'black',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    videoThumbnail: {
        width: wp('100%'), 
        height: ('100%'),
        backgroundColor: 'black',
    }, 
    postOverlay: { 
        position: 'absolute', top: 0, 
        left: 0, right: 0, bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    postImage: {
        height: hp('30%'),
        width: wp('100%'),
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
        color: Color.LightGrey3,
        fontSize: RFValue(10),
        fontFamily: FontFamily.regular,
        flexDirection: 'row'

    },
    description: {
        color: Color.DarkGrey,
        fontSize: RFValue(12),
        fontFamily: FontFamily.regular
    },  
    nestedRowView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    rowView: {
        flexDirection: 'row',
        paddingVertical: 5
    },
    view: {
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

});
import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
    roundBtn: {
         alignItems: 'center', justifyContent: 'center', 
         position: 'absolute', top: 100, right: 10, height: 50, 
         width: 50, borderRadius: 100, backgroundColor: 'rgba(0,0,0, 0.5)'
    },
    bottomView: {
         alignSelf: 'flex-end', flexDirection: 'row',
         width: '62%', alignItems: 'center', 
         justifyContent: 'flex-start'
    },
    imagesView: {
         marginLeft: '15%', alignItems: 'center', 
         justifyContent: 'center', height: 50, width: 50, 
         borderRadius: 100, backgroundColor: 'rgba(0,0,0, 0.5)'
    },
    recordBtn: { 
        flex: 0, borderRadius: 100, height: 85, width: 85, 
        borderWidth: 8, marginBottom: 15, borderColor: 'gray', 
        backgroundColor: 'red', flexDirection: 'row', justifyContent: 'center' 
    },
    recordText: { 
        color: "#fff", fontSize: 18, 
        fontWeight: 'bold', position: 'absolute', top: 50 
    },
    loginButton: {
        padding: 15,
        alignItems: 'center',
        borderRadius: 5,
        marginHorizontal: 15,
    },
    whiteColor: {
        color: '#fff'
    },
    greyBox: { 
        height: wp('15%'), width: wp('18%'), left: wp('8%'), 
        backgroundColor: '#EEEEEE', position: 'absolute', 
        bottom: wp('4%'), justifyContent: 'center', 
        alignItems: 'center' 
    },
    btmText: { 
        color: 'gray', position: 'absolute', 
        left: wp('8%'), bottom: wp('21%'), 
        fontSize: RFValue(12) 
    },
    scrollView: { 
        width: '100%', alignSelf: 'center', 
        marginTop: -RFValue(50) 
    },
    scrollViewContent: { 
        alignItems: 'center', justifyContent: 'center', 
        paddingHorizontal: 10 
    }

});
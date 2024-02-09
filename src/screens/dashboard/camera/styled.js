import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
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
         position: 'absolute', top: 50, right: 10, height: 50, 
         width: 50, borderRadius: 100, backgroundColor: 'rgba(0,0,0, 0.5)'
    },
    bottomView: {
         alignSelf: 'flex-end', flexDirection: 'row',
         width: '62%', alignItems: 'center', 
         justifyContent: 'flex-start',
         marginBottom: RFValue(30)
    },
    imagesView: {
         marginLeft: '15%', alignItems: 'center', 
         justifyContent: 'center', height: 50, width: 50, 
         borderRadius: 100, backgroundColor: 'rgba(0,0,0, 0.5)'
    },
    recordBtn: { 
        flex: 0, borderRadius: 100, height: 85, width: 85, 
        borderWidth: 8, marginBottom: 15, borderColor: 'rgb(214,214,214)', 
        backgroundColor: 'rgb(247,70,25)', flexDirection: 'row', justifyContent: 'center',
    },
    recordText: { 
        color: "#fff", fontSize: 18, 
        fontWeight: 'bold', position: 'absolute', top: 50 
    },
    box: {
        height: 150,
        width: 150,
        backgroundColor: "blue",
        borderRadius: 5
      }

});
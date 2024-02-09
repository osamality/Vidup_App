import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: hp('16%'),
    right: 10,
    height: 45,
    width: 45,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0, 0.5)',
  },
  bottomView: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    width: '62%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  imagesView: {
    marginLeft: '15%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0, 0.5)',
  },
  recordBtn: {
    flex: 0,
    borderRadius: 100,
    height: 85,
    width: 85,
    borderWidth: 8,
    marginBottom: 15,
    borderColor: 'gray',
    backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  recordText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    position: 'absolute',
    top: 50,
  },
  loginButton: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 15,
  },
  whiteColor: {
    color: '#fff',
  },
});

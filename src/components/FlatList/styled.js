import { StyleSheet, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Color, FontFamily } from 'constants';
import { RFValue } from 'react-native-responsive-fontsize';

export const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },
  roundBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
    width: 25,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0, 0.5)',
  },
  videoPlayer: {
    // width: 100,
    // height: 100,
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  videoThumbnail: {
    width: wp('100%'),
    height: '100%',
    backgroundColor: 'black',
  },
  postOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postImage: {
    height: hp('30%'),
    width: wp('100%'),
    backgroundColor: 'black',
  },
  userView: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 10,
  },
  postDescription: {
    marginLeft: 10,
    justifyContent: 'center',
    width: '80%',
  },
  postDescriptionText: {
    marginBottom: 5,
    color: Color.LightGrey3,
    fontSize: RFValue(10),
    fontFamily: FontFamily.regular,
    flexDirection: 'row',
  },
  nestedRowView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  rowView: {
    flexDirection: 'row',
    flexGrow: 1,
  },
});

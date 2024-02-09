import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

module.exports = StyleSheet.create({
  commentContainer: {
    padding: 5,
    flexDirection: 'row'
  },
  left: {
    padding: 5
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 40
  },
  right: {
    flex: 1,
    padding: 5
  },
  rightContent: {
    borderRadius: 10,
    padding: 5,
    backgroundColor: '#f1f3f6'
  },
  rightContentTop: {
    flexDirection: 'row'
  },

  name: {
    fontWeight: 'bold',
    paddingBottom: 5
  },
  editIcon: {
    flex: 1,
    alignItems: 'flex-end',
  },
  body: {
    paddingBottom: 10
  },
  rightActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  time: {
    fontSize: 12,
    paddingLeft: 5,
    color: '#9B9B9B',
    fontStyle: 'italic'
  },
  actionText: {
    color: '#9B9B9B',
    fontWeight: 'bold'
  },
  repliedSection: {
    width: 180,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  repliedImg: {
    height: 20,
    width: 20,
    borderRadius: 20
  },
  repliedUsername: {
    color: '#9B9B9B',
    fontWeight: 'bold'
  },
  repliedText: {
    color: '#9B9B9B',
  },
  repliedCount: {
    color: '#9B9B9B',
    fontSize: 12
  },
  inputSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  submit: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    color: '#424242',
  },
  likeNr: {
    fontWeight: 'normal',
    fontSize: 12
  },
  likeHeader: {
    textAlign: 'center',
    padding: 10,
    fontWeight: 'bold'

  },
  likeButton: {
    margin: 10,
    alignItems: 'center',

  },
  likeContainer: {
    padding: 10,
    width: 200,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',

  },
  likeImage: {
    width: 50,
    height: 50,
    borderRadius: 50
  },
  likename: {
    fontWeight: 'bold',
    fontSize: 14
  },
  editModalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  editModal: {
    backgroundColor: "white",
    width: 400,
    height: 300,
    borderWidth: 2,
    borderColor: "silver"
  },
  editButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 40,
    width: 80,
    paddingLeft: 5,
    paddingRight: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "silver",
    borderRadius: 5,
    margin: 10

  },
  topHeader: {
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
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
roundBtn: {
  alignItems: 'center', justifyContent: 'center', 
  height: 25, width: 25, borderRadius: 100, backgroundColor: 'rgba(0,0,0, 0.5)'
},
videoPlayer: {
  width: wp('100%'), 
  height: '100%', 
  backgroundColor: 'black',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
},
postImage: {
    height: hp('30%'),
    width: wp('100%'),
    backgroundColor: 'black'
},
})
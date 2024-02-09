import { Text, View, StatusBar, ScrollView, Image, TextInput } from 'react-native';
import { Icon } from 'native-base';
import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import { styles } from './styled';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Menu, { MenuItem } from 'react-native-material-menu';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Color } from 'constants';
import { emojiIcon } from 'assets';
import { Statusbar } from './../../../components';
import { RFValue } from 'react-native-responsive-fontsize';

function renderBubble(props) {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#EF0059',
        },
      }}
    />
  );
}

const ChatScreen = ({ navigation }) => {
  _menu = null;

  const setMenuRef = (ref) => {
    _menu = ref;
  };

  const hideMenu = () => {
    _menu.hide();
  };

  const showMenu = () => {
    _menu.show();
  };

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    // setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, []);

  const renderComposer = (props) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          borderWidth: 1,
          borderRadius: 35,
          height: wp('12%'),
          width: wp('95%'),
          justifyContent: 'space-between',
          paddingHorizontal: 5,
          alignItems: 'center',
          marginBottom: wp('20%'),
          alignSelf: 'center',
          borderColor: Color.LightGrey2,
        }}>
        <Image source={emojiIcon} style={{ width: 20, height: 20, marginHorizontal: 5 }} />
        {/* <Icon onPress={() => navigation.goBack()} type="AntDesign" name='back' style={{ fontSize: 16 }} /> */}
        <TextInput
          {...props}
          multiline={true}
          // onChangeText={(text) => setNewMsg(text)}
          style={{ width: wp('72%') }}
        />
        <ScrollView keyboardShouldPersistTaps={'always'}>
          <Text onPress={() => onSend(newMsg)} style={{ color: Color.Orange, fontSize: 16 }}>
            Send
          </Text>
        </ScrollView>
      </View>
    );
  };

  const customtInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: 'white',
          borderTopColor: '#E8E8E8',
          borderTopWidth: 1,
          padding: 8,
        }}
      />
    );
  };

  return (
    <View style={[styles.MainContainer, { marginTop: RFValue(15) }]}>
      <Statusbar />
      <View style={{ overflow: 'hidden', paddingBottom: 5 }}>
        <View style={styles.topHeader}>
          <Icon
            onPress={() => navigation.goBack()}
            type="Entypo"
            name="chevron-thin-left"
            style={{ fontSize: 20, color: '#464646' }}
          />
          <Text style={styles.logoText}>John Doe</Text>
          <Menu
            ref={setMenuRef}
            button={
              <Icon
                onPress={showMenu}
                type="Entypo"
                name="dots-three-vertical"
                style={{ fontSize: 16 }}
              />
            }>
            <MenuItem onPress={hideMenu}>Archive Chat</MenuItem>
            <MenuItem onPress={hideMenu}>Mute</MenuItem>
            <MenuItem onPress={hideMenu}>Report</MenuItem>
          </Menu>
        </View>
      </View>

      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        renderBubble={renderBubble}
        //renderComposer={props => renderComposer(props)}
        renderInputToolbar={(props) => renderComposer(props)}
        style={{ backgroundColor: '#fff' }}
        //textInputStyle={{ borderRadius: 20, paddingLeft: 15, borderWidth: 0.5 }}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
};

export default ChatScreen;

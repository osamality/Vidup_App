import React, { useState } from 'react';
import { StyleSheet, TextInput, Text, Pressable, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Drag from 'reanimated-drag-resize';

import { closeIcon } from 'assets';
import {} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const TextOver = ({
  textOver,
  index,
  videoContainer,
  setTextOver,
  item,
  videoDim,
  width,
  setEditable,
  setSelectedTextIndex,
  editable,
  height,
}) => {
  const [disabled, setDisabled] = useState(false);

  const _getRelativePosition = (bounds) => {
    let percentageX = (bounds.left * 100) / width;
    let positionRelatedToVideoX = (percentageX / 100) * videoDim.width;

    let actualPosition = bounds.top - videoContainer.y;
    let percentageY = (actualPosition * 100) / videoContainer.height;
    let positionRelatedToVideoY = (percentageY / 100) * videoDim.height;

    return { left: positionRelatedToVideoX, top: positionRelatedToVideoY };
  };

  return (
    <Drag
      style={{
        zIndex: 9999,
        height: 40,
      }}
      resizable={false}
      key={index}
      // height={'225%'}
      // width={'45%'}
      x={textOver[index].x}
      y={textOver[index].y}
      limitationHeight={height}
      limitationWidth={width}
      onDragEnd={(boxPosition) => {
        let temp = textOver;
        let bounds = { top: boxPosition.y, left: boxPosition.x };
        temp[index] = {
          ...temp[index],
          cords: _getRelativePosition(bounds),
          x: bounds.left,
          y: bounds.top,
          // height: _getResponsiveSize(boxPosition.height),
          // width: _getResponsiveSize(boxPosition.width),
          // x: boxPosition.x,
          // y: boxPosition.y,
        };
        setTextOver([...temp]);
      }}>
      <View
        style={{
          zIndex: 1000,
        }}>
        <Pressable
          onPress={() => {
            setEditable(!editable);
            setSelectedTextIndex(index);
          }}
          style={{
            height: 40,
          }}>
          <View
            style={{
              borderColor: 'transparent',
              borderWidth: 0.5,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            {editable ? (
              <>
                <TextInput
                  style={{
                    maxHeight: videoContainer.height,
                    maxWidth: videoContainer.width,
                    width: wp(75),
                    // backgroundColor: 'green',
                    // fontFamily: this.props.FontFamily,

                    color: textOver[index].fontColor,
                    fontSize: textOver[index].fontsize,
                    letterSpacing: 1,
                    textAlignVertical: 'center',
                    textAlign: 'left',
                    fontWeight: 'bold',
                  }}
                  selectTextOnFocus={true}
                  multiline={true}
                  maxLength={200}
                  autoFocus={true}
                  autoCorrect={false}
                  autoComplete={'off'}
                  onChangeText={(text) => {
                    let temp = textOver;
                    temp[index] = { ...temp[index], text: text };
                    setTextOver([...temp]);
                  }}
                  placeholder={'add Text Here...'}
                  placeholderTextColor={'white'}
                  value={textOver[index].text ? textOver[index].text : ''}
                />
              </>
            ) : (
              <Text
                onTextLayout={(e) => {
                  let temp = textOver;
                    temp[index] = { ...temp[index], destructuredText: e.nativeEvent.lines };
                    setTextOver([...temp]);
                    console.log("Text Details: ",e.nativeEvent);
                }}
                style={{
                  maxHeight: videoContainer.height,
                  maxWidth: videoContainer.width,
                  width: wp(75),
                  // backgroundColor: 'yellow',
                  // fontFamily: this.props.FontFamily,

                  color: textOver[index].fontColor,
                  fontSize: textOver[index].fontsize,
                  letterSpacing: 1,
                  textAlignVertical: 'center',
                  textAlign: 'left',
                  fontWeight: 'bold',
                }}>
                {textOver[index].text ? textOver[index].text : ''}
              </Text>
            )}
          </View>
        </Pressable>
      </View>
    </Drag>
  );
};

const styles = StyleSheet.create({});

//503107736

import React, { useState } from 'react';
import { StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Drag from '../../edited-modules/reanimated-drag-resize';
import Animated from 'react-native-reanimated';

import { closeIcon } from 'assets';
import { State } from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');
const SIZE = width;

export const EmojiPicker = ({
  selectedEmoji,
  index,
  videoContainer,
  selectEmoji,
  item,
  videoDim,
  width,
  height
}) => {

  const _getRelativePosition = (bounds) => {
    let percentageX = (bounds.left * 100) / width;
    let positionRelatedToVideoX = (percentageX / 100) * videoDim.width;

    let actualPosition = bounds.top - videoContainer.y;
    let percentageY = (actualPosition * 100) / videoContainer.height;
    let positionRelatedToVideoY = (percentageY / 100) * videoDim.height;

    return { left: positionRelatedToVideoX, top: positionRelatedToVideoY };
  };

  return (
    <>
      <Drag
        key={index}
        height={selectedEmoji[index].height}
        width={selectedEmoji[index].width}
        x={selectedEmoji[index].x}
        y={selectedEmoji[index].y}
        limitationHeight={height}
        limitationWidth={width}
        onDragEnd={(boxPosition) => {
          let temp = selectedEmoji;
          let bounds = { top: boxPosition.y, left: boxPosition.x };
          temp[index] = {
            ...temp[index],
            cords: _getRelativePosition(bounds),
            height: boxPosition.height,
            width: boxPosition.width,
            x: boxPosition.x,
            y: boxPosition.y,
          };
          selectEmoji([...temp]);
        }}
        onResizeEnd={(boxPosition) => {
          let temp = selectedEmoji;
          let bounds = { top: boxPosition.y, left: boxPosition.x };
          temp[index] = {
            ...temp[index],
            cords: _getRelativePosition(bounds),
            height: boxPosition.height,
            width: boxPosition.width,
            x: boxPosition.x,
            y: boxPosition.y,
          };
          selectEmoji([...temp]);
        }}>
        {/* <Gestures
      rotatable={true}
      scalable={false}
      onChange={(event, styles) => {
        console.log(styles);
      }}> */}
        <FastImage
          source={{ uri: item.uri }}
          style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
        />
        {/* </Gestures> */}
        <Pressable
          onPress={() => {
            let temp = [];
            selectedEmoji.filter((i, ind) => {
              if (i.cords !== item.cords) {
                temp.push(i);
              }
            });
            selectEmoji([...temp]);
          }}
          style={{
            position: 'absolute',
            right: 1,
            height: 16,
            width: 16,
            borderRadius: 7.5,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
            opacity: 0.5,
            zIndex: 999999,
          }}>
          <Image resizeMode={'contain'} source={closeIcon} style={styles.image} />
        </Pressable>
      </Drag>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 8,
    height: 8,
    tintColor: 'white',
  },
});

// import React, { useState } from 'react';
// import { StyleSheet, Image, Pressable, Dimensions, ScaledSize } from 'react-native';
// import { useTheme } from '@react-navigation/native';
// import Drag from 'reanimated-drag-resize';
// import Animated, {
//   useAnimatedGestureHandler,
//   useAnimatedStyle,
//   useSharedValue,
//   Value,
// } from 'react-native-reanimated';

// import { closeIcon } from 'assets';
// import { PinchGestureHandler, PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler';
// import FastImage from 'react-native-fast-image';
// import { scanFile } from 'react-native-fs';

// const { width } = Dimensions.get('window');
// const SIZE = width;

// const AnumatedImage = Animated.createAnimatedComponent(Image);

// export const EmojiPicker = ({
//   selectedEmoji,
//   index,
//   videoContainer,
//   selectEmoji,
//   item,
//   videoDim,
//   width,
// }) => {
//   const _getRelativePosition = (bounds) => {
//     let percentageX = (bounds.left * 100) / width;
//     let positionRelatedToVideoX = (percentageX / 100) * videoDim.width;

//     let percentageY = (bounds.top * 100) / videoContainer.height;
//     let positionRelatedToVideoY = (percentageY / 100) * videoDim.height;

//     return { left: positionRelatedToVideoX, top: positionRelatedToVideoY };
//   };

//   const scale = useSharedValue(1);
//   const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
//     onActive: (event) => {
//       console.log(event);
//       scale.value = event.scale;
//     },
//   });

//   const  rStyle = useAnimatedStyle(() => {
//     return {
//       transform: [(scale: scale.c)]
//     }
//   })

//   return (
//     <>
//       {/* <Drag
//         resizable={false}
//         key={index}
//         height={selectedEmoji[index].height}
//         width={selectedEmoji[index].width}
//         x={selectedEmoji[index].x}
//         y={selectedEmoji[index].y}
//         limitationHeight={videoContainer.height}
//         limitationWidth={videoContainer.width}
//         // onDragEnd={(boxPosition) => {
//         //   let temp = selectedEmoji;
//         //   let bounds = { top: boxPosition.y, left: boxPosition.x };
//         //   temp[index] = {
//         //     ...temp[index],
//         //     cords: _getRelativePosition(bounds),
//         //     height: boxPosition.height,
//         //     width: boxPosition.width,
//         //     x: boxPosition.x,
//         //     y: boxPosition.y,
//         //   };
//         //   selectEmoji([...temp]);
//         // }}
//         // onResizeEnd={(boxPosition) => {
//         //   let temp = selectedEmoji;
//         //   let bounds = { top: boxPosition.y, left: boxPosition.x };
//         //   temp[index] = {
//         //     ...temp[index],
//         //     cords: _getRelativePosition(bounds),
//         //     height: boxPosition.height,
//         //     width: boxPosition.width,
//         //     x: boxPosition.x,
//         //     y: boxPosition.y,
//         //   };
//         //   selectEmoji([...temp]);
//         // }}
//       > */}
//       {/* <Gestures
//       rotatable={true}
//       scalable={false}
//       onChange={(event, styles) => {
//         console.log(styles);
//       }}> */}
//       <PinchGestureHandler onGestureEvent={pinchHandler}>
//         <AnumatedImage
//           source={{ uri: item.uri }}
//           style={[
//             styles.emojiStyle,
//             {
//               // transform: [{ scale }],
//             },
//           ]}
//         />
//       </PinchGestureHandler>
//       {/* <FastImage
//           source={{ uri: item.uri }}
//           style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
//         /> */}
//       {/* </Gestures> */}
//       <Pressable
//         onPress={() => {
//           let temp = [];
//           selectedEmoji.filter((i, ind) => {
//             if (i.cords !== item.cords) {
//               temp.push(i);
//             }
//           });
//           selectEmoji([...temp]);
//         }}
//         style={{
//           position: 'absolute',
//           right: 1,
//           height: 16,
//           width: 16,
//           borderRadius: 7.5,
//           alignItems: 'center',
//           justifyContent: 'center',
//           backgroundColor: 'black',
//           opacity: 0.5,
//           zIndex: 999999,
//         }}>
//         <Image resizeMode={'contain'} source={closeIcon} style={styles.image} />
//       </Pressable>
//       {/* </Drag> */}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   image: {
//     width: 8,
//     height: 8,
//     tintColor: 'white',
//   },
//   emojiStyle: {
//     alignSelf: 'center',
//     width: 170,
//     height: 170,
//     resizeMode: 'cover',
//   },
// });

// import React, { useState } from 'react';

// import {
//   StyleSheet,
//   Animated,
//   Image,
//   Pressable,
//   Dimensions,
//   StyleProp,
//   ViewStyle,
// } from 'react-native';
// import { useTheme } from '@react-navigation/native';
// import Drag from 'reanimated-drag-resize';

// import { closeIcon } from 'assets';
// import FastImage from 'react-native-fast-image';

// const { width } = Dimensions.get('window');
// const SIZE = width;

// import {
//   PanGestureHandler,
//   PinchGestureHandler,
//   RotationGestureHandler,
//   State,
//   PanGestureHandlerGestureEvent,
//   PanGestureHandlerStateChangeEvent,
//   RotationGestureHandlerGestureEvent,
//   PinchGestureHandlerGestureEvent,
//   PinchGestureHandlerStateChangeEvent,
//   RotationGestureHandlerStateChangeEvent,
// } from 'react-native-gesture-handler';

// import { USE_NATIVE_DRIVER } from './config';

// type DraggableBoxProps = {
//   minDist?: number;
//   boxStyle?: StyleProp<ViewStyle>;
// };

// export class EmojiPicker extends React.Component<DraggableBoxProps> {
//   private panRef = React.createRef<PanGestureHandler>();
//   private rotationRef = React.createRef<RotationGestureHandler>();
//   private pinchRef = React.createRef<PinchGestureHandler>();
//   private baseScale: Animated.Value;
//   private pinchScale: Animated.Value;
//   private scale: Animated.AnimatedMultiplication;
//   private lastScale: number;
//   private onPinchGestureEvent: (event: PinchGestureHandlerGestureEvent) => void;
//   private rotate: Animated.Value;
//   private rotateStr: Animated.AnimatedInterpolation;
//   private lastRotate: number;
//   private onRotateGestureEvent: (event: RotationGestureHandlerGestureEvent) => void;
//   private tilt: Animated.Value;
//   private tiltStr: Animated.AnimatedMultiplication;
//   private lastTilt: number;
//   private onTiltGestureEvent: (event: PanGestureHandlerGestureEvent) => void;

//   private translateX: Animated.Value;
//   private translateY: Animated.Value;
//   private lastOffset: { x: number; y: number };
//   private onGestureEvent: (event: PanGestureHandlerGestureEvent) => void;

//   constructor(props: DraggableBoxProps) {
//     super(props);
//     /* Pinching */
//     this.baseScale = new Animated.Value(1);
//     this.pinchScale = new Animated.Value(1);
//     this.scale = Animated.multiply(this.baseScale, this.pinchScale);
//     this.lastScale = 1;
//     this.onPinchGestureEvent = Animated.event([{ nativeEvent: { scale: this.pinchScale } }], {
//       useNativeDriver: USE_NATIVE_DRIVER,
//     });

//     /* Rotation */
//     this.rotate = new Animated.Value(0);
//     this.rotateStr = this.rotate.interpolate({
//       inputRange: [-100, 100],
//       outputRange: ['-100rad', '100rad'],
//     });
//     this.lastRotate = 0;
//     this.onRotateGestureEvent = Animated.event([{ nativeEvent: { rotation: this.rotate } }], {
//       useNativeDriver: USE_NATIVE_DRIVER,
//     });

//     /* Tilt */
//     this.tilt = new Animated.Value(0);
//     this.tiltStr = this.tilt.interpolate({
//       inputRange: [-501, -500, 0, 1],
//       outputRange: ['1rad', '1rad', '0rad', '0rad'],
//     });
//     this.lastTilt = 0;
//     this.onTiltGestureEvent = Animated.event(
//       [
//         {
//           nativeEvent: {
//             translationX: this.translateX,
//             // translationY: this.tilt,
//             translationY: this.translateY,
//           },
//         },
//       ],
//       // {
//       //   useNativeDriver: USE_NATIVE_DRIVER,
//       // },
//     );
//     this.translateX = new Animated.Value(0);
//     this.translateY = new Animated.Value(0);
//     this.lastOffset = { x: 0, y: 0 };
//     this.onGestureEvent = Animated.event(
//       [
//         {
//           nativeEvent: {
//             translationX: this.translateX,
//             translationY: this.translateY,
//             // translationY: this.tilt,
//           },
//         },
//       ],
//       { useNativeDriver: USE_NATIVE_DRIVER },
//     );
//   }

//   private onRotateHandlerStateChange = (event: RotationGestureHandlerStateChangeEvent) => {
//     if (event.nativeEvent.oldState === State.ACTIVE) {
//       this.lastRotate += event.nativeEvent.rotation;
//       this.rotate.setOffset(this.lastRotate);
//       this.rotate.setValue(0);
//     }
//   };
//   private onPinchHandlerStateChange = (event: PinchGestureHandlerStateChangeEvent) => {
//     if (event.nativeEvent.oldState === State.ACTIVE) {
//       this.lastScale *= event.nativeEvent.scale;
//       this.baseScale.setValue(this.lastScale);
//       this.pinchScale.setValue(1);
//     }
//   };
//   private onTiltGestureStateChange = (event: PanGestureHandlerStateChangeEvent) => {
//     if (event.nativeEvent.oldState === State.ACTIVE) {
//       this.lastTilt += event.nativeEvent.translationY;
//       this.tilt.setOffset(this.lastTilt);
//       this.tilt.setValue(0);
//       this.lastOffset.x += event.nativeEvent.translationX;
//       this.lastOffset.y += event.nativeEvent.translationY;
//       this.translateX.setOffset(this.lastOffset.x);
//       this.translateX.setValue(0);
//       this.translateY.setOffset(this.lastOffset.y);
//       this.translateY.setValue(0);
//     }
//   };
//   private onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
//     if (event.nativeEvent.oldState === State.ACTIVE) {
//       // this.lastTilt += event.nativeEvent.translationY;
//       // this.tilt.setOffset(this.lastTilt);
//       // this.tilt.setValue(0);
//       this.lastOffset.x += event.nativeEvent.translationX;
//       this.lastOffset.y += event.nativeEvent.translationY;
//       this.translateX.setOffset(this.lastOffset.x);
//       this.translateX.setValue(0);
//       this.translateY.setOffset(this.lastOffset.y);
//       this.translateY.setValue(0);
//     }
//     console.log(this.translateX, this.translateY, this.scale, this.rotateStr);
//   };

//   render() {
//     return (
//       // <PanGestureHandler
//       //   ref={this.panRef}
//       //   onGestureEvent={this.onTiltGestureEvent}
//       //   onHandlerStateChange={this.onTiltGestureStateChange}
//       //   minDist={10}
//       //   minPointers={2}
//       //   maxPointers={2}
//       //   avgTouches>
//       <PanGestureHandler
//         {...this.props}
//         onGestureEvent={this.onGestureEvent}
//         onHandlerStateChange={this.onHandlerStateChange}
//         minDist={this.props.minDist}
//         // minPointers={2}
//         // maxPointers={2}
//         avgTouches>
//         <Animated.View style={styles.wrapper}>
//           <RotationGestureHandler
//             ref={this.rotationRef}
//             simultaneousHandlers={this.pinchRef}
//             onGestureEvent={this.onRotateGestureEvent}
//             onHandlerStateChange={this.onRotateHandlerStateChange}>
//             <Animated.View style={styles.wrapper}>
//               <PinchGestureHandler
//                 ref={this.pinchRef}
//                 simultaneousHandlers={this.rotationRef}
//                 onGestureEvent={this.onPinchGestureEvent}
//                 onHandlerStateChange={this.onPinchHandlerStateChange}>
//                 <Animated.View style={styles.container} collapsable={false}>
//                   <Animated.Image
//                     style={[
//                       styles.pinchableImage,
//                       {
//                         transform: [
//                           // { perspective: 200 },
//                           { scale: this.scale },
//                           { rotate: this.rotateStr },
//                           // { rotateX: this.tiltStr },
//                           { translateX: this.translateX },
//                           { translateY: this.translateY },
//                         ],
//                       },
//                       this.props.boxStyle,
//                     ]}
//                     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//                     // source={require('./swmansion.png')}
//                     source={{ uri: this.props.item.uri }}
//                   />
//                 </Animated.View>
//               </PinchGestureHandler>
//             </Animated.View>
//           </RotationGestureHandler>
//         </Animated.View>
//       </PanGestureHandler>
//       // </PanGestureHandler>
//     );
//   }
// }

// export default EmojiPicker;

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     // backgroundColor: 'black',
//     // overflow: 'hidden',
//     alignItems: 'center',
//     // flex: 1,
//     justifyContent: 'center',
//   },
//   pinchableImage: {
//     width: 100,
//     height: 100,
//   },
//   wrapper: {
//     flex: 1,
//   },
//   image: {
//     width: 8,
//     height: 8,
//     tintColor: 'white',
//   },
// });

import React, { useState } from 'react';
import { StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Drag from 'reanimated-drag-resize';
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
  desireHeight,
}) => {
  const _getRelativePosition = (bounds) => {
    let percentageX = (bounds.left * 100) / width;
    let positionRelatedToVideoX = (percentageX / 100) * videoDim.width;

    let percentageY = (bounds.top * 100) / videoContainer.height;
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
        limitationHeight={videoContainer.height}
        limitationWidth={videoContainer.width}
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

// import React, { useEffect, useState, useRef } from 'react';
// import { Animated, StyleSheet } from 'react-native';

// import {
//   PanGestureHandler,
//   PinchGestureHandler,
//   RotationGestureHandler,
//   State,
//   PanGestureHandlerGestureEvent,
//   PanGestureHandlerStateChangeEvent,
//   RotationGestureHandlerGestureEvent,
//   PinchGestureHandlerGestureEvent,
//   PinchGestureHandlerStateChangeEvent,
//   RotationGestureHandlerStateChangeEvent,
// } from 'react-native-gesture-handler';

// import { USE_NATIVE_DRIVER } from './config';

// const EmojiPicker = () => {
//   const [baseScale, setbaseScale] = useState(new Animated.Value(1));
//   const [pinchScale, setpinchScale] = useState(new Animated.Value(1));
//   const [scale, setscale] = useState(Animated.multiply(baseScale, pinchScale));
//   const [lastScale, setlastScale] = useState(1);

//   const panRef = useRef(PanGestureHandler);
//   const rotationRef = useRef(RotationGestureHandler);
//   const pinchRef = useRef(PinchGestureHandler);
//   const [rotate, setrotate] = useState(Animated.Value);
//   const [rotateStr, setrotateStr] = useState(Animated.Value);
//   const [lastRotate, setlastRotate] = useState(Animated.Value);
//   const [tilt, settitle] = useState(Animated.Value);
//   const [tiltStr, settiltStr] = useState(Animated.Value);
//   const [lastTilt, setlastTilt] = useState(Animated.Value);

//   const onPinchGestureEvent = (event: PinchGestureHandlerGestureEvent) => {
//     Animated.event([{ nativeEvent: { scale: pinchScale } }], {
//       useNativeDriver: USE_NATIVE_DRIVER,
//     });
//   };

//   const onRotateGestureEvent = (event: RotationGestureHandlerGestureEvent) => {};
//   const onTiltGestureEvent = (event: PanGestureHandlerGestureEvent) => {};

//   // private panRef = React.createRef<PanGestureHandler>();
//   // private rotationRef = React.createRef<RotationGestureHandler>();
//   // private pinchRef = React.createRef<PinchGestureHandler>();
//   // private baseScale: Animated.Value;
//   // private pinchScale: Animated.Value;
//   // private scale: Animated.AnimatedMultiplication;
//   // private lastScale: number;
//   // private onPinchGestureEvent: (event: PinchGestureHandlerGestureEvent) => void;
//   // private rotate: Animated.Value;
//   // private rotateStr: Animated.AnimatedInterpolation;
//   // private lastRotate: number;
//   // private onRotateGestureEvent: (event: RotationGestureHandlerGestureEvent) => void;
//   // private tilt: Animated.Value;
//   // private tiltStr: Animated.AnimatedMultiplication;
//   // private lastTilt: number;
//   // private onTiltGestureEvent: (event: PanGestureHandlerGestureEvent) => void;
//   // constructor(props: Record<string, unknown>) {
//   //   super(props);

//   useEffect(() => {}, []);

//   //   /* Pinching */
//   //   this.lastScale = 1;
//   //   this.onPinchGestureEvent = Animated.event([{ nativeEvent: { scale: this.pinchScale } }], {
//   //     useNativeDriver: USE_NATIVE_DRIVER,
//   //   });

//   //   /* Rotation */
//   //   this.rotate = new Animated.Value(0);
//   //   this.rotateStr = this.rotate.interpolate({
//   //     inputRange: [-100, 100],
//   //     outputRange: ['-100rad', '100rad'],
//   //   });
//   //   this.lastRotate = 0;
//   //   this.onRotateGestureEvent = Animated.event([{ nativeEvent: { rotation: this.rotate } }], {
//   //     useNativeDriver: USE_NATIVE_DRIVER,
//   //   });

//   //   /* Tilt */
//   //   this.tilt = new Animated.Value(0);
//   //   this.tiltStr = this.tilt.interpolate({
//   //     inputRange: [-501, -500, 0, 1],
//   //     outputRange: ['1rad', '1rad', '0rad', '0rad'],
//   //   });
//   //   this.lastTilt = 0;
//   //   this.onTiltGestureEvent = Animated.event([{ nativeEvent: { translationY: this.tilt } }], {
//   //     useNativeDriver: USE_NATIVE_DRIVER,
//   //   });
//   // }

//   const onRotateHandlerStateChange = (event: RotationGestureHandlerStateChangeEvent) => {
//     if (event.nativeEvent.oldState === State.ACTIVE) {
//       this.lastRotate += event.nativeEvent.rotation;
//       this.rotate.setOffset(this.lastRotate);
//       this.rotate.setValue(0);
//     }
//   };
//   const onPinchHandlerStateChange = (event: PinchGestureHandlerStateChangeEvent) => {
//     if (event.nativeEvent.oldState === State.ACTIVE) {
//       this.lastScale *= event.nativeEvent.scale;
//       this.baseScale.setValue(this.lastScale);
//       this.pinchScale.setValue(1);
//     }
//   };
//   const onTiltGestureStateChange = (event: PanGestureHandlerStateChangeEvent) => {
//     if (event.nativeEvent.oldState === State.ACTIVE) {
//       this.lastTilt += event.nativeEvent.translationY;
//       this.tilt.setOffset(this.lastTilt);
//       this.tilt.setValue(0);
//     }
//   };
//   // render() {
//   return (
//     <PanGestureHandler
//       ref={this.panRef}
//       onGestureEvent={this.onTiltGestureEvent}
//       onHandlerStateChange={this.onTiltGestureStateChange}
//       minDist={10}
//       minPointers={2}
//       maxPointers={2}
//       avgTouches>
//       <Animated.View style={styles.wrapper}>
//         <RotationGestureHandler
//           ref={this.rotationRef}
//           simultaneousHandlers={this.pinchRef}
//           onGestureEvent={this.onRotateGestureEvent}
//           onHandlerStateChange={this.onRotateHandlerStateChange}>
//           <Animated.View style={styles.wrapper}>
//             <PinchGestureHandler
//               ref={this.pinchRef}
//               simultaneousHandlers={this.rotationRef}
//               onGestureEvent={this.onPinchGestureEvent}
//               onHandlerStateChange={this.onPinchHandlerStateChange}>
//               <Animated.View style={styles.container} collapsable={false}>
//                 <Animated.Image
//                   style={[
//                     styles.pinchableImage,
//                     {
//                       transform: [
//                         { perspective: 200 },
//                         { scale: this.scale },
//                         { rotate: this.rotateStr },
//                         { rotateX: this.tiltStr },
//                       ],
//                     },
//                   ]}
//                   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//                   source={require('./swmansion.png')}
//                 />
//               </Animated.View>
//             </PinchGestureHandler>
//           </Animated.View>
//         </RotationGestureHandler>
//       </Animated.View>
//     </PanGestureHandler>
//   );
//   // }
// };

// export default EmojiPicker;

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'black',
//     overflow: 'hidden',
//     alignItems: 'center',
//     flex: 1,
//     justifyContent: 'center',
//   },
//   pinchableImage: {
//     width: 250,
//     height: 250,
//   },
//   wrapper: {
//     flex: 1,
//   },
// });

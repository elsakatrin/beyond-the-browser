import { View, Image } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {useAnimatedStyle, useSharedValue, useAnimatedGestureHandler, withSpring} from 'react-native-reanimated';
import { PanGestureHandler } from "react-native-gesture-handler";

// Emoji stickers - make them 'movable'

const AnimatedImage = Animated.createAnimatedComponent(Image);

const AnimatedView = Animated.createAnimatedComponent(View);


export default function EmojiSticker({ imageSize, stickerSource }) {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    
// Animations for the sickers - make them bigger when tapping on mobile screen
    const scaleImage = useSharedValue(imageSize);
    const onDoubleTap = useAnimatedGestureHandler({
        onActive: () => {
          if (scaleImage.value) {
            scaleImage.value = scaleImage.value * 2;
          }
        },
      });
    //   Animations for stickers - spring
      const imageStyle = useAnimatedStyle(() => {
        return {
          width: withSpring(scaleImage.value),
          height: withSpring(scaleImage.value),
        };
      });
// Animation Drag effect for the stickers 
    const onDrag = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
      translateY.value = event.translationY + context.translateY;
    },
  });
  
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

      
  return ( 
    <PanGestureHandler onGestureEvent={onDrag}>
        <AnimatedView style={[containerStyle, { top: -350 }]}>
            <TapGestureHandler onGestureEvent={onDoubleTap} numberOfTaps={2}>
            <AnimatedImage
                source={stickerSource}
                resizeMode="contain"
                style={[imageStyle, { width: imageSize, height: imageSize }]}/>
            </TapGestureHandler>
        </AnimatedView>
    </PanGestureHandler>
  );
}
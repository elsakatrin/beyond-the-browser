import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef } from 'react';
import CircleButton from './components/CircleButton';
import IconButton from './components/IconButton';
import EmojiPicker from "./components/EmojiPicker";
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image'; // Dom to image imported to save screenshots on browser -> iOS and Android can both use react-native-view-shot library but browsers cant 


//The PlaceholderImage variable references the ./assets/images/background-image.png and is used as the source prop on the <Image> component.
const PlaceholderImage = require('./assets/images/background-image.png');

export default function App() {
   //For screenshots -> Save images with the stickers
  const imageRef = useRef();
  const onSaveImageAsync = async () => {
    if (Platform.OS !== 'web') {
      try {
         //The captureRef captures the screenshot
         //returns a promise that fulfils with the URI of the captured screnshot 
         const localUri = await captureRef(imageRef, {
           height: 440,
           quality: 1,
          });
      //Pass this URI as a parameter to MediaLibrary.saveToLibraryAsync() -> That will save the screeenshot to the device media library 
      //When image has been saved to library it alerts as saved
      await MediaLibrary.saveToLibraryAsync(localUri);
       if (localUri) {
        alert("Saved!");
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    //React Native provides a platform module that gives us access to information about what platform the user is on
    domtoimage
      .toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        })
      .then(dataUrl => {
        let link = document.createElement('a');
        link.download = 'sticker-smash.jpeg';
        link.href = dataUrl;
        link.click();
      })
      .catch(e => {
        console.log(e);
      });
  }};

 //When user presses the reset button - shows the image picker button again
  const onReset = () => {
    setShowAppOptions(false);
  };
//When user presses the + button to add emoji this will open the emoji picker
  const onAddSticker = () => {
    setIsModalVisible(true);
  };
//Updates the isModalVisible state variable
  const onModalClose = () => {
    setIsModalVisible(false);
  };


  //Need to ask permission to upload the photos from users for this app 
  //this MediaLibrary provides the useÐermission hook that gives the permission status and a requestPermission method to ask for acsess to the media library when permission is not granted 
  //When the app loads for the first time and permission status is neither granted or denied the value of status is null - when asked for permission the user can either grant or deny 
  const [status, requestPermission] = MediaLibrary.usePermissions();

  //States 
  const [pickedEmoji, setPickedEmoji] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  //To open up photo library and choose photos
  const pickImageAsync = async () => {
    //lunchImageLibraryAcync displays the system UI for choosing an image or a video from the photolibrary - It returns an object containing information about the selected image
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, //If set to true the user could crop the image during the selection process (for iOS and android not the web)
      quality: 1,
    });

//If status from usePermissions is returned as null, we trigger requestPersmission method
  if (status === null) {
    requestPermission();
  }

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true); //Sets value to true after user picks an image
    } else {
      alert('You did not select any image.');
    }
  };

  return (
    //After clicking choose picture button on homepage these buttons show up

    // Gesture is for moving emojis on the image
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}> 
        <View ref={imageRef} collapsable={false}> {/* collapsable prop is set to false because the <View> component is used to take a screenshot of the background image and emoji. the rest of contents will not be a part of the screenshot */}
          <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
          {pickedEmoji !== null ? ( //display the emoji on the sticker - checking if the emoji state is not null
            <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
          ) : null}
        </View>
      </View>
      {/* ShowAppOptions is used to show and hide buttons */}
      {showAppOptions ? (
      <>
        <View style={styles.optionsContainer}>
           <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      </>
      ) : (
        //These buttons show up on homepage when it opens up
      <View style={styles.footerContainer}>
        {/* pickImageAsync on the button revokes the ImagePicker  */}
        <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
        <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
      </View>
      )}
      {/* Modal for emojis when picking emojis for your image*/}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});


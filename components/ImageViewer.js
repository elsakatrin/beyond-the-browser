import { StyleSheet, Image } from 'react-native';

export default function ImageViewer({ placeholderImageSource, selectedImage }) {
    const imageSource = selectedImage !== null
      ? { uri: selectedImage }
      : placeholderImageSource;
  //The Image component uses a conditional operator to load the source of the image. The Image picked from the image picker is a uri string, not a local asset like the placeholder image 
    return <Image source={imageSource} style={styles.image} />;
  }

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
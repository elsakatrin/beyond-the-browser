import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";

// Buttons on the homepage 

export default function Button({ label, onPress, /* @info The prop theme to detect the button variant. */ theme/* @end */ }) {
    //The primary theme buttin uses inline styles, which overrides the styles defined in the stylesheet,create() with an object directly passed in the style prop. Inline styles use javasctip
  if (theme === "primary") {
    return (
      <View
      style={[styles.buttonContainer, { borderWidth: 4, borderColor: "#ffd33d", borderRadius: 18 }]} >
        {/* The background colour is set here for the background color. If we'd add this property in the styles below then the background color value would be set for both primary theme and unstyled */}
        {/* That's because The inline styles override the styles below */}
        <Pressable
          style={[styles.button, { backgroundColor: "#fff" }]}
          onPress={onPress} >
          <FontAwesome
            name="picture-o"
            size={18}
            color="#25292e"
            style={styles.buttonIcon}
          />
          <Text style={[styles.buttonLabel, { color: "#25292e" }]}>{label}</Text>
        </Pressable>
    </View>
    );
  }

  return (
    <View style={styles.buttonContainer}>
       <Pressable style={styles.button} onPress={onPress} >
          <Text style={styles.buttonLabel}>{label}</Text>
        </Pressable>
      </View>
  );
}


const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});

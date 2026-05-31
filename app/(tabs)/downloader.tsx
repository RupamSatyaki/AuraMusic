import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Colors } from '@/src/theme/colors';

export default function DownloaderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>YouTube Downloader</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          placeholder="Paste YouTube Link here..."
          placeholderTextColor={Colors.textMuted}
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Extract Audio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.text,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  }
});

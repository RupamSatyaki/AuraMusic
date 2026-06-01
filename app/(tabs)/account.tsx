import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/src/theme/colors';

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <Text style={styles.text}>Profile and Settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  text: {
    color: Colors.textMuted,
    marginTop: 10,
  }
});

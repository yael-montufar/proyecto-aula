import { getAuth, signOut } from 'firebase/auth';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
const auth = getAuth();

export default function QRScreen({navigation}) {

  return (
    <View style={styles.container}>
      <Text>QR Screen</Text>

      <Button onPress={() => signOut(auth)} style={styles.button}>
        Sign Out
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 10
  }
});
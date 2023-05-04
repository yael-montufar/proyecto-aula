import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuthentication } from '../hooks/useAuthentication';
import { Button } from 'react-native-paper';
import { getAuth, signOut } from 'firebase/auth'
import QRCode from 'react-native-qrcode-svg'
const auth = getAuth();

export default function HomeScreen({navigation}) {
  const { user } = useAuthentication();

  return (
    <View style={styles.container}>
      <Text>Welcome {user?.email}!</Text>
      <QRCode value={`${user?.uid}`}/>

      <Button onPress={() => signOut(auth)} style={styles.button}>
        Sign Out
      </Button>

      <Button onPress={() => {navigation.navigate('Profile');}} style={styles.button}>
        PROFILE
      </Button>

      <Button onPress={() => {
        console.log(user?.uid);
      }} style={styles.button}>
        LOG
      </Button>
    </View>
  );
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
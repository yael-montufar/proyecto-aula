import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuthentication } from '../hooks/useAuthentication';
import { Button } from 'react-native-paper';
import { getAuth, signOut } from 'firebase/auth'
const auth = getAuth();

export default function HomeScreen() {
  const { user } = useAuthentication();

  return (
    <View style={styles.container}>
      <Text>Welcome {user?.email}!</Text>

      <Button onPress={() => signOut(auth)} style={styles.button}>
        Sign Out
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
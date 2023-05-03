import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuthentication } from '../hooks/useAuthentication';
import { Button } from 'react-native-paper';
import { getAuth, signOut } from 'firebase/auth'
import { 
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
const auth = getAuth();
const db = getFirestore();

export default function HomeScreen() {
  const { user } = useAuthentication();

  // collection ref for creating doc
  const colRef = collection(db, 'alumnos');

  // doc ref for deleting doc
  const docRef = doc(db, 'alumnos', `${auth.currentUser.uid}`)

  return (
    <View style={styles.container}>
      <Text>Welcome {user?.email}!</Text>

      <Button disabled onPress={() => signOut(auth)} style={styles.button}>
        Sign Out
      </Button>

      <Button onPress={() => {
        deleteDoc(docRef);
      }} style={styles.button}>
        DELETE ACCOUNT
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
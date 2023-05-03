import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { getAuth } from 'firebase/auth'
import { 
  getFirestore,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
const auth = getAuth();
const db = getFirestore();

export default function ProfileScreen({navigation}) {
  const [value, setValue] = React.useState({
    nombre: '',
    edad: '',
    matricula: '',
  })
  const [userData, setUserData] = React.useState({})

  // doc ref for deleting doc
  const docRef = doc(db, 'alumnos', `${auth.currentUser.uid}`)

  function updateProfile() {
    updateDoc(docRef, {
      nombre: value.nombre,
      edad: value.edad,
      matricula: value.matricula,
    })
  }


  useEffect(() => {
    // getDoc(docRef).then(doc => {
    //   setUserData({...doc.data(), id: doc.id});
    // })

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setUserData({...snapshot.data(), id: snapshot.id});
    })
    return unsubscribe;
  }, [])

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>

      <View>
        <Text>edad: {userData.edad}</Text>
        <Text>email: {userData.email}</Text>
        <Text>matricula: {userData.matricula}</Text>
        <Text>id: {userData.id}</Text>
        <Text>nombre: {userData.nombre}</Text>
      </View>

      <View style={styles.controls}>
        <TextInput
          label={"Nombre"}
          placeholder='Nombre'
          value={value.nombre}
          onChangeText={(text) => setValue({ ...value, nombre: text })}
        />

        <TextInput
          label={"Edad"}
          placeholder='Edad'
          value={value.edad}
          onChangeText={(text) => setValue({ ...value, edad: text })}
        />

        <TextInput
          label={"Matricula"}
          placeholder='Matricula'
          value={value.matricula}
          onChangeText={(text) => setValue({ ...value, matricula: text })}
        />

        <Button mode='contained' onPress={() => updateProfile()}>
          UPDATE
        </Button>
      </View>
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
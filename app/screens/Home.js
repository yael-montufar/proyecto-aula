import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuthentication } from '../hooks/useAuthentication';
import { Button } from 'react-native-paper';
import { getAuth, signOut } from 'firebase/auth'
import { 
  getFirestore,
  doc,
  onSnapshot,
} from "firebase/firestore";
import QRCode from 'react-native-qrcode-svg'

const auth = getAuth();
const db = getFirestore();

export default function HomeScreen({navigation}) {
  const docRef = doc(db, 'usuarios', `${auth.currentUser.uid}`);

  const [userData, setUserData] = useState(undefined)
  const [day, setDay] = useState(undefined)

  const DIAS = [
    'domingo',
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado'
  ]

  useEffect(() => {
    const tmp = Date.now();
    const today = new Date(tmp);
    setDay(today.getDay());

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setUserData({...snapshot.data(), id: snapshot.id});
    })
    return unsubscribe;
  }, [])

  if (!userData) return;

  return (
    <View style={styles.container}>
      <Text>Bienvenido {userData?.nombre}</Text>
      {userData?.horario &&
      <>
      <Text style={styles.mayusculas}>{DIAS[day]}</Text>
      <View>
        <Text>Entrada: {userData?.horario[DIAS[day]]?.entrada ? userData?.horario[DIAS[day]]?.entrada : 'Hoy no hay clases'}</Text>
        <Text>Salida: {userData?.horario[DIAS[day]]?.salida ? userData?.horario[DIAS[day]]?.salida : 'Hoy no hay clases'}</Text>
      </View>
      </>
      }

      <QRCode value={`${auth.currentUser.uid}`}/>

      <Button onPress={() => signOut(auth)} style={styles.button}>
        Sign Out
      </Button>

      <Button onPress={() => {navigation.navigate('Profile');}} style={styles.button}>
        PERFIL
      </Button> 

      {/* <Button onPress={() => {
        console.log(day);
      }} style={styles.button}>
        LOG
      </Button> */}
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
    marginTop: 10,
  },
  mayusculas: {
    textTransform: 'capitalize',
  }
});
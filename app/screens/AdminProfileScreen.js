import React from 'react';
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

export default function AdminProfileScreen({route, navigation}) {
  const docRef = doc(db, 'usuarios', `${route.params.id}`);

  const [userData, setUserData] = React.useState(undefined)
  const [day, setDay] = React.useState(undefined)

  const DIAS = [
    'domingo',
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado'
  ]

  React.useEffect(() => {
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
      <Text>Alumno: {userData.nombre} {userData.apellido}</Text>
      <Text>Boleta: {userData.boleta}</Text>
      {userData?.grupos &&
      <>
        <Text>Grupos: {
        userData.grupos.map((grupo, index) => {
          if (index === userData.grupos.length - 1) {
            return <Text key={`${grupo}-${index}`}>{grupo}</Text>
          } else {
            return <Text key={`${grupo}-${index}`}>{grupo}, </Text>
          }
        })}
        </Text>
      </>
      }
      {userData?.situacion && <Text style={styles.mayusculas}>Situacion: {userData.situacion}</Text>}
      {userData?.horario &&
      <>
      <Text style={styles.mayusculas}>Horario {DIAS[day]}</Text>
      <View>
        <Text>Entrada: {userData.horario[DIAS[day]]?.entrada ? userData.horario[DIAS[day]]?.entrada : 'Hoy no hay clases'}</Text>
        <Text>Salida: {userData.horario[DIAS[day]]?.salida ? userData.horario[DIAS[day]]?.salida : 'Hoy no hay clases'}</Text>
      </View>
      </>
      }

      <QRCode value={`${route.params.id}`}/>
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
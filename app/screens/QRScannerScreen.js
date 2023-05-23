import { getAuth, signOut } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {doc, getDoc, getFirestore, updateDoc} from 'firebase/firestore'
const auth = getAuth();
const db = getFirestore();
const DIAS = [
  'domingo',
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado'
]

export default function QRScannerScreen({navigation}) {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanData, setScanData] = useState();
  const [studentId, setStudentId] = useState();

  const [scanMode, setScanMode] = useState('entrada');
  const [msg, setMsg] = useState('');
  const [msgColor, setMsgColor] = useState('');

  function entrada(docRef) {
    let now = new Date();
    let currentTime = `${now.getHours()}:${now.getMinutes()}`;
    
    getDoc(docRef).then(doc => {
      let ingreso = doc.data().ingreso;
      let entryTime = doc.data().horario[DIAS[now.getDay()]].entrada;

      let [currentHours, currentMinutes] = currentTime.split(':').map(Number);
      let [entryHours, entryMinutes] = entryTime.split(':').map(Number);

      let diffInMinutes = (entryHours * 60 + entryMinutes) - (currentHours * 60 + currentMinutes);

      console.log(diffInMinutes);

      if (ingreso === 'otorgado') {
        setMsg('Ingreso ya otorgado')
        setMsgColor('red');
      } else if (ingreso !== 'otorgado' && (diffInMinutes < 30 && diffInMinutes > -10)) {
        setMsg('Ingreso otorgado')
        setMsgColor('green')
        updateDoc(docRef, {
          ingreso: 'otorgado'
        })
      } else {
        setMsg('Ingreso no otorgado')
        setMsgColor('red')
      }
    });
  }

  function salida(docRef) {
    getDoc(docRef).then(doc => {
      let ingreso = doc.data().ingreso;

      if (ingreso === 'otorgado') {
        setMsg('Salida confirmada')
        setMsgColor('green')
        updateDoc(docRef, {
          ingreso: ''
        })
      } else if (ingreso !== 'otorgado') {
        setMsg('El alumno ya ha salido')
        setMsgColor('red')
      }
    });
  }

  function updateProfile(docRef) {
    if (scanMode === 'entrada') {
      entrada(docRef)
    } else if (scanMode === 'salida') {
      salida(docRef)
    }
  }

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setMsg('');
      setMsgColor('');
      setScanData(undefined);
    }, 1000)
  }, [msg])

  if (!hasPermission) {
    return (
      <View>
        <Text>Please grant permissions to app.</Text>
      </View>
    )
  }
  

  const handleBarCodeScanned = ({type, data}) => {
    setScanData(data);
    setStudentId(data);
    const docRef = doc(db, 'usuarios', `${data}`);
    updateProfile(docRef);
  }

  return (
    <View style={styles.container}>
      <Text>QR Screen</Text>

      <View style={styles.buttons}>
        <Button mode={scanMode === 'entrada' ? 'contained' : 'outlined'} onPress={() => setScanMode('entrada')}>
          Entrada
        </Button>

        <Button mode={scanMode === 'salida' ? 'contained' : 'outlined'} onPress={() => setScanMode('salida')}>
          Salida
        </Button>
      </View>

      <View style={styles.scannerBox}>
        <BarCodeScanner
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={scanData ? undefined : handleBarCodeScanned}
        />
      </View>

      <Text style={msgColor && {color: `${msgColor}`}}>{msg}</Text>

      {/*scanData && <Button onPress={() => {
        setScanData(undefined);
      }}>Scan Again?</Button>*/}

      <Button onPress={() => signOut(auth)} style={styles.button}>
        Sign Out
      </Button>
      {/* <Button onPress={() => console.log(scanMode)} style={styles.button}>
        Log
      </Button> */}
     {studentId &&
      <Button onPress={() => {navigation.navigate('Profile', {
        id: studentId
      })}} style={styles.button}>
        PERFIL
      </Button> }
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
  },
  scannerBox: {
    width: '50%',
    aspectRatio: 1,
  }
});
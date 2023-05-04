import { getAuth, signOut } from 'firebase/auth';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {doc, getFirestore, updateDoc} from 'firebase/firestore'
const auth = getAuth();
const db = getFirestore();

export default function QRScannerScreen({navigation}) {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [scanData, setScanData] = React.useState();
  
  

  function updateProfile(docRef) {
    updateDoc(docRef, {
      ingreso: 'otorgado'
    })
  }

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })()
  }, [])

  if (!hasPermission) {
    return (
      <View>
        <Text>Please grant permissions to app.</Text>
      </View>
    )
  }
  

  const handleBarCodeScanned = ({type, data}) => {
    setScanData(data);
    const docRef = doc(db, 'usuarios', `${data}`);
    updateProfile(docRef);
  }

  return (
    <View style={styles.container}>
      <Text>QR Screen</Text>

      <View style={styles.scannerBox}>
        <BarCodeScanner
        barCodeTypes={'org.iso.QRCode'}
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={scanData ? undefined : handleBarCodeScanned}
        />
      </View>

      {scanData && <Button onPress={() => {
        setScanData(undefined);
      }}>Scan Again?</Button>}

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
  },
  scannerBox: {
    width: '50%',
    aspectRatio: 1,
  }
});
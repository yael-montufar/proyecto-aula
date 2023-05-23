import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { 
  getFirestore,
  setDoc,
  getDoc,
  doc
} from "firebase/firestore";
const auth = getAuth();
const db = getFirestore();

const SignUpScreen = ({ navigation }) => {
  const [value, setValue] = React.useState({
    email: '',
    password: '',

    nombre: '',
    apellido: '',
    boleta: '',

    error: ''
  })

  const [boletaDisponible, setBoletaDisponible] = useState(false)

  async function signUp() {
    if (value.email === '' || value.password === '' || value.boleta === '') {
      setValue({
        ...value,
        error: 'Correo, contraseña y boleta son requiridas.'
      })
      return;
    } else if (value.boleta.length != 10) {
      setValue({
        ...value,
        error: 'La boleta debe consistir de 10 digitos.'
      })
      return;
    } 

    try {
      await createUserWithEmailAndPassword(auth, value.email, value.password).then(response => {
        setDoc(doc(db, 'usuarios', `${response.user.uid}`), {
          email: response.user.email,
          rol: 'alumno',

          nombre: value.nombre,
          apellido: value.apellido,
          boleta: value.boleta,
        })

        setDoc(doc(db, 'boletas', `${value.boleta}`), {
          uid: response.user.uid
        })
      });
      navigation.navigate('Sign In');
    } catch (error) {
      setValue({
        ...value,
        error: error.message,
      })
    }
  }

  return (
    <View style={styles.container}>
      <Text>Signup screen!</Text>

      {!!value.error && <View style={styles.error}><Text>{value.error}</Text></View>}

      <View style={styles.controls}>
        <TextInput
          label={"Nombre"}
          placeholder='nombre'
          value={value.nombre}
          onChangeText={(text) => setValue({ ...value, nombre: text })}
        />

        <TextInput
          label={"Apellido"}
          placeholder='apellido'
          value={value.apellido}
          onChangeText={(text) => setValue({ ...value, apellido: text })}
        />

        <TextInput
          label={"Boleta"}
          placeholder='boleta'
          keyboardType='numeric'
          value={value.boleta}
          onChangeText={(text) => {
            setValue({ ...value, boleta: text })

            const boleta = text;

            if (boleta.length === 10) {
              const docRef = doc(db, 'boletas', `${boleta}`);
              // const { exists } = await docRef.get();
              getDoc(docRef).then(doc => {
                console.log(doc.exists())
                setBoletaDisponible(doc.exists())
              })
            } 
          }}
        />

        <TextInput
          label={"Correo"}
          placeholder='correo'
          value={value.email}
          onChangeText={(text) => setValue({ ...value, email: text })}
        />

        <TextInput
          label={"Contraseña"}
          placeholder='contraseña'
          value={value.password}
          onChangeText={(text) => setValue({ ...value, password: text })}
          secureTextEntry={true}
        />

        <Button mode='contained' disabled={value.boleta.length === 10 && boletaDisponible} onPress={signUp}>
          Sign up
        </Button>

        {value.boleta.length === 10 &&
          <Text>{!boletaDisponible ? 'disponible': 'boleta ya existe en la base de datos'}</Text>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  controls: {
    flex: 1,
  },

  control: {
    marginTop: 10
  },

  error: {
    marginTop: 10,
    padding: 10,
    color: '#fff',
    backgroundColor: '#D54826FF',
  }
});

export default SignUpScreen;
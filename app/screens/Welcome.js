import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

export default function Welcome({navigation}) {
  return (
    <View style={styles.container}>
      <Text>Welcome!</Text>
      <View style={styles.buttons}>
        <Button mode='contained' onPress={() => navigation.navigate('Sign In')}>
          Sign in
        </Button>
        <Button mode="outlined" onPress={() => navigation.navigate('Sign Up')}>
          Sign up
        </Button>
      </View>
      <StatusBar style="auto" />
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
});

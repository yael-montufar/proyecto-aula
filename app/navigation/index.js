import React from 'react';
import { useAuthentication } from '../hooks/useAuthentication';
import {getDoc, doc, getFirestore} from 'firebase/firestore'
import UserStack from './userStack';
import AuthStack from './authStack';
import AdminStack from './adminStack';
const db = getFirestore();

export default function RootNavigation() {
  const { user } = useAuthentication();
  const [userRole, setUserRole] = React.useState('');

  if (user) {
    const docRef = doc(db, 'usuarios', `${user.uid}`)
    getDoc(docRef).then(doc => {
      setUserRole(doc.data().rol);
    });
  }

  if (user) {
    if (user && userRole == 'admin') return <AdminStack/>;
    if (user && userRole == 'alumno') return <UserStack />;
  } else {
    return <AuthStack />;
  }
}



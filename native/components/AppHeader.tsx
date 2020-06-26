import React from 'react';
import { Header } from 'react-native-elements';
import { useHistory } from 'react-router-native';

export default function AppHeader() {
  let history = useHistory();
  return (
    <Header
      backgroundColor={'#6F6CAF'}
      centerComponent={{ text: 'Rabble', style: { color: '#fff' } }}
      rightComponent={{
        icon: 'home', color: '#fff', onPress: () => {
          console.log('home clicked.');
          history.push("/");
        }
      }}
    />
  );
}


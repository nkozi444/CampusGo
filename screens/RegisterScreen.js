import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { app } from '../config/firebase';

const auth = getAuth(app);
const db = getFirestore(app);

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // default role = user

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Assign a role based on email or domain (you can customize this)
      let assignedRole = 'user';
      if (email === 'admin@example.com') assignedRole = 'admin';
      else if (email === 'superadmin@example.com') assignedRole = 'superadmin';

      // Store user info in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        role: assignedRole,
      });

      Alert.alert('Success', `Account created as ${assignedRole}!`);

      // Redirect based on role
      if (assignedRole === 'admin') {
        navigation.replace('AdminHome');
      } else if (assignedRole === 'superadmin') {
        navigation.replace('SuperAdminHome');
      } else {
        navigation.replace('UserHome');
      }

    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('loginpage')}>
        <Text style={styles.link}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    maxWidth: 400, 
    alignSelf: 'center', 
    width: '100%',
  },
  title: { fontSize: 28, textAlign: 'center', fontWeight: 'bold', marginBottom: 20, color: '#10B981' },
  input: { 
    borderWidth: 1, 
    borderColor: '#D1D5DB', 
    padding: 12, 
    marginVertical: 8, 
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: { 
    backgroundColor: '#10B981', 
    padding: 14, 
    borderRadius: 8, 
    marginTop: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 15, color: '#005FB8', fontSize: 14 },
});

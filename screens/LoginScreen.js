// app/loginpage.stx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { app } from '../config/firebase';

const auth = getAuth(app);
const db = getFirestore(app);

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

  try {
    // Firebase login
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user role from Firestore
    const docRef = doc(db, 'users', user.uid);

    // ADD THIS LINE:
    const docSnap = await getDoc(docRef); 

    // This line must be REMOVED (it's duplicated and was incorrect placement):
    // const role = docSnap.data().role || "user"; 

    if (docSnap.exists()) {
      const role = docSnap.data().role || "user"; // Now this line is correct

        // Save to AsyncStorage safely
        try {
          await AsyncStorage.setItem("userRole", role);
          await AsyncStorage.setItem("isLoggedIn", "true");
        } catch (storageError) {
          console.error("AsyncStorage Error:", storageError);
        }

        Alert.alert('Login Successful', `Welcome back, ${role}!`);

        // Route based on role
        if (role === 'superadmin') {
          router.replace('/superadminhome');
        } else if (role === 'admin') {
          router.replace('/adminhome');
        } else {
          router.replace('/user');
        }

      } else {
        Alert.alert('Error', 'User data not found in database!');
      }

    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CampusGo Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.link}>Don’t have an account? Sign up</Text>
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
  title: { 
    fontSize: 28, 
    textAlign: 'center', 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#005FB8' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#D1D5DB', 
    padding: 12, 
    marginVertical: 8, 
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: { 
    backgroundColor: '#005FB8', 
    padding: 14, 
    borderRadius: 8, 
    marginTop: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  link: { 
    textAlign: 'center', 
    marginTop: 15, 
    color: '#005FB8', 
    fontSize: 14 
  },
});

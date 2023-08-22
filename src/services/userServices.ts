import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import AES from 'crypto-js/aes';
import { AUTH } from '../constants/authConstant';
import CryptoJS from 'crypto-js';

const UserServices = {
  login: async (params: { email: string; password: string }) => {
    const { email, password } = params;
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Return the user data
      return {
        uid: user.uid,
        email: user.email,
      };
    } catch (error) {
      return error; // Rethrow the error for handling in the component
    }
  },

  registerUser: async (params: { email: string; password: string }) => {
    const { email, password } = params;
    const auth = getAuth();
    try {
      // Create a new user with the provided email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get the user data
      const user = userCredential.user;

      // Return the user data
      return {
        uid: user.uid,
        email: user.email,
      };
    } catch (error) {
      return error; // Rethrow the error for handling in the component
    }
  },

  signOut: () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        localStorage.removeItem(AUTH.CURRENT_USER);
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  },

  saveCurrentUser: (data: any, encryptionKey: string) => {
    var encryptedUserData = AES.encrypt(
      JSON.stringify(data),
      encryptionKey
    ).toString();
    localStorage.setItem(AUTH.CURRENT_USER, encryptedUserData);
  },

  getCurrentUser: (encryptionKey: string) => {
    let currentUser = localStorage.getItem(AUTH.CURRENT_USER);
    if (currentUser && encryptionKey) {
      var decrypted = AES.decrypt(currentUser, encryptionKey).toString(
        CryptoJS.enc.Utf8
      );
      return JSON.parse(decrypted);
    }
    return null;
  },
};

export default UserServices;

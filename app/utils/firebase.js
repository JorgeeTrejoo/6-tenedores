import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDwPVJEv5_YZ5diZ_7BW8IeiqW2Pa6MiIg",
    authDomain: "tenedores-f7fd0.firebaseapp.com",
    databaseURL: "https://tenedores-f7fd0.firebaseio.com",
    projectId: "tenedores-f7fd0",
    storageBucket: "tenedores-f7fd0.appspot.com",
    messagingSenderId: "887498798523",
    appId: "1:887498798523:web:1bbaa4a4366cef8582409e"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
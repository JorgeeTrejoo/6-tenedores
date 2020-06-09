import React from 'react';
import { Text, View } from 'react-native';
import { YellowBox } from "react-native";
//Importamos Firebase
import { firebaseApp } from "./app/utils/firebase";
import Navigation from "./app/navigations/Navigation";
import { decode, encode } from "base-64";

YellowBox.ignoreWarnings(["Setting a timer"]);

if(!global.btoa) global.btoa = encode;
if(!global.atob) global.atob = decode;

export default function App() {
  
  return (
    <Navigation />
  );
}
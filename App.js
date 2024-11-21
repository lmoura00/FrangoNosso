import React from "react";
import {ActivityIndicator, View} from 'react-native'
import { Routes } from "./src/Routes/Index";
import {StatusBar} from 'expo-status-bar'
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';


export default function App(){
  console.disableYellowBox = true;
  let [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });
  if (!fontsLoaded) {
    return <ActivityIndicator size={'large'} />;
  } else {
    return (
      <>
        <Routes/>
        <StatusBar style="inverted"/>
      </>
    )
  }
}
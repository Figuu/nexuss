import { StyleSheet, Text, View } from "react-native";
import { Slot, SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    const [fontsLoaded, error] = useFonts({
      "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
      "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
      "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
      "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
      "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
      "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
      "LeagueSpartan-Black": require("../assets/fonts/LeagueSpartan-Black.ttf"),
      "LeagueSpartan-Bold": require("../assets/fonts/LeagueSpartan-Bold.ttf"),
      "LeagueSpartan-ExtraBold": require("../assets/fonts/LeagueSpartan-ExtraBold.ttf"),
      "LeagueSpartan-ExtraLight": require("../assets/fonts/LeagueSpartan-ExtraLight.ttf"),
      "LeagueSpartan-Light": require("../assets/fonts/LeagueSpartan-Light.ttf"),
      "LeagueSpartan-Medium": require("../assets/fonts/LeagueSpartan-Medium.ttf"),
      "LeagueSpartan-Regular": require("../assets/fonts/LeagueSpartan-Regular.ttf"),
      "LeagueSpartan-SemiBold": require("../assets/fonts/LeagueSpartan-SemiBold.ttf"),
      "LeagueSpartan-Thin": require("../assets/fonts/LeagueSpartan-Thin.ttf"),
    });
  
    useEffect(() => {
      if (error) throw error;
  
      if (fontsLoaded) {
        SplashScreen.hideAsync();
      }
    }, [fontsLoaded, error]);
  
    if (!fontsLoaded) {
      return null;
    }
  
    if (!fontsLoaded && !error) {
      return null;
    }
    return (
      <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="event/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="event/categories/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="event/[id]/buyTickets" options={{ headerShown: false }}/>
          <Stack.Screen name="portal/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="portal/[id]/events" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    );
  };
  
  export default RootLayout;
  
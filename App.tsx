// import { StatusBar } from "expo-status-bar";
// import { Button, StyleSheet, Text, View } from "react-native";
// import { AuthProvider, useAuth } from "./app/context/AuthContext";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import Home from "./app/(tabs)/Home";
// import Login from "./app/(tabs)/Login";
// import { SafeAreaView } from "react-native-safe-area-context";

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <AuthProvider>
//       <SafeAreaView style={{ flex: 1 }}>
//         <Layout ></Layout>
//         <StatusBar style="inverted" />
//       </SafeAreaView>
//     </AuthProvider>
//   );
// }

// export const Layout = () => {
//   const { authState, onLogout } = useAuth();

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {authState?.authenticated ? (
//           <Stack.Screen
//             name="Home"
//             component={Home}
//             options={{
//               headerShown: false,
//             }}
//           ></Stack.Screen>
//         ) : (
//           <Stack.Screen
//             name="Login"
//             component={Login}
//             options={{
//               headerShown: false,
//             }}
//           ></Stack.Screen>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

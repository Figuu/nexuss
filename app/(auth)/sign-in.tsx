import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import { Link, router } from "expo-router";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { onLogin, onRegister } = useAuth();

  const handleLogin = async () => {
    if (username != "" && password != "") {
      try {
        const result = await onLogin(username, password);

        if (result?.error) {
          alert(result.message);
        }
        if (result?.data.token) {
          router.replace("/home");
        }
      } catch (error) {
        // console.error("Login error:", error);
        throw error;
      }
    }else{
      alert("Usuario o contraseña vacios")
    }
  };

  const handleRegister = async () => {
    try {
      const result = await onRegister(username, password);
      if (result?.error) {
        alert(result.message);
      } else {
        handleLogin();
      }
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  return (
    <View className="flex-1 bg-gray justify-center items-center p-4">
      <View className="w-full max-w-sm">
        <Text className="text-white text-4xl mb-8 text-center font-sbold">
          Login to Your Account
        </Text>

        <View className="mb-4">
          <View className="bg-gray-200 flex-row items-center p-3 rounded-lg mb-4">
            <FontAwesome
              name="envelope"
              size={20}
              color="#CECECE"
              className="mr-5"
            />
            <TextInput
              className="flex-1 text-white py-2 px-2"
              placeholder="Email"
              placeholderTextColor="#aaa"
              onChangeText={setUsername}
            />
          </View>

          <View className="bg-gray-200 flex-row items-center p-3 rounded-lg mb-6">
            <FontAwesome
              name="lock"
              size={23}
              color="#CECECE"
              className="mr-5"
            />
            <TextInput
              className="flex-1 text-white py-2 px-2"
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            className="bg-red rounded-lg py-3 px-4 mb-6"
          >
            <Text
              style={{ fontFamily: "LeagueSpartan_400Regular" }}
              className="text-white text-center text-lg font-medium"
            >
              Sign in
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text
              style={{ fontFamily: "LeagueSpartan_700Bold" }}
              className="text-red text-center mb-6"
            >
              Forgot the password?
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mb-6">
            <Text className="text-white text-center mb-4">
              or continue with
            </Text>
          </View>
          <View className="flex-row justify-center mb-6">
            <TouchableOpacity className="bg-gray-200 p-3 border border-[#545454] rounded-xl mx-2 aspect-[4/3] h-12 items-center">
              <FontAwesome name="facebook" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-200 p-3 border border-[#545454] rounded-xl mx-2 aspect-[4/3] h-12 items-center">
              <FontAwesome name="google" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View className="justify-center flex-row">
            <Text className="text-white text-center ">
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/sign-up")}
              
            >
              <Text className="text-red ml-1">Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignIn;

// import { View, Text, TouchableOpacity, TextInput } from "react-native";
// import React, { useEffect, useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { API_URL, useAuth } from "../context/AuthContext";
// import { FontAwesome } from "@expo/vector-icons";

// import {
//   useFonts,
//   LeagueSpartan_700Bold,
//   LeagueSpartan_400Regular,
// } from "@expo-google-fonts/league-spartan";
// import axios from "axios";

// const Login = () => {
//   const [fontsLoaded] = useFonts({
//     LeagueSpartan_700Bold,
//     LeagueSpartan_400Regular,
//   });

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const { onLogin, onRegister } = useAuth();

//   const login = async () => {

//     console.log(username, password);

//     const result = await onLogin!(username, password);
//     if (result && result.error) {
//       alert(result.error);
//     }
//   };

//   const register = async () => {
//     const result = await onRegister!(username, password);
//     if (result && result.error) {
//       alert(result.error);
//     } else {
//       login();
//     }
//   };

//   return (
//     <View className="flex-1 bg-[#242424] justify-center items-center p-4">
//       <View className="w-full max-w-sm">
//         <Text
//           style={{ fontFamily: "LeagueSpartan_700Bold" }}
//           className="text-white text-4xl mb-8 text-center"
//         >
//           Login to Your Account
//         </Text>

//         <View className="mb-4">
//           <View className="bg-[#3A3A3A] flex-row items-center p-3 rounded-lg mb-4">
//             <FontAwesome
//               name="envelope"
//               size={20}
//               color="#CECECE"
//               className="mr-5"
//             />
//             <TextInput
//               className="flex-1 text-white py-2 px-2"
//               placeholder="Email"
//               placeholderTextColor="#aaa"
//               onChangeText={(text: string) => setUsername(text)}
//             />
//           </View>

//           <View className="bg-[#3A3A3A] flex-row items-center p-3 rounded-lg mb-6">
//             <FontAwesome
//               name="lock"
//               size={23}
//               color="#CECECE"
//               className="mr-5"
//             />
//             <TextInput
//               className="flex-1 text-white py-2 px-2"
//               placeholder="Password"
//               placeholderTextColor="#aaa"
//               secureTextEntry
//               onChangeText={(text: string) => setPassword(text)}
//             />
//           </View>

//           <TouchableOpacity onPress={login} className="bg-[#1474D4] rounded-lg py-3 px-4 mb-6">
//             <Text
//               style={{ fontFamily: "LeagueSpartan_400Regular" }}
//               className="text-white text-center text-lg font-medium"
//             >
//               Sign in
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity>
//             <Text
//               style={{ fontFamily: "LeagueSpartan_700Bold" }}
//               className="text-[#1474D4] text-center mb-6"
//             >
//               Forgot the password?
//             </Text>
//           </TouchableOpacity>
//           <View className="flex-row justify-center mb-6">
//             <Text className="text-white text-center mb-4">
//               or continue with
//             </Text>
//           </View>
//           <View className="flex-row justify-center mb-6">
//             <TouchableOpacity className="bg-[#3A3A3A] p-3 border border-[#545454] rounded-xl mx-2 aspect-[4/3] h-12 items-center">
//               <FontAwesome name="facebook" size={24} color="white" />
//             </TouchableOpacity>
//             <TouchableOpacity className="bg-[#3A3A3A] p-3 border border-[#545454] rounded-xl mx-2 aspect-[4/3] h-12 items-center">
//               <FontAwesome name="google" size={24} color="white" />
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity onPress={register}>
//             <Text className="text-white text-center">
//               Don't have an account? Sign up
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default Login;

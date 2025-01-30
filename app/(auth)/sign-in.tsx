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

  return (
    <View className="flex-1 bg-background justify-center items-center p-4">
      <View className="w-full max-w-sm">
        <Text className="text-white text-4xl mb-8 text-center font-sbold">
          Login to Your Account
        </Text>

        <View className="mb-4">
          <View className="bg-background-card flex-row items-center p-3 rounded-xl mb-6">
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

          <View className="bg-background-card flex-row items-center p-3 rounded-xl mb-6">
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
            className="bg-primary rounded-xl py-3 px-4 mb-6"
          >
            <Text
              className="text-white text-center text-lg font-medium"
            >
              Sign in
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text
              className="text-primary text-center mb-6"
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
            <TouchableOpacity className="bg-background-card p-3 border border-[#545454] rounded-xl mx-2 aspect-[4/3] h-12 items-center">
              <FontAwesome name="facebook" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-background-card p-3 border border-[#545454] rounded-xl mx-2 aspect-[4/3] h-12 items-center">
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
              <Text className="text-primary ml-1">Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignIn;


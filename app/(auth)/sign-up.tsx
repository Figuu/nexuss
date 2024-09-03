import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { onRegister } = useAuth();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (username !== "" && password !== "") {
      try {
        const result = await onRegister(username, password);

        if (result?.error) {
          alert(result.message);
        } else {
          router.replace("/home");
        }
      } catch (error) {
        console.error("Register error:", error);
        throw error;
      }
    } else {
      alert("Usuario o contraseña vacíos");
    }
  };

  return (
    <View className="flex-1 bg-gray justify-center items-center p-4">
      <View className="w-full max-w-sm">
        <Text className="text-white text-4xl mb-8 text-center font-sbold">
          Create Your Account
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

          <View className="bg-gray-200 flex-row items-center p-3 rounded-lg mb-4">
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

          <View className="bg-gray-200 flex-row items-center p-3 rounded-lg mb-6">
            <FontAwesome
              name="lock"
              size={23}
              color="#CECECE"
              className="mr-5"
            />
            <TextInput
              className="flex-1 text-white py-2 px-2"
              placeholder="Confirm Password"
              placeholderTextColor="#aaa"
              secureTextEntry
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            className="bg-red rounded-lg py-3 px-4 mb-6"
          >
            <Text
              style={{ fontFamily: "LeagueSpartan_400Regular" }}
              className="text-white text-center text-lg font-medium"
            >
              Sign up
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
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.replace("/sign-in")}>
              <Text className="text-red ml-1">Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignUp;

import { router, useNavigation } from "expo-router";
import { Alert } from "react-native";
import { useAuth } from "../app/context/AuthContext";

const useAuthGuard = () => {
  const { authState } = useAuth(); 

  const checkAuth = () => {
    if (!authState.authenticated) {
      Alert.alert(
        "No estás autenticado",
        "¿Quieres iniciar sesión o volver atrás?",
        [
          {
            text: "Volver atrás",
            onPress: () => router.back(),
          },
          {
            text: "Iniciar sesión",
            onPress: () => router.push("sign-in"),
          },
        ]
      );
      return false;
    }
    return true;
  };

  return checkAuth;
};

export default useAuthGuard;

// const useAuthGuard = (restrictedRoute: string) => {
//   const { authState } = useAuth();

//   const checkAuthentication = () => {
//     console.log(authState);

    

//     if (!authState.authenticated) {
//       Alert.alert(
//         "No estás autenticado",
//         "¿Quieres iniciar sesión o volver atrás?",
//         [
//           {
//             text: "Volver atrás",
//             onPress: () => router.back(), // Vuelve a la pantalla anterior
//           },
//           {
//             text: "Iniciar sesión",
//             onPress: () => router.push("sign-in"), // Redirige a la pantalla de login
//           },
//         ]
//       );
//     } else {
//       // Si el usuario está autenticado, permite navegar
//       router.push(restrictedRoute);
//     }
//   };

//   return checkAuthentication;
// };
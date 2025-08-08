// import React from "react";
// import { View, Text, Image, TouchableOpacity } from "react-native";
// import Modal from "react-native-modal";
// import { images } from "../../constants";
// import QrPaymentView from "./qrPayment";

// interface PaymentModalProps {
//   visible: boolean;
//   onClose: () => void;
//   qrVisible: boolean;
//   setQrVisible: (visible: boolean) => void;
//   paymentData: any;
//   closePayment: () => void;
// }

// const PaymentOptionsModal: React.FC<PaymentModalProps> = ({
//   visible,
//   onClose,
//   qrVisible,
//   setQrVisible,
//   closePayment,
//   paymentData,
// }) => {
//   return (
//     <Modal
//       isVisible={visible}
//       onBackdropPress={onClose}
//       onSwipeComplete={onClose}
//       swipeDirection="down"
//       animationIn="slideInUp"
//       animationOut="slideOutDown"
//       animationInTiming={500}
//       animationOutTiming={500}
//       backdropTransitionOutTiming={500}
//       backdropTransitionInTiming={500}
//       style={{ justifyContent: "flex-end", margin: 0 }}
//     >
//       <View className="bg-background rounded-t-3xl p-4 h-[30vh] items-center">
//         <View className="bg-white my-2 h-1 w-[40vw] rounded-full self-center opacity-50" />
//         <Text className="text-white text-lg font-semibold">Pagar con</Text>
//         <View className="flex-row mt-4">
//           {/* Opción QR */}
//           <TouchableOpacity
//             onPress={() => setQrVisible(true)}
//             className="bg-background-card p-4 ml-2 rounded-lg"
//           >
//             <Image
//               source={images.qr}
//               className="w-10 h-10"
//               resizeMode="contain"
//             />
//           </TouchableOpacity>

//           {/* Opción Tarjeta */}
//           <TouchableOpacity
//             onPress={() => setQrVisible(true)}
//             className="bg-background-card p-4 ml-2 rounded-lg"
//           >
//             <Image
//               source={images.card}
//               className="w-10 h-10"
//               resizeMode="contain"
//             />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <QrPaymentView
//         visible={qrVisible}
//         onClose={onClose}
//         paymentData={paymentData}
//       />
//     </Modal>
//   );
// };

// export default PaymentOptionsModal;

// {
//   /* <TouchableOpacity
//             onPress={() }
//             className="bg-background-card p-4 mr-2 rounded-lg"
//           >
//             <Image
//               source={images.card}
//               className="w-10 h-10"
//               resizeMode="contain"
//             />
//           </TouchableOpacity> */
// }

import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { images } from "../../constants";
import QrPaymentView from "./qrPayment";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  qrVisible: boolean;
  setQrVisible: (visible: boolean) => void;
  paymentData: any;
  closePayment: () => void;
}

const PaymentOptionsModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  qrVisible,
  setQrVisible,
  paymentData,
  closePayment,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Animación para el fondo
  const [translateY] = useState(new Animated.Value(0)); // Animación para deslizar el modal

  // Manejar la animación de apertura y cierre
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 500, // Ajustado para asegurar que salga completamente
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onClose());
    }
  }, [visible]);

  // Manejar el gesto de deslizar hacia abajo
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === 5) { // State.END
      if (event.nativeEvent.translationY > 100) { // Umbral para cerrar
        Animated.timing(translateY, {
          toValue: 500, // Ajustado para asegurar que salga completamente
          duration: 200,
          useNativeDriver: true,
        }).start(() => onClose());
      } else {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Animated.View
        className="flex-1 bg-black/50" // Fondo cubre toda la pantalla
        style={{ opacity: fadeAnim }} // Controla la opacidad del fondo
      >
        {/* Fondo oscuro clickable para cerrar */}
        <TouchableOpacity
          className="absolute h-full w-full" // Cubre toda la pantalla
          activeOpacity={1}
          onPress={onClose} // Cierra el modal al tocar fuera
        />

        {/* Contenedor del bottom sheet con gesto */}
        <GestureHandlerRootView  className="flex-1 justify-end">
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View
              className="bg-background-card rounded-t-3xl py-2 h-[25%] w-full items-center" // Modal ocupa 50%
              style={{ transform: [{ translateY }] }} // Animación de deslizamiento
            >
              {/* Indicador de deslizamiento (clickable para cerrar) */}
              <TouchableOpacity onPress={onClose}>
                <View className="bg-white my-2 h-1 w-[40%] rounded-full self-center opacity-50" />
              </TouchableOpacity>

              {/* Título */}
              <Text className="text-white text-lg font-semibold">Pagar con</Text>

              {/* Opciones de pago */}
              <View className="flex-row mt-4">
                {/* Opción QR */}
                <TouchableOpacity
                  onPress={() => setQrVisible(true)}
                  className="bg-background p-4 ml-2 rounded-lg"
                >
                  <Image
                    source={images.qr}
                    className="w-10 h-10"
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                {/* Opción Tarjeta */}
                <TouchableOpacity
                  onPress={() => setQrVisible(true)} // Cambia esto si tienes lógica específica
                  className="bg-background p-4 ml-2 rounded-lg"
                >
                  <Image
                    source={images.card}
                    className="w-10 h-10"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </PanGestureHandler>
        </GestureHandlerRootView>
      </Animated.View>

      {/* Modal anidado para QR */}
      <QrPaymentView
        visible={qrVisible}
        onClose={() => {
          setQrVisible(false);
          onClose();
        }}
        paymentData={paymentData}
      />
    </Modal>
  );
};

export default PaymentOptionsModal;
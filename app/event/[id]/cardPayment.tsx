import React from "react";
import { Text, Touchable, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView, View } from "react-native";
import WebView from "react-native-webview";

interface PaymentViewProps {
  visible: boolean;
  onClose: () => void; // Callback para cerrar el modal
}

const CardPaymentView: React.FC<PaymentViewProps> = ({ visible, onClose }) => {
  
  return (
    <Modal
      isVisible={visible} 
      animationIn="slideInUp" 
      animationOut="slideOutDown" 
      swipeDirection="down" 
      onSwipeComplete={onClose} 
      onBackdropPress={onClose} 
      backdropOpacity={0}
      className="m-0 justify-end" 
    >
      <SafeAreaView className="flex-1 bg-white rounded-t-3xl overflow-hidden mt-10">
        <WebView
          className="flex-1 mb-20 mt-10"
          source={{
            uri: "https://yopago.com.bo/pay/payment/select?yp=R1JuUVEzWGwzbnNkWWJzTjFXTFZ3NWtiNFJBeFJiQkE5UkcwTTNlVWpjdUc1NStwM09ESGdxQ1pZZ0ZsNXJiWg==",
          }}
          style={{ flex: 1 }}
        />
        <TouchableOpacity
          onPress={onClose}
          className="absolute bottom-4 w-full bg-red-500 p-4 rounded-xl"
        >
          <Text className="text-white text-center text-lg font-bold">Atras</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

export default CardPaymentView;

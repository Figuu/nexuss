import React from "react";
import { ScrollView, Text, Touchable, TouchableOpacity } from "react-native";
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
      animationIn="slideInUp"
      animationOut="slideOutDown"
      swipeDirection={"down"}
      isVisible={visible}
      onSwipeComplete={onClose}
      onBackdropPress={onClose}
      className="m-0 justify-end"
    >
      <SafeAreaView className="flex-1 bg-white rounded-t-3xl overflow-hidden mt-10 justify-between">
        <View className="bg-background my-2 h-1 w-[40vw] rounded-full self-center" />
        <WebView
          className="flex-1 mb-20 mt-10 h-full"
          source={{
            uri: "https://yopago.com.bo/pay/payment/select?yp=R1JuUVEzWGwzbnNkWWJzTjFXTFZ3NWtiNFJBeFJiQkE5UkcwTTNlVWpjdUc1NStwM09ESGdxQ1pZZ0ZsNXJiWg==",
          }}
          style={{ flex: 1 }}
        />
        <TouchableOpacity
          onPress={onClose}
          className="absolute bottom-4 w-full bg-primary p-4 rounded-xl"
        >
          <Text className="text-white text-center text-lg font-bold">
            Atras
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

export default CardPaymentView;

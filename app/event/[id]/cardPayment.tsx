import React from "react";
import { ScrollView, Text, Touchable, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView, View } from "react-native";
import WebView from "react-native-webview";
import axios from "axios";

interface PaymentViewProps {
  visible: boolean;
  onClose: () => void; // Callback para cerrar el modal
}

const CardPaymentView: React.FC<PaymentViewProps> = ({ visible, onClose }) => {
  const generateCardPayment = async () => {
    try {
      const response = await axios.post("https://yopago.com.bo/pay/qr/generateUrl", {
        companyCode: "ATPG-P8V8-22TK-H43G", // Código de la empresa
        codeTransaction: "3aA", // Código de transacción
        urlSuccess: "https://exito.com.bo", // URL de éxito
        urlFailed: "https://falla.com.bo", // URL de fallo
        billName: fullName, // Nombre del comprador
        billNit: "123456789", // NIT (opcional)
        email: email, // Correo electrónico
        generateBill: "1", // Generar factura
        concept: `Pago para ${event.name}`, // Concepto del pago
        currency: "BOB", // Moneda
        amount: ticket.price * quantity, // Monto total
        messagePayment: "Gracias por tu compra!", // Mensaje de pago
        codeExternal: "", // Código externo (opcional)
      });
      setCardVisible(true); // Abre el modal de pago con tarjeta
    } catch (error) {
      setError("Error al generar el pago con tarjeta");
    }
  };


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

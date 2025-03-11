import React, { useEffect, useState } from "react";
import { Modal, ScrollView, Text, Touchable, TouchableOpacity } from "react-native";
import { SafeAreaView, View } from "react-native";
import WebView from "react-native-webview";
import axios from "axios";
import { API_URL, useAuth } from "../../app/context/AuthContext";

interface PaymentViewProps {
  visible: boolean;
  onClose: () => void;
  paymentData: {
    event: any;
    ticketTypeId: string;
    quantity: number;
    totalAmount: number;
    currency: string;
    fullName?: string;
    email?: string;
    numberedTicketId?: string | null;
  };
  onPaymentSuccess: (paymentId: string) => void;
}

interface PaymentUrlData {
  status: string;
  message?: string;
  dateCreated: string;
  expireTime: number;
  url: string;
  transactionId: string;
}

const CardPaymentView: React.FC<PaymentViewProps> = ({
  visible,
  onClose,
  paymentData,
  onPaymentSuccess,
}) => {
  const [paymentUrlData, setPaymentUrlData] = useState<PaymentUrlData | null>();
  const { authState } = useAuth();

  useEffect(() => {
    if (visible) {
      generatePaymentUrl();
    }
  }, [visible]);

  const generatePaymentUrl = async () => {
    const cleanName = paymentData.event.name.replace(/[^a-zA-Z0-9]/g, "");
    try {
      const response = await axios.post(
        "https://yopago.com.bo/pay/api/generateUrl",
        {
          companyCode: "XXNN-D4F4-4J03-27MA",
          codeTransaction: `${cleanName}-${new Date().getTime()}`,
          urlSuccess: "https://exito.com.bo",
          urlFailed: "https://falla.com.bo",
          billName: authState.user?.name,
          billNit: "123456789",
          email: authState.user?.username,
          generateBill: "1",
          concept: `Pago para evento ${paymentData.event.name}`,
          currency: paymentData.currency,
          amount: "0.1",
          messagePayment: "Gracias por tu compra!",
          codeExternal: "",
        }
      );

      // console.log(response.data);

      setPaymentUrlData(response.data);
    } catch (error) {
      console.error("Error generating payment URL:", error);
    }
  };

  const checkPaymentStatus = async () => {
    // console.log(paymentUrlData)
    try {
      const response = await axios.post(
        "https://yopago.com.bo/pay/api/verifyTransfer",
        {
          companyCode: "XXNN-D4F4-4J03-27MA",
          transactionId: `${paymentUrlData?.transactionId.toString()}`,
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Crear el invoice event
      const invoiceResponse = await axios.post(`${API_URL}/invoice-event`, {
        date: new Date().toISOString(),
        event_invoice_id: paymentData.event.id,
        tax_id: "string",
        tax_qr: "string",
        name: paymentData.fullName,
        document_type: "string",
        document_number: "string",
        document_complement: "string",
        phone: "string",
        email: paymentData.email,
        total: paymentData.totalAmount,
      });

      // Crear el ticket payment
      const ticketPaymentResponse = await axios.post(
        `${API_URL}/ticket-payment`,
        {
          execute_date: new Date().toISOString(),
          date: new Date().toISOString(),
          amount: paymentData.totalAmount,
          payment_method_id: "card",
          currency_id: paymentData.currency,
          external_code: "string",
          invoice_id: invoiceResponse.data.id,
          status_id: 1, // Asumiendo que 1 es "éxito"
          commission_amount: 0,
          total: paymentData.totalAmount,
        }
      );

      // Crear el ticket
      const ticketResponse = await axios.post(`${API_URL}/ticket`, {
        date: new Date().toISOString(),
        event_id: paymentData.event.id,
        ticket_type_id: paymentData.ticketTypeId,
        number: "string",
        code: "string",
        user_id: "string", // Aquí deberías obtener el ID del usuario autenticado
        seller_id: "string",
        payment_id: ticketPaymentResponse.data.id,
        pay_method: "card",
        coupon_id: "string",
        coupon_code: "string",
        status_id: 1, // Asumiendo que 1 es "éxito"
        price: paymentData.totalAmount,
        numbered_ticket_id: paymentData.numberedTicketId,
        is_payment: true,
        transaction_id: "string",
      });

      // Notificar éxito
      onPaymentSuccess(ticketPaymentResponse.data.id);
      onClose();
    } catch (error) {
      console.error("Error completing payment:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      presentationStyle="pageSheet"
      className="m-0 justify-end"
      onRequestClose={() => {
        onClose();
      }}
    >
      <SafeAreaView className="flex-1 bg-white rounded-t-3xl overflow-hidden mt-10 justify-between">
        <View className="bg-background my-2 h-1 w-[40vw] rounded-full self-center" />
        {paymentUrlData?.url ? (
          <WebView
            className="flex-1 mb-20 mt-10 h-full"
            source={{ uri: paymentUrlData.url }}
            style={{ flex: 1 }}
          />
        ) : (
          <Text className="text-center mt-10">Generando URL de pago...</Text>
        )}
        <View className="w-full bottom-0 px-2 space-y-2">
          <TouchableOpacity
            onPress={onClose}
            className="w-full bg-primary p-4 rounded-xl"
          >
            <Text className="text-white text-center text-lg font-bold">
              Atras
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={checkPaymentStatus}
            className="w-full bg-primary p-4 rounded-xl"
          >
            <Text className="text-white text-center text-lg font-bold">
              Verificar
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default CardPaymentView;

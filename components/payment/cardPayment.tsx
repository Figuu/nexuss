import React, { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView, View } from "react-native";
import WebView from "react-native-webview";
import axios from "axios";
import { API_URL, useAuth } from "../../app/context/AuthContext";
import PaymentSuccessScreen from "./PaymentSuccessScreen";

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
  const [paymentUrlData, setPaymentUrlData] = useState<PaymentUrlData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const { authState } = useAuth();

  useEffect(() => {
    if (visible) {
      generatePaymentUrl();
    }
  }, [visible]);

  const generatePaymentUrl = async () => {
    setIsLoading(true);
    const cleanName = paymentData.event.name.replace(/[^a-zA-Z0-9]/g, "");
    
    try {
      const response = await axios.post(
        "https://yopago.com.bo/pay/api/generateUrl",
        {
          companyCode: "XXNN-D4F4-4J03-27MA",
          codeTransaction: `${cleanName}-${new Date().getTime()}`,
          urlSuccess: "https://exito.com.bo",
          urlFailed: "https://falla.com.bo",
          billName: authState.user?.name || paymentData.fullName,
          billNit: "123456789",
          email: authState.user?.username || paymentData.email,
          generateBill: "1",
          concept: `Pago para evento ${paymentData.event.name}`,
          currency: paymentData.currency,
          amount: paymentData.totalAmount.toString(),
          messagePayment: "¡Gracias por tu compra!",
          codeExternal: "",
        }
      );

      setPaymentUrlData(response.data);
    } catch (error) {
      console.error("Error generating payment URL:", error);
      Alert.alert(
        "Error",
        "No se pudo generar la URL de pago. Por favor, intenta de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentUrlData) {
      Alert.alert("Error", "No hay datos de pago para verificar.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(
        "https://yopago.com.bo/pay/api/verifyTransfer",
        {
          companyCode: "XXNN-D4F4-4J03-27MA",
          transactionId: paymentUrlData.transactionId.toString(),
        }
      );

      console.log("Payment status:", response.data);
      
      // Check if payment was successful
      if (response.data.status === "success" || response.data.status === 2) {
        await handlePaymentSuccess();
      } else {
        Alert.alert(
          "Pago pendiente",
          "El pago aún no ha sido confirmado. Por favor, intenta de nuevo en unos momentos."
        );
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      Alert.alert(
        "Error",
        "No se pudo verificar el estado del pago. Por favor, intenta de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Create invoice event
      const invoiceResponse = await axios.post(`${API_URL}/invoice-event`, {
        date: new Date().toISOString(),
        event_invoice_id: paymentData.event.id,
        tax_id: "string",
        tax_qr: "string",
        name: paymentData.fullName || authState.user?.name,
        document_type: "string",
        document_number: "string",
        document_complement: "string",
        phone: "string",
        email: paymentData.email || authState.user?.username,
        total: paymentData.totalAmount,
      });

      // Create ticket payment
      const ticketPaymentResponse = await axios.post(
        `${API_URL}/ticket-payment`,
        {
          execute_date: new Date().toISOString(),
          date: new Date().toISOString(),
          amount: paymentData.totalAmount,
          payment_method_id: "8a5c28e5-50be-4352-8f23-0c31d1dc70d5", // Card payment method
          currency_id: "673cca72-426b-4979-8c85-7a000c40fda1",
          external_code: paymentUrlData?.transactionId || "card-payment",
          invoice_id: invoiceResponse.data.id,
          status_id: 2, // Success status
          commission_amount: 0,
          total: paymentData.totalAmount,
        }
      );

      // Create ticket
      const ticketResponse = await axios.post(`${API_URL}/ticket`, {
        date: new Date().toISOString(),
        event_id: paymentData.event.id,
        ticket_type_id: paymentData.ticketTypeId,
        number: paymentData.quantity,
        user_id: authState.user?.id,
        payment_id: ticketPaymentResponse.data.id,
        pay_method: "8a5c28e5-50be-4352-8f23-0c31d1dc70d5",
        status_id: 1,
        price: paymentData.totalAmount,
        numbered_ticket_id: paymentData.numberedTicketId,
        is_payment: true,
        transaction_id: paymentUrlData?.transactionId || "card-transaction",
      });

      // Show success screen
      setSuccessData({
        transactionId: paymentUrlData?.transactionId || "card-transaction",
        amount: paymentData.totalAmount,
        currency: paymentData.currency,
        eventName: paymentData.event.name,
        ticketCount: paymentData.quantity,
        paymentMethod: 'card',
        date: new Date().toISOString(),
      });
      setShowSuccess(true);
      
      // Notify parent component
      onPaymentSuccess(ticketPaymentResponse.data.id);
      
    } catch (error) {
      console.error("Error completing payment:", error);
      Alert.alert(
        "Error",
        "No se pudo completar el pago. Por favor, contacta soporte."
      );
    }
  };

  const handleClose = () => {
    setPaymentUrlData(null);
    setShowSuccess(false);
    setSuccessData(null);
    onClose();
  };

  if (showSuccess && successData) {
    return (
      <PaymentSuccessScreen
        visible={showSuccess}
        onClose={handleClose}
        paymentData={successData}
      />
    );
  }

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView className="flex-1 bg-white rounded-t-3xl overflow-hidden mt-10 justify-between">
        <View className="bg-background my-2 h-1 w-[40vw] rounded-full self-center" />
        
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-center text-lg">Generando URL de pago...</Text>
          </View>
        ) : paymentUrlData?.url ? (
          <WebView
            className="flex-1 mb-20 mt-10 h-full"
            source={{ uri: paymentUrlData.url }}
            style={{ flex: 1 }}
            onNavigationStateChange={(navState) => {
              // Check if user has completed payment by monitoring URL changes
              if (navState.url.includes('success') || navState.url.includes('exito')) {
                handlePaymentSuccess();
              }
            }}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-center text-lg">Error al generar la URL de pago</Text>
          </View>
        )}
        
        <View className="w-full bottom-0 px-4 pb-4 space-y-2">
          <TouchableOpacity
            onPress={checkPaymentStatus}
            disabled={isLoading || !paymentUrlData}
            className={`w-full p-4 rounded-xl ${
              isLoading || !paymentUrlData ? 'bg-gray-500' : 'bg-primary'
            }`}
          >
            <Text className="text-white text-center text-lg font-bold">
              {isLoading ? 'Verificando...' : 'Verificar pago'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleClose}
            className="w-full bg-background-card p-4 rounded-xl border border-white-200"
          >
            <Text className="text-white text-center text-lg font-bold">
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default CardPaymentView;

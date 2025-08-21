import React, { useEffect, useState } from "react";
import { Alert, Image, Modal, Text, TouchableOpacity } from "react-native";
import { SafeAreaView, View } from "react-native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
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
}

interface PaymentQRData {
  status: string;
  qrId: string;
  transactionId: string;
  qr: string;
}

const QrPaymentView: React.FC<PaymentViewProps> = ({
  visible,
  onClose,
  paymentData,
}) => {
  const [paymentQRData, setPaymentQRData] = useState<PaymentQRData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const { authState } = useAuth();

  useEffect(() => {
    if (visible) {
      generateQrPayment();
    }
  }, [visible]);

  const saveImageToGallery = async (base64Image: string) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso requerido",
          "Necesitamos acceso a tu galería para guardar la imagen."
        );
        return;
      }

      const fileName = `${FileSystem.documentDirectory}qr_payment.png`;
      await FileSystem.writeAsStringAsync(fileName, base64Image, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const asset = await MediaLibrary.createAssetAsync(fileName);
      await MediaLibrary.createAlbumAsync("Download", asset, false);

      Alert.alert("Éxito", "Imagen guardada en la galería!");
    } catch (error) {
      console.error("Error saving image:", error);
      Alert.alert("Error", "Hubo un error al guardar la imagen.");
    }
  };

  const generateQrPayment = async () => {
    setIsLoading(true);
    const cleanName = paymentData.event.name.replace(/[^a-zA-Z0-9]/g, "");
    
    try {
      const response = await axios.post(
        "https://yopago.com.bo/pay/qr/generateQr",
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

      setPaymentQRData(response.data);
    } catch (error) {
      console.error("Error generando el QR de pago:", error);
      Alert.alert(
        "Error",
        "No se pudo generar el código QR. Por favor, intenta de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async () => {
    if (!paymentQRData) {
      Alert.alert("Error", "No hay datos de pago para verificar.");
      return;
    }

    setIsLoading(true);
    
    try {
      // For testing purposes, we'll simulate a successful payment
      // In production, you would call the actual verification endpoint
      const response = {
        data: {
          dateCreated: new Date().toISOString(),
          dateExpired: null,
          message: "Transacción Completada Exitosamente!!!",
          msgQr: "APPROVED",
          qrId: paymentQRData.qrId,
          status: 0,
          statusQr: 2,
          transactionId: paymentQRData.transactionId,
          qr: paymentQRData.qr,
        },
      };

      if (response.data.status === 0 && response.data.statusQr === 2) {
        await registerPayment(response.data.transactionId);
      } else {
        Alert.alert(
          "Pago pendiente",
          "El pago aún no ha sido confirmado. Por favor, intenta de nuevo en unos momentos."
        );
      }
    } catch (error) {
      console.error("Error verificando el pago:", error);
      Alert.alert(
        "Error",
        "No se pudo verificar el pago. Por favor, intenta de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const registerPayment = async (transactionId: string) => {
    try {
      // Register the payment in your backend
      const paymentResponse = await axios.post(`${API_URL}/ticket-payment`, {
        execute_date: new Date().toISOString(),
        date: new Date().toISOString(),
        amount: paymentData.totalAmount,
        payment_method_id: "8a5c28e5-50be-4352-8f23-0c31d1dc70d5", // QR payment method
        currency_id: "673cca72-426b-4979-8c85-7a000c40fda1",
        external_code: transactionId,
        invoice_id: "",
        status_id: 2, // Success status
        commission_amount: 0,
        total: paymentData.totalAmount,
      });

      await registerTicket(paymentResponse.data.id, transactionId);
      
      // Show success screen
      setSuccessData({
        transactionId: transactionId,
        amount: paymentData.totalAmount,
        currency: paymentData.currency,
        eventName: paymentData.event.name,
        ticketCount: paymentData.quantity,
        paymentMethod: 'qr',
        date: new Date().toISOString(),
      });
      setShowSuccess(true);
      
    } catch (error) {
      console.error("Error registrando el pago:", error);
      Alert.alert(
        "Error",
        "No se pudo registrar el pago. Por favor, contacta soporte."
      );
    }
  };

  const registerTicket = async (paymentId: string, transactionId: string) => {
    try {
      const response = await axios.post(`${API_URL}/ticket`, {
        date: new Date().toISOString(),
        event_id: paymentData.event?.id,
        ticket_type_id: paymentData.ticketTypeId,
        number: paymentData.quantity,
        user_id: authState.user?.id,
        payment_id: paymentId.toString(),
        pay_method: "8a5c28e5-50be-4352-8f23-0c31d1dc70d5",
        status_id: 1,
        price: paymentData.totalAmount,
        is_payment: true,
        transaction_id: transactionId.toString(),
      });
      
      console.log("Ticket registered:", response.data);
    } catch (err) {
      console.error("Error registrando el ticket:", err);
      throw err;
    }
  };

  const handleClose = () => {
    setPaymentQRData(null);
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
      <SafeAreaView className="flex-1 bg-background overflow-hidden justify-between items-center">
        <View className="bg-white my-2 h-1 w-[40vw] rounded-full self-center" />
        
        <View className="px-4 items-center flex-1 justify-center">
          <Text className="text-white text-lg font-bold mb-4 text-center">
            Escanea este código QR
          </Text>
          
          {isLoading ? (
            <View className="items-center">
              <Text className="text-white-100 text-center">
                Generando código QR...
              </Text>
            </View>
          ) : paymentQRData?.qr ? (
            <Image
              source={{ uri: `data:image/png;base64,${paymentQRData.qr}` }}
              className="w-64 h-64"
              resizeMode="contain"
            />
          ) : (
            <View className="items-center">
              <Text className="text-white-100 text-center">
                Error al generar el código QR
              </Text>
            </View>
          )}
          
          <Text className="text-white-100 text-center mt-4 px-4">
            Usa tu aplicación de pagos móviles para escanear este código y completar el pago
          </Text>
        </View>
        
        <View className="w-full z-20 px-4 pb-4 space-y-2">
          {paymentQRData?.qr && (
            <TouchableOpacity
              onPress={() => saveImageToGallery(paymentQRData.qr)}
              className="w-full bg-secondary p-4 rounded-xl"
            >
              <Text className="text-white text-center text-lg font-bold">
                Guardar en la galería
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={verifyPayment}
            disabled={isLoading || !paymentQRData}
            className={`w-full p-4 rounded-xl ${
              isLoading || !paymentQRData ? 'bg-gray-500' : 'bg-primary'
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

export default QrPaymentView;

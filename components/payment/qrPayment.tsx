import React, { useEffect, useState } from "react";
import { Alert, Image, Modal, Text, Touchable, TouchableOpacity } from "react-native";
import { SafeAreaView, View } from "react-native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
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
  // onPaymentSuccess: (ticketPaymentId: string) => void;
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
  // onPaymentSuccess,
}) => {
  // console.log(paymentData);
  const [paymentQRData, setPaymentQRData] = useState<PaymentQRData | null>();
  const { authState } = useAuth();

  useEffect(() => {
    if (visible) {
      generateQrPayment();
    }
  }, [visible]);

  const saveImageToGallery = async (base64Image: string) => {
    try {
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need access to your media library to save the image."
        );
        return;
      }

      // Define the file path and name
      const fileName = `${FileSystem.documentDirectory}image.png`;

      // Save the base64 image to a file
      await FileSystem.writeAsStringAsync(fileName, base64Image, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Save the file to the gallery
      const asset = await MediaLibrary.createAssetAsync(fileName);
      await MediaLibrary.createAlbumAsync("Download", asset, false);

      Alert.alert("Success", "Imagen guardada!");
    } catch (error) {
      console.error("Error");
      Alert.alert("Error", "Hubo un error al guardar la imagen.");
    }
  };

  const generateQrPayment = async () => {
    const cleanName = paymentData.event.name.replace(/[^a-zA-Z0-9]/g, "");
    try {
      const response = await axios.post(
        "https://yopago.com.bo/pay/qr/generateQr",
        {
          companyCode: "XXNN-D4F4-4J03-27MA", // Código de la empresa
          codeTransaction: `${cleanName}-${new Date().getTime()}`,
          urlSuccess: "https://exito.com.bo",
          urlFailed: "https://falla.com.bo",
          billName: authState.user?.name,
          billNit: "123456789",
          email: authState.user?.username,
          generateBill: "1",
          concept: `Pago para evento ${paymentData.event.name}`,
          currency: paymentData.currency,
          amount: "0.01",
          messagePayment: "Gracias por tu compra!",
          codeExternal: "",
        }
      );

      setPaymentQRData(response.data);
    } catch (error) {
      console.error("Error generando el QR de pago:", error);
    }
  };

  const verifyPayment = async () => {
    try {
      // const response = await axios.post(
      //   "https://yopago.com.bo/pay/qr/verifyQr",
      //   {
      //     companyCode: "ATPG-P8V8-22TK-H43G",
      //     transactionId: paymentQRData?.transactionId,
      //     qrId: paymentQRData?.qrId,
      //   }
      // );

      const response = {
        data: {
          dateCreated: "2025-02-06 19:57:22",
          dateExpired: null,
          message: "Transacción Completada Exitosamente!!!",
          msgQr: "APPROVED",
          qrId: "26083699",
          status: 0,
          statusQr: 2,
          transactionId: "492503",
          qr: "qr",
        },
      };
      // console.log(response.data);

      // if (response.data.status === 0 && response.data.statusQr === 2) {
      //   onPaymentSuccess(response.data.transactionId);
      // } else {
      //   Alert.alert("Error", "Hubo un error al verificar el pago.");
      // }

      registerPayment("492503");
    } catch (error) {
      console.error("Error generando el QR de pago:", error);
    }
  };

  const registerPayment = async (transactionId: string) => {
    try {
      // const response = await axios.post(`${API_URL}/ticket-payment`, {
      //   execute_date: "2025-02-13T03:58:20.042Z",
      //   date: "2025-02-13T03:58:20.042Z",
      //   amount: paymentData.totalAmount,
      //   payment_method_id: "8a5c28e5-50be-4352-8f23-0c31d1dc70d5",
      //   currency_id: "673cca72-426b-4979-8c85-7a000c40fda1",
      //   external_code: transactionId,
      //   invoice_id: "",
      //   status_id: 2,
      //   commission_amount: 0,
      //   total: paymentData.totalAmount,
      // });

      const response = {
        data: {
          id: "556521d8-e5cb-47b0-bb3f-5fb4c3859f46",
        },
      };

      // console.log(response.data);

      registerTicket(response.data.id, transactionId);
      // onPaymentSuccess(response.data.id);
    } catch (error) {
      console.error("Error registrando el pago:", error);
    }
  };

  const registerTicket = async (paymentId: string, transactionId: string) => {
    console.log("registrando ticket", paymentId, transactionId);
    try {
      const response = await axios.post(`${API_URL}/ticket`, {
        date: "2025-02-13T14:25:18.817Z",
        event_id: paymentData.event?.id,
        ticket_type_id: paymentData.ticketTypeId,
        number: paymentData.quantity,
        user_id: authState.user?.id,
        payment_id: paymentId.toString(),
        pay_method: "8a5c28e5-50be-4352-8f23-0c31d1dc70d5",
        status_id: 1,
        price: 0,
        is_payment: true,
        transaction_id: transactionId.toString(),
      });
      console.log(response.data);
    } catch (err) {
      console.error("Error registrando el ticket:", err);
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
      <SafeAreaView className="flex-1 bg-background overflow-hidden justify-between items-center">
        <View className="bg-white my-2 h-1 w-[40vw] rounded-full self-center" />
        <View className="px-4 items-center">
          <Text className="text-white text-lg font-bold mb-4 text-center">
            Escanea este código QR
          </Text>
          <Image
            source={{ uri: `data:image/png;base64,${paymentQRData?.qr}` }}
            className="w-full aspect-square"
            resizeMode="contain"
          />
        </View>
        <View className="w-full z-20 px-2">
          <TouchableOpacity
            onPress={() => saveImageToGallery(paymentQRData?.qr || "")}
            className="w-max bg-secondary p-4 rounded-xl"
          >
            <Text className="text-white text-center text-lg font-bold">
              Guardar en la galería
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            className="w-max bg-primary p-4 rounded-xl mt-2"
          >
            <Text className="text-white text-center text-lg font-bold">
              Atras
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={verifyPayment}
            className="w-max bg-primary p-4 rounded-xl mt-2"
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

export default QrPaymentView;

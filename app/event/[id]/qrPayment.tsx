import React from "react";
import { Alert, Image, Text, Touchable, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView, View } from "react-native";
import WebView from "react-native-webview";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import axios from "axios";

interface QrPaymentViewProps {
  visible: boolean;
  onClose: () => void; // Callback para cerrar el modal
}

const QrPaymentView: React.FC<QrPaymentViewProps> = ({ visible, onClose }) => {
  const base64Image = "";

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
    try {
      const response = await axios.post("https://yopago.com.bo/pay/api/generateUrl", {
        companyCode: "XXNN-D4F4-4J03-27MA", // Código de la empresa
        codeTransaction: "5172", // Código de transacción
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
      setQrVisible(true); // Abre el modal de pago con QR
    } catch (error) {
      setError("Error al generar el pago con QR");
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
      <SafeAreaView className="flex-1 bg-background rounded-t-3xl overflow-hidden mt-10 justify-between items-center">
        <View className="bg-background my-2 h-1 w-[40vw] rounded-full " />
        <View className="px-4 items-center">
          <Text className="text-white text-lg font-bold mb-4 text-center">
            Escanea este código QR
          </Text>
          <Image
            source={{ uri: `data:image/png;base64,${base64Image}` }}
            className="w-full aspect-square"
            resizeMode="contain"
          />
        </View>
        <View className="h-[20vh] w-max z-20 px-2">
          <TouchableOpacity
            onPress={() => saveImageToGallery(base64Image)}
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
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default QrPaymentView;

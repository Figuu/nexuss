import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { images } from "../../constants";
import QrPaymentView from "./qrPayment";

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
  closePayment,
  paymentData,
}) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={500}
      animationOutTiming={500}
      backdropTransitionOutTiming={500}
      backdropTransitionInTiming={500}
      style={{ justifyContent: "flex-end", margin: 0 }}
    >
      <View className="bg-background rounded-t-3xl p-4 h-[30vh] items-center">
        <View className="bg-white my-2 h-1 w-[40vw] rounded-full self-center opacity-50" />
        <Text className="text-white text-lg font-semibold">Pagar con</Text>
        <View className="flex-row mt-4">
          {/* Opción QR */}
          <TouchableOpacity
            onPress={() => setQrVisible(true)}
            className="bg-background-card p-4 ml-2 rounded-lg"
          >
            <Image
              source={images.qr}
              className="w-10 h-10"
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Opción Tarjeta */}
          <TouchableOpacity
            onPress={() => setQrVisible(true)}
            className="bg-background-card p-4 ml-2 rounded-lg"
          >
            <Image
              source={images.card}
              className="w-10 h-10"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <QrPaymentView
        visible={qrVisible}
        onClose={onClose}
        paymentData={paymentData}
      />
    </Modal>
  );
};

export default PaymentOptionsModal;

{
  /* <TouchableOpacity
            onPress={() }
            className="bg-background-card p-4 mr-2 rounded-lg"
          >
            <Image
              source={images.card}
              className="w-10 h-10"
              resizeMode="contain"
            />
          </TouchableOpacity> */
}

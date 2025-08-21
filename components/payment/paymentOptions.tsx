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
import CardPaymentView from "./cardPayment";
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
  onPaymentMethodSelect?: (method: 'qr' | 'card') => void;
}

const PaymentOptionsModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  qrVisible,
  setQrVisible,
  paymentData,
  closePayment,
  onPaymentMethodSelect,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(0));
  const [cardVisible, setCardVisible] = useState(false);

  // Handle opening and closing animations
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
          toValue: 500,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onClose());
    }
  }, [visible]);

  // Handle swipe down gesture
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === 5) {
      if (event.nativeEvent.translationY > 100) {
        Animated.timing(translateY, {
          toValue: 500,
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

  const handlePaymentMethodSelect = (method: 'qr' | 'card') => {
    if (onPaymentMethodSelect) {
      // Use the new callback if provided
      onPaymentMethodSelect(method);
    } else {
      // Fallback to the old behavior
      if (method === 'qr') {
        setQrVisible(true);
      } else {
        setCardVisible(true);
      }
    }
  };

  const handlePaymentSuccess = (paymentId: string) => {
    console.log("Payment successful:", paymentId);
    closePayment();
    onClose();
  };

  const handleClose = () => {
    setCardVisible(false);
    setQrVisible(false);
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Animated.View
        className="flex-1 bg-black/50"
        style={{ opacity: fadeAnim }}
      >
        <TouchableOpacity
          className="absolute h-full w-full"
          activeOpacity={1}
          onPress={onClose}
        />

        <GestureHandlerRootView className="flex-1 justify-end">
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View
              className="bg-background-card rounded-t-3xl py-2 h-[25%] w-full items-center"
              style={{ transform: [{ translateY }] }}
            >
              <TouchableOpacity onPress={onClose}>
                <View className="bg-white my-2 h-1 w-[40%] rounded-full self-center opacity-50" />
              </TouchableOpacity>

              <Text className="text-white text-lg font-semibold">Pagar con</Text>

              <View className="flex-row mt-4">
                {/* QR Payment Option */}
                <TouchableOpacity
                  onPress={() => handlePaymentMethodSelect('qr')}
                  className="bg-background p-4 ml-2 rounded-lg"
                >
                  <Image
                    source={images.qr}
                    className="w-10 h-10"
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                {/* Card Payment Option */}
                <TouchableOpacity
                  onPress={() => handlePaymentMethodSelect('card')}
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

      {/* QR Payment Modal */}
      <QrPaymentView
        visible={qrVisible}
        onClose={() => {
          setQrVisible(false);
          onClose();
        }}
        paymentData={paymentData}
      />

      {/* Card Payment Modal */}
      <CardPaymentView
        visible={cardVisible}
        onClose={() => {
          setCardVisible(false);
          onClose();
        }}
        paymentData={paymentData}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </Modal>
  );
};

export default PaymentOptionsModal;
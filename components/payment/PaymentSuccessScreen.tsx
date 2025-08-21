import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../app/context/CartContext';

interface PaymentSuccessScreenProps {
  visible: boolean;
  onClose: () => void;
  paymentData: {
    transactionId: string;
    amount: number;
    currency: string;
    eventName: string;
    ticketCount: number;
    paymentMethod: string;
    date: string;
  };
}

const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({
  visible,
  onClose,
  paymentData,
}) => {
  const router = useRouter();
  const { clearCart } = useCart();

  const handleViewTickets = () => {
    clearCart();
    onClose();
    router.push('/(tabs)/tickets');
  };

  const handleContinueShopping = () => {
    clearCart();
    onClose();
    router.push('/(tabs)/');
  };

  const handleShareReceipt = () => {
    // Implement sharing functionality
    Alert.alert(
      'Compartir recibo',
      'Funcionalidad de compartir en desarrollo',
      [{ text: 'OK' }]
    );
  };

  if (!visible) return null;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4">
        {/* Success Header */}
        <View className="items-center py-8">
          <View className="bg-green-500 w-20 h-20 rounded-full items-center justify-center mb-4">
            <FontAwesome6 name="check" size={32} color="white" />
          </View>
          <Text className="text-white text-2xl font-bold text-center">
            ¡Pago Exitoso!
          </Text>
          <Text className="text-white-100 text-center mt-2">
            Tu compra ha sido procesada correctamente
          </Text>
        </View>

        {/* Payment Details */}
        <View className="bg-background-card rounded-xl p-6 mb-6">
          <Text className="text-white text-lg font-bold mb-4">
            Detalles del pago
          </Text>
          
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-white-100">Evento:</Text>
              <Text className="text-white font-semibold">
                {paymentData.eventName}
              </Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-white-100">Cantidad de tickets:</Text>
              <Text className="text-white font-semibold">
                {paymentData.ticketCount}
              </Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-white-100">Método de pago:</Text>
              <Text className="text-white font-semibold">
                {paymentData.paymentMethod === 'qr' ? 'Pago QR' : 'Tarjeta'}
              </Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-white-100">Fecha:</Text>
              <Text className="text-white font-semibold">
                {new Date(paymentData.date).toLocaleDateString('es-ES')}
              </Text>
            </View>
            
            <View className="border-t border-white-200 pt-3 mt-3">
              <View className="flex-row justify-between">
                <Text className="text-white font-bold text-lg">Total:</Text>
                <Text className="text-white font-bold text-lg">
                  {paymentData.amount.toFixed(2)} {paymentData.currency}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Transaction ID */}
        <View className="bg-background-card rounded-xl p-4 mb-6">
          <Text className="text-white-100 text-sm mb-2">ID de Transacción:</Text>
          <Text className="text-white font-mono text-sm">
            {paymentData.transactionId}
          </Text>
        </View>

        {/* Next Steps */}
        <View className="bg-background-card rounded-xl p-6 mb-6">
          <Text className="text-white text-lg font-bold mb-4">
            Próximos pasos
          </Text>
          
          <View className="space-y-4">
            <View className="flex-row items-start space-x-3">
              <View className="bg-primary w-6 h-6 rounded-full items-center justify-center mt-1">
                <Text className="text-white text-xs font-bold">1</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold">
                  Recibirás un email de confirmación
                </Text>
                <Text className="text-white-100 text-sm">
                  Con los detalles de tu compra y los tickets
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-start space-x-3">
              <View className="bg-primary w-6 h-6 rounded-full items-center justify-center mt-1">
                <Text className="text-white text-xs font-bold">2</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold">
                  Los tickets estarán disponibles en tu perfil
                </Text>
                <Text className="text-white-100 text-sm">
                  Puedes acceder a ellos desde la sección "Mis Tickets"
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-start space-x-3">
              <View className="bg-primary w-6 h-6 rounded-full items-center justify-center mt-1">
                <Text className="text-white text-xs font-bold">3</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold">
                  Lleva tu ticket al evento
                </Text>
                <Text className="text-white-100 text-sm">
                  Puedes mostrarlo desde tu teléfono o imprimirlo
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3 mb-6">
          <TouchableOpacity
            onPress={handleViewTickets}
            className="bg-primary p-4 rounded-xl"
          >
            <Text className="text-white text-center text-lg font-bold">
              Ver mis tickets
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleShareReceipt}
            className="bg-background-card p-4 rounded-xl border border-white-200"
          >
            <Text className="text-white text-center text-lg font-bold">
              Compartir recibo
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleContinueShopping}
            className="bg-background-card p-4 rounded-xl border border-white-200"
          >
            <Text className="text-white text-center text-lg font-bold">
              Continuar comprando
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentSuccessScreen;




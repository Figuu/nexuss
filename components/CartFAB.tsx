import React from 'react';
import { TouchableOpacity, Text, View, Animated } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useCart } from '../app/context/CartContext';
import { router } from 'expo-router';

interface CartFABProps {
  visible?: boolean;
  style?: any;
}

const CartFAB: React.FC<CartFABProps> = ({ visible = true, style }) => {
  const { cartItemCount, isCartEmpty } = useCart();

  const handlePress = () => {
    if (!isCartEmpty()) {
      router.push('/(tabs)/cart');
    }
  };

  if (!visible || isCartEmpty()) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        {
          position: 'absolute',
          bottom: 80,
          right: 20,
          backgroundColor: '#3b82f6',
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        style,
      ]}
    >
      <FontAwesome6 name="shopping-cart" size={24} color="white" />
      {cartItemCount() > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -5,
            right: -5,
            backgroundColor: '#ef4444',
            borderRadius: 12,
            minWidth: 24,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: 'white',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 12,
              fontWeight: 'bold',
            }}
          >
            {cartItemCount() > 99 ? '99+' : cartItemCount()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CartFAB;

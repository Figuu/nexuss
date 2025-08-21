import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useCart } from '../app/context/CartContext';

interface NumberedTicket {
  id: string;
  prefix: string;
  number: number;
  status: number;
}

interface CartItemProps {
  item: {
    ticketId: string;
    quantity: number;
    name: string;
    price: string;
    currency: string;
    isNumbered: boolean;
    numberedTickets?: NumberedTicket[];
    event: {
      id: string;
      name: string;
      front_page_image: string;
    };
    date: string;
    personalInfo?: { fullName: string; email: string };
  };
  onRemove?: (ticketId: string) => void;
  onMoveToWishlist?: (ticketId: string) => void;
  showActions?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onRemove,
  onMoveToWishlist,
  showActions = true,
}) => {
  const { increaseQuantity, decreaseQuantity } = useCart();
  const isRestricted = item.personalInfo || item.isNumbered;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  };

  const handleRemove = () => {
    onRemove?.(item.ticketId);
  };

  const handleMoveToWishlist = () => {
    onMoveToWishlist?.(item.ticketId);
  };

  return (
    <View className="bg-background-card rounded-xl mb-3 overflow-hidden">
      {/* Event Image Background */}
      <View className="w-full h-32 relative">
        <Image
          source={{ uri: item.event?.front_page_image }}
          resizeMode="cover"
          className="w-full h-full"
        />
        <View className="absolute inset-0 bg-black opacity-60" />
        {showActions && onMoveToWishlist && (
          <View className="absolute top-2 right-2">
            <TouchableOpacity
              onPress={handleMoveToWishlist}
              className="bg-background-card p-2 rounded-full"
            >
              <FontAwesome6 name="heart" size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Item Details */}
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-white font-bold text-lg" numberOfLines={2}>
              {item.event.name}
            </Text>
            <Text className="text-white-100 text-sm">
              {item.name}
            </Text>
          </View>
          {showActions && onRemove && (
            <TouchableOpacity
              onPress={handleRemove}
              className="bg-red-500 p-2 rounded-full ml-2"
            >
              <FontAwesome6 name="trash" size={12} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <View className="space-y-1 mb-3">
          <Text className="text-white-100 text-sm">
            📅 {formatDate(item.date)}
          </Text>
          <Text className="text-white-100 text-sm">
            💰 {item.price} {item.currency}
          </Text>
          {item.isNumbered && item.numberedTickets && (
            <Text className="text-white-100 text-sm">
              🪑 Asientos: {item.numberedTickets
                .map((nt) => `${nt.prefix}-${nt.number}`)
                .join(", ")}
            </Text>
          )}
          {item.personalInfo && (
            <Text className="text-white-100 text-sm">
              👤 {item.personalInfo.fullName}
            </Text>
          )}
        </View>

        {/* Quantity Controls */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center space-x-3">
            {isRestricted ? (
              <Text className="text-white-100 text-sm">
                Cantidad: {item.quantity}
              </Text>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => decreaseQuantity(item.ticketId)}
                  className="bg-background w-8 h-8 items-center justify-center rounded-md"
                  disabled={item.quantity <= 1}
                >
                  <FontAwesome6 name="minus" size={12} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">
                  {item.quantity}
                </Text>
                <TouchableOpacity
                  onPress={() => increaseQuantity(item.ticketId)}
                  className="bg-background w-8 h-8 items-center justify-center rounded-md"
                >
                  <FontAwesome6 name="plus" size={12} color="white" />
                </TouchableOpacity>
              </>
            )}
          </View>
          <Text className="text-white font-bold text-lg">
            {(parseFloat(item.price) * item.quantity).toFixed(2)} {item.currency}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CartItem;

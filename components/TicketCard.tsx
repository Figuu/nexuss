import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../app/context/AuthContext";
import { images } from "../constants";
import QRCode from "react-qr-code";
import { ReactDOM } from "react";

interface TicketType {
  id: string;
  event_id: string;
  ticket_type_id: string;
  number: string;
  numbered_ticket_id: string;
  code: string;
  user_id: string;
  seller_id: string;
  payment_id: string;
  pay_method: string;
  coupon_id: string;
  coupon_code: string;
  status_id: string;
  date: string;
  event: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    front_page_image: string;
    status_id: string;
    is_single_date: boolean;
    is_payment: boolean;
    is_virtual_event: boolean;
    virtual_link: string;
    virtual_platform: string;
  };
  ticket_type: {
    id: string;
    name: string;
    price: string;
    is_numbered: boolean;
    is_personal: boolean;
    is_rfid: boolean;
  };
}

interface TicketCardProps {
  ticket: TicketType;
}

const TikcetCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("es-ES", options);
  };

  return (
    <TouchableOpacity className="flex-row w-full bg-background-card rounded-xl mb-2 ">
      <View className="h-[120px] aspect-square bg-white rounded-xl mr-4 overflow-hidden items-center justify-center">
        <QRCode
          size={110}
          className="w-full aspect-square rounded-xl"
          value={ticket?.id}
          viewBox={`0 0 256 256`}
        />
      </View>
      <View className="flex-1 mr-2">
        <Text
          className="text-white font-sbold text-lg"
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {ticket?.event.name}
        </Text>
        <Text className="text-white-100 mt-2">🗓{formatDate(ticket?.date)}</Text>
        <Text className="text-white-100 mt-2">
          🎫{ticket?.ticket_type.name}
        </Text>
        <Text className="text-white-100 mt-2">
          💰{ticket?.ticket_type.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TikcetCard;

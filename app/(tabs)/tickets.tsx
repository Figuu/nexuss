import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL, useAuth } from "../context/AuthContext";
import useAuthGuard from "../../hooks/useAuthGuard";
import { useFocusEffect } from "expo-router";
import TikcetCard from "../../components/TicketCard";

interface Ticket {
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
  },
  ticket_type: {
    id: string;
    name: string;
    price: string;
    is_numbered: boolean;
    is_personal: boolean;
    is_rfid: boolean;
  },

}

const Tickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth();

  // console.log(authState.token);

  // Check auth
  // const checkAuthentication = useAuthGuard();
  const checkAuth = useAuthGuard();
  useFocusEffect(() => {
    const isAuthenticated = checkAuth();
    if (!isAuthenticated) {
      return;
    }
  });

  useEffect(() => {
    let isMounted = true;

    const fetchTickets = async () => {
      setTickets([]);
      try {
        const result = await axios.get(
          `${API_URL}/ticket`
            , {
            params: {
              // user_id: authState.user?.id,
            },
          }
        );

        if (isMounted) {
          // console.log(result.data);
          setTickets(result.data);

          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTickets();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView className="h-full flex-1 bg-background items-center ">
      <View className="w-full h-full px-4 mt-4">
        <ScrollView
          className="
        "
        >
          {tickets.length > 0 ? (
            tickets.map((ticket) => <TikcetCard key={ticket.id} ticket={ticket} />)
          ) : (
            <Text>No tickets</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Tickets;

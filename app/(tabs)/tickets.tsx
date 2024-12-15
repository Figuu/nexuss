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
import { API_URL } from "../context/AuthContext";
import useAuthGuard from "../../hooks/useAuthGuard";
import { useFocusEffect } from "expo-router";

interface Ticket {
  id: string;
  event_id: string;
  ticket_type_id: string;
  number: string;
  code: string;
  user_id: string;
  seller_id: string;
  payment_id: string;
  pay_method: string;
  coupon_id: string;
  coupon_code: string;
  status_id: string;
}

const Tickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // Check auth
  const checkAuthentication = useAuthGuard();
  useFocusEffect(() => {
      const isAuthenticated = checkAuthentication("profile");
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
          //   , {
          //   params: {
          //     user_id: "5ad9ebca-3bcd-4dad-80c7-4a199629f579",
          //   },
          // }
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
    <SafeAreaView className="h-full flex-1 bg-gray items-center ">
      <View className="w-full h-full px-4 mt-4">
        <ScrollView
          className="
        "
        >
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <TouchableOpacity
                key={ticket.id}
                className="bg-black-100 p-4 rounded-lg mb-2"
              >
                <Text className="text-white">{ticket.id}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No tickets</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Tickets;

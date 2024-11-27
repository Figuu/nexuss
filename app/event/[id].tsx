import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useGlobalSearchParams } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { images } from "../../constants";
import axios from "axios";
import { API_URL } from "../context/AuthContext";
import TicketModal from "./[id]/ticketModal";

interface EventType {
  id: string;
  name: string;
  address: string;
  front_page_image: string;
  portal_id: string;
  latitude: string;
  longitude: string;
}

// interface ScheduleType {
//   id: string;
//   date: string;
//   start_time: string;
//   end_time: string;
// }

// interface TicketType {
//   id: string;
//   name: string;
//   price: string;
//   quantity: string;
//   available: number;
//   currency: any;
//   schedure: ScheduleType;
// }

const Event = () => {
  const { id } = useGlobalSearchParams();
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const [schedule, setSchedule] = useState<ScheduleType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  // const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);

  // const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  // const [ticketQuantity, setTicketQuantity] = useState(1);
  // const [filteredTickets, setFilteredTickets] = useState<TicketType[]>([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(API_URL + "/event", {
          params: {
            id: id,
            status_id: 1,
          },
        });
        setEvent(response.data[0]);
      } catch (err) {
        setError("Error al cargar los detalles del evento");
      } finally {
        setLoading(false);
      }
    };

    if (id && event === null) {
      fetchEventDetails();
    }
  }, [id]);

  // useEffect(() => {
  //   const fetchEventSchedule = async () => {
  //     try {
  //       const response = await axios.get(API_URL + "/schedure", {
  //         params: {
  //           event_id: id,
  //         },
  //       });
  //       setSchedule(response.data);
  //     } catch (err) {
  //       setError("Error al cargar el horario del evento");
  //     }
  //   };

  //   if (id && event !== null) {
  //     fetchEventSchedule();
  //   }
  // }, [event]);

  // useEffect(() => {
  //   const fetchEventTickets = async () => {
  //     try {
  //       const response = await axios.get(API_URL + "/ticket-type", {
  //         params: {
  //           event_id: id,
  //         },
  //       });
  //       setTicketTypes(response.data);
  //     } catch (err) {
  //       setError("Error al cargar los tipos de entradas");
  //     }
  //   };

  //   if (id && event !== null) {
  //     fetchEventTickets();
  //   }
  // }, [event]);

  // useEffect(() => {
  //   if (selectedDate) {
  //     const filtered = ticketTypes.filter(
  //       (ticket) => ticket.schedure.id === selectedDate
  //     );
  //     setFilteredTickets(filtered);
  //   }
  // }, [selectedDate]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray">
        <ActivityIndicator size={"large"} color="#ffffff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray">
        <Text className="text-white">{error}</Text>
      </SafeAreaView>
    );
  }

  const handleBuyTickets = () => {
    setModalVisible(true);
  };

  const buyTicket = async (eventId: any, ticketType: any, number: any) => {
    try {
      const response = await axios.post(API_URL + "/ticket", {
        event_id: eventId,
        ticket_type_id: ticketType,
        number: number,
        user_id: "1c962b5d-5b96-453a-b7a5-b7a2e70b52ec",
        date: new Date().toISOString(),
        code: "n/a",
        seller_id: "48d4320a-b81c-40d1-b999-ae7cd7620434",
      });
    } catch (err) {}
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString("en-US", { day: "numeric" });
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return { day, month };
  };

  return (
    <SafeAreaView className="flex-1 bg-gray -mt-6">
      {event && (
        <>
          <ScrollView className="overflow-visible">
            <View className="w-[100vw] -mt-16">
              <Image
                src={event.front_page_image}
                resizeMode="cover"
                className="w-full h-[45vh]"
              />
              <Image
                source={images.gradient}
                resizeMode="cover"
                className="w-[100vw] h-[45vh] absolute top-0"
              />
            </View>
            <View className="p-4">
              <View className="mt-2">
                <Text className="text-white text-3xl font-sbold">
                  {event.name}
                </Text>
                <View className="mt-2">
                  <Text className="text-gray-400">📍{event.address}</Text>
                </View>
              </View>

              {/* Fechas */}
              <View className="mt-4">
                <Text className="text-white text-lg font-sbold">Fechas</Text>
                <View className="flex-row flex-wrap">
                  {schedule.map((item, index) => {
                    const { day, month } = formatDate(item.date);
                    return (
                      <View
                        key={index}
                        className="bg-gray-200 p-2 mr-2 rounded-lg h-14 w-14 justify-center items-center"
                      >
                        <Text className="text-white text-lg font-bold">
                          {day}
                        </Text>
                        <Text className="text-gray-400 text-sm">{month}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Mapa */}
              <View className="w-full mt-2 mb-24 rounded-lg overflow-hidden">
                <MapView
                  className="w-full h-64"
                  initialRegion={{
                    latitude: parseFloat(event.latitude),
                    longitude: parseFloat(event.longitude),
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: parseFloat(event.latitude),
                      longitude: parseFloat(event.longitude),
                    }}
                    title={event.name}
                    description={event.address}
                  />
                </MapView>
              </View>
            </View>
          </ScrollView>

          <View className="absolute p-4 bottom-0 w-[100vw] bg-gray h-28 flex justify-center items-center rounded-t-3xl">
            <TouchableOpacity
              className="bg-red-500 p-4 absolute w-full rounded-xl bottom-8"
              onPress={handleBuyTickets}
            >
              <Text className="text-white text-center text-lg font-sbold">
                Comprar Entradas
              </Text>
            </TouchableOpacity>
          </View>

          {/* MODAL */}
          <TicketModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            eventId={id}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default Event;

{
  /* <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View className="flex-1 justify-center items-center bg-gray rounded-t-3xl ">
    <View className="p-4 rounded-lg w-[90%] h-[90%]">
      <Text className="text-center text-white text-2xl font-sbold">
        {event.name}
      </Text>
      <Text className="text-gray-400">{event.address}</Text>
      <View className="mt-4">
        <Text className="text-white text-lg font-sbold">Fechas</Text>
        <View className="flex-row flex-wrap">
          {schedule.map((item, index) => {
            const { day, month } = formatDate(item.date);
            const isSelectedD = selectedDate === item.id;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedDate(item.id)}
                className={`p-4 mr-2 rounded-lg w-[80px] h-[80px] justify-center items-center ${
                  isSelectedD ? "bg-red-500" : "bg-gray-200"
                }`}
              >
                <Text
                  className={`text-lg font-bold ${
                    isSelectedD ? "text-white" : "text-white"
                  }`}
                >
                  {day}
                </Text>
                <Text
                  className={`text-sm ${
                    isSelectedD ? "text-white" : "text-gray-400"
                  }`}
                >
                  {month}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      {filteredTickets.length > 0 ? (
        <View className="mt-4">
          <Text className="text-white text-lg font-sbold">
            Entradas Disponibles
          </Text>
          {filteredTickets.map((ticket, index) => {
            const isSelectedT = selectedTicket === ticket.id;
            return (
              <View key={index}>
                <TouchableOpacity
                  onPress={() => setSelectedTicket(ticket.id)}
                  className={`p-2 mr-2 mb-2 bg-gray-200 rounded-lg justify-center items-center ${
                    isSelectedT ? "bg-red-500" : "bg-gray-200"
                  }`}
                >
                  <Text className="text-white font-sbold text-base">
                    {ticket.name}
                  </Text>
                  <Text
                    className={`text-sm font-semibold ${
                      isSelectedT ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {ticket.price} {ticket.currency.code}
                  </Text>
                  <Text
                    className={`text-sm ${
                      isSelectedT ? "text-white" : "text-gray-400"
                    }`}
                  >
                    Disponible: {ticket.available}
                  </Text>
                </TouchableOpacity>
                {isSelectedT && (
                  <View className="flex-row justify-between items-center mt-2">
                    <TouchableOpacity
                      onPress={() =>
                        setTicketQuantity((prev) =>
                          prev > 1 ? prev - 1 : prev
                        )
                      }
                      className="bg-gray-500 p-2 rounded-md"
                    >
                      <Text className="text-white text-lg">-</Text>
                    </TouchableOpacity>
                    <Text className="text-white text-lg">{ticketQuantity}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        setTicketQuantity((prev) =>
                          prev < ticket.available ? prev + 1 : prev
                        )
                      }
                      className="bg-gray-500 p-2 rounded-md"
                    >
                      <Text className="text-white text-lg">+</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ) : (
        <Text className="text-white mt-4">
          No hay entradas disponibles para esta fecha.
        </Text>
      )}
      <TouchableOpacity
        className="bg-red-500 p-4 mt-4 rounded-xl"
        onPress={() => buyTicket(id, selectedTicket, ticketQuantity)}
      >
        <Text className="text-white text-center text-lg font-sbold">
          Comprar
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-red-500 p-4 mt-4 rounded-xl"
        onPress={() => setModalVisible(false)}
      >
        <Text className="text-white text-center text-lg font-sbold">
          Cerrar
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>; */
}

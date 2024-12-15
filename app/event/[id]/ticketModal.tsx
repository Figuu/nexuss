import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../context/AuthContext";
import { router, useFocusEffect } from "expo-router";
import Modal from "react-native-modal";
import CardPaymentView from "./cardPayment";
import QrPaymentView from "./qrPayment";
import { images } from "../../../constants";
import useAuthGuard from "../../../hooks/useAuthGuard";

interface ScheduleType {
  id: string;
  date: string;
}

interface TicketType {
  id: string;
  name: string;
  price: string;
  available: number;
  currency: { code: string };
  schedure: ScheduleType;
}

interface TicketModalProps {
  visible: boolean;
  onClose: () => void;
  eventId: string;
  eventName: string;
}

const TicketModal: React.FC<TicketModalProps> = ({
  visible,
  onClose,
  eventId,
  eventName,
}) => {
  const [schedule, setSchedule] = useState<ScheduleType[]>([]);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  const filteredTickets = selectedDate
    ? tickets.filter((ticket) => ticket.schedure.id === selectedDate)
    : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString("en-US", { day: "numeric" });
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return { day, month };
  };

  useEffect(() => {
    const fetchEventSchedule = async () => {
      try {
        const response = await axios.get(API_URL + "/schedure", {
          params: {
            event_id: eventId,
          },
        });
        setSchedule(response.data);
      } catch (err) {
        setError("Error al cargar el horario del evento");
      }
    };

    if (eventId) {
      fetchEventSchedule();
    }
  }, [eventId]);

  useEffect(() => {
    const fetchEventTickets = async () => {
      try {
        const response = await axios.get(API_URL + "/ticket-type", {
          params: {
            event_id: eventId,
          },
        });
        setTickets(response.data);
      } catch (err) {
        setError("Error al cargar los tipos de entradas");
      }
    };

    if (schedule.length > 0) {
      fetchEventTickets();
    }
  }, [schedule]);

  const handleBuy = () => {
    setModalVisible(true);
  };

  return (
    <>
      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        swipeDirection="down"
        isVisible={visible}
        onSwipeComplete={onClose}
        onBackdropPress={onClose}
        backdropOpacity={0}
        className="m-0 justify-end"
      >
        <SafeAreaView className="flex-1 bg-gray items-center rounded-t-3xl mt-10">
          <View className="bg-gray-100 my-2 h-1 w-[40vw] rounded-full" />
          <View className="px-4 w-full">
            <ScrollView className="w-full">
              <Text className="text-center text-white text-2xl font-bold">
                {eventName}
              </Text>
              <View className="mt-4">
                <Text className="text-white text-lg font-bold">Fechas</Text>
                <View className="flex-row flex-wrap mt-2">
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
                            isSelectedD ? "text-white" : "text-gray-300"
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
                  <Text className="text-white text-lg font-bold">
                    Entradas Disponibles
                  </Text>
                  {filteredTickets.map((ticket, index) => {
                    const isSelectedT = selectedTicket === ticket.id;
                    return (
                      <View key={index}>
                        <TouchableOpacity
                          onPress={() => setSelectedTicket(ticket.id)}
                          className={`p-4 mb-2 rounded-lg ${
                            isSelectedT ? "bg-red-500" : "bg-gray-200"
                          }`}
                        >
                          <Text className="text-white font-bold">
                            {ticket.name}
                          </Text>
                          <Text className="text-gray-100 text-sm">
                            {ticket.price} {ticket.currency.code}
                          </Text>
                          <Text className="text-gray-100 text-sm">
                            Disponible: {ticket.available}
                          </Text>
                        </TouchableOpacity>
                        {isSelectedT && (
                          <View className="flex-row justify-between items-center mt-2">
                            <TouchableOpacity
                              onPress={() =>
                                setQuantity((prev) =>
                                  prev > 1 ? prev - 1 : prev
                                )
                              }
                              className="bg-gray-200 p-2 rounded-md"
                            >
                              <Text className="text-white text-lg">-</Text>
                            </TouchableOpacity>
                            <Text className="text-white text-lg">
                              {quantity}
                            </Text>
                            <TouchableOpacity
                              onPress={() =>
                                setQuantity((prev) =>
                                  prev < ticket.available ? prev + 1 : prev
                                )
                              }
                              className="bg-gray-200 p-2 rounded-md"
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
                onPress={handleBuy}
              >
                <Text className="text-white text-center text-lg font-bold">
                  Comprar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-200 p-4 mt-4 rounded-xl"
                onPress={onClose}
              >
                <Text className="text-white text-center text-lg font-bold">
                  Cerrar
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
      <Modal
        isVisible={modalVisible}
        animationIn="slideInUp"
        animationOut="fadeOut"
        swipeDirection="down"
        onSwipeComplete={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        presentationStyle="overFullScreen"
        backdropOpacity={0}
        className="m-0 justify-end"
      >
        <SafeAreaView className="bg-gray rounded-t-3xl items-center h-[30vh]">
          <View className="bg-gray-100 my-2 h-1 w-[40vw] rounded-full " />
          <Text className="text-white">Pagar con</Text>
          <View className="flex-row mt-4">
            <TouchableOpacity
              onPress={() => setCardVisible(true)}
              className="bg-gray-200 p-4 mr-2 rounded-lg"
            >
              <Image
                source={images.card}
                className="w-10 h-10"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setQrVisible(true)}
              className="bg-gray-200 p-4 ml-2 rounded-lg"
            >
              <Image
                source={images.qr}
                className="w-10 h-10"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      <CardPaymentView visible={cardVisible} onClose={() => setCardVisible(false)} />

      <QrPaymentView visible={qrVisible} onClose={() => setQrVisible(false)} />
    </>
  );
};

export default TicketModal;

{
  /* <CardPaymentView
        visible={cardVisible}
        onClose={() => setCardVisible(false)}
      />
      <QrPaymentView
        visible={qrVisible}
        onClose={() => setQrVisible(false)}
      />
      <Modal
        isVisible={modalVisible}
        animationIn="tada"
        animationOut="fadeOut"
        swipeDirection="down"
        onSwipeComplete={onClose}
        onBackdropPress={onClose}
        presentationStyle="overFullScreen"
        backdropOpacity={0}
        className="m-0 justify-end"
      >
        <SafeAreaView className="bg-gray rounded-t-3xl items-center h-[30vh]">
          <View className="bg-gray-100 my-2 h-1 w-[40vw] rounded-full " />
          <Text className="text-white">Pagar con</Text>
          <View className="flex-row mt-4">
            <TouchableOpacity
              onPress={() => {
                setCardVisible(true);
              }}
              className="bg-gray-200 p-4 mr-2 rounded-lg"
            >
              <Image
                source={images.card}
                className="w-10 h-10"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setQrVisible(true);
              }}
              className="bg-gray-200 p-4 ml-2 rounded-lg"
            >
              <Image
                source={images.qr}
                className="w-10 h-10"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal> */
}

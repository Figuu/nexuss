import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../context/AuthContext";
import { router, useFocusEffect } from "expo-router";
import Modal from "react-native-modal";
import CardPaymentView from "./cardPayment";
import QrPaymentView from "./qrPayment";
import { icons, images } from "../../../constants";
import CustomDropDownPicker from "../../../components/CustomDropDown";
import { useCart } from "../../context/CartContext";

interface ScheduleType {
  id: string;
  date: string;
}

interface EventType {
  id: string;
  name: string;
  address: string;
  front_page_image: string;
  portal_id: string;
  latitude: string;
  longitude: string;
}

interface TicketType {
  id: string;
  name: string;
  price: string;
  available: number;
  currency: { code: string };
  schedure: ScheduleType;
  image: string;
  is_personal: boolean;
  is_numbered: boolean;
}

interface NumberedTicket {
  id: string;
  prefix: string;
  number: number;
  status: number;
}

interface TicketModalProps {
  visible: boolean;
  onClose: () => void;
  event: EventType;
}

const TicketModal: React.FC<TicketModalProps> = ({
  visible,
  onClose,
  event,
}) => {
  const [schedule, setSchedule] = useState<ScheduleType[]>([]);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [numberedTickets, setNumberedTickets] = useState<NumberedTicket[]>([]);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [selectedNumberedTicket, setSelectedNumberedTicket] = useState<
    string | null
  >(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [dropdownDateOpen, setDropdownDateOpen] = useState(false);
  const [dropdownTicketOpen, setDropdownTicketOpen] = useState(false);
  const [dropdownNumberedOpen, setDropdownNumberedOpen] = useState(false);

  const { addToCart } = useCart();

  const filteredTickets = selectedDate
    ? tickets.filter((ticket) => ticket.schedure.id === selectedDate)
    : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString("en-US", { day: "numeric" });
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.toLocaleDateString("en-US", { year: "numeric" });
    return { day, month, year };
  };

  const fetchNumberedTickets = useCallback(async (ticketTypeId: string) => {
    try {
      const response = await axios.get(`${API_URL}/numbered-ticket`, {
        params: { ticket_type_id: ticketTypeId, statud_id: 1 },
      });
      setNumberedTickets(response.data);
    } catch (err) {
      setError("Error al cargar los tickets numerados");
    }
  }, []);

  const fetchEventData = useCallback(async () => {
    try {
      const [scheduleRes, ticketsRes] = await Promise.all([
        axios.get(`${API_URL}/schedure`, { params: { event_id: event.id } }),
        axios.get(`${API_URL}/ticket-type`, { params: { event_id: event.id } }),
      ]);
      setSchedule(scheduleRes.data);
      setTickets(ticketsRes.data);
    } catch (err) {
      setError("Error al cargar los datos del evento");
    }
  }, [event.id]);

  useEffect(() => {
    if (event.id) {
      fetchEventData();
    }
  }, [fetchEventData]);

  useEffect(() => {
    const ticket = tickets.find((t) => t.id === selectedTicket);
    if (ticket?.is_numbered) {
      fetchNumberedTickets(ticket.id);
    } else {
      setNumberedTickets([]); // Limpiar si no es numerado
    }
  }, [selectedTicket, tickets, fetchNumberedTickets]);

  const handleQuantityChange = (increment: boolean) => {
    setQuantity((prev) => {
      if (increment) {
        const ticket = tickets.find((t) => t.id === selectedTicket);
        return ticket && prev < ticket.available ? prev + 1 : prev;
      }
      return prev > 1 ? prev - 1 : prev;
    });
  };

  const handleBuy = () => {
    const ticket = tickets.find((t) => t.id === selectedTicket);
    if (ticket?.is_personal && (!fullName || !email)) {
      setError("Por favor, completa todos los campos requeridos.");
      return;
    }
    setModalVisible(true);
  };

  const addCart = () => {
    const ticket = tickets.find((t) => t.id === selectedTicket);
    if (!ticket) {
      setError("Por favor, selecciona un ticket.");
      return;
    }

    if (ticket.is_personal && (!fullName || !email)) {
      setError("Por favor, completa todos los campos requeridos.");
      return;
    }

    const cartItem = {
      ticketId: ticket.id,
      quantity,
      name: ticket.name,
      price: ticket.price,
      currency: ticket.currency.code,
      is_numbered: ticket.is_numbered,
      event: event,
      personalInfo: ticket.is_personal ? { fullName, email } : null,
    };

    addToCart(cartItem);
    setError("");
    onClose();
  };

  const handleClose = () => {
    closePayment();
    setModalVisible(false);
    onClose();
  };

  const closePayment = () => {
    setCardVisible(false);
    setQrVisible(false);
  };

  return (
    <Modal
      animationIn="slideInUp"
      animationOut="slideOutDown"
      swipeDirection={
        modalVisible ||
        dropdownDateOpen ||
        dropdownTicketOpen ||
        dropdownNumberedOpen
          ? undefined
          : "down"
      }
      isVisible={visible}
      onSwipeComplete={handleClose}
      onBackdropPress={handleClose}
      avoidKeyboard={true}
      presentationStyle="overFullScreen"
      className="m-0 justify-end"
    >
      <SafeAreaView className="flex-1 bg-background items-center rounded-t-3xl mt-10">
        <View className="bg-background my-2 h-1 w-[40vw] rounded-full" />
        <Text className="text-center text-white text-2xl font-bold">
          {event.name}
        </Text>
        <ScrollView
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={dropdownDateOpen || dropdownTicketOpen ? false : true}
          className="w-full mt-4 flex-col"
        >
          <View className="flex-row w-full px-4 my-2 ">
            {/* Dropdown for Dates */}
            <View className="flex-[5] mr-2">
              <CustomDropDownPicker
                open={dropdownDateOpen}
                value={selectedDate}
                placeholder="Fecha"
                items={schedule.map((sched) => ({
                  label: `${formatDate(sched.date).day} ${
                    formatDate(sched.date).month
                  } ${formatDate(sched.date).year}`,
                  value: sched.id,
                }))}
                setOpen={setDropdownDateOpen}
                setValue={setSelectedDate}
              />
            </View>

            {/* Dropdown for Ticket Types */}
            <View className="flex-[7]">
              <CustomDropDownPicker
                open={dropdownTicketOpen}
                value={selectedTicket}
                placeholder="Tipo de Entrada"
                items={filteredTickets.map((ticket) => ({
                  label: `${ticket.name} - ${ticket.price} ${ticket.currency.code}`,
                  value: ticket.id,
                }))}
                setOpen={setDropdownTicketOpen}
                setValue={setSelectedTicket}
              />
            </View>
          </View>

          {/* Ticket Image Section */}
          {selectedTicket && (
            <View className="w-full px-4 mt-2">
              <Image
                source={{
                  uri: tickets.find((t) => t.id === selectedTicket)?.image,
                }}
                style={{ width: "100%", height: 150, borderRadius: 8 }}
                resizeMode="cover"
              />
            </View>
          )}

          <View className="w-full px-4 mt-4">
            {numberedTickets.length == 0 && (
              <View className="flex-row justify-between items-center">
                <TouchableOpacity
                  onPress={() => handleQuantityChange(false)}
                  className="bg-background p-2 rounded-md"
                >
                  <Text className="text-white text-lg">-</Text>
                </TouchableOpacity>
                <Text className="text-white text-lg">{quantity}</Text>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(true)}
                  className="bg-background p-2 rounded-md"
                >
                  <Text className="text-white text-lg">+</Text>
                </TouchableOpacity>
              </View>
            )}

            {numberedTickets.length > 0 && (
              <View className="w-max mt-4">
                <CustomDropDownPicker
                  open={dropdownNumberedOpen}
                  value={selectedNumberedTicket}
                  placeholder="Numero de ticket"
                  items={numberedTickets.map((ticket) => ({
                    label: `${ticket.prefix}-${ticket.number}`,
                    value: ticket.id,
                  }))}
                  setOpen={setDropdownNumberedOpen}
                  setValue={setSelectedNumberedTicket}
                  multiple={true}
                  mode="BADGE"
                  search={true}
                />
              </View>
            )}

            {selectedTicket &&
              tickets.find((t) => t.id === selectedTicket)?.is_personal && (
                <View className="w-full mt-4">
                  <Text className="text-white text-lg font-bold">
                    Información Personal
                  </Text>
                  <View className="mt-2">
                    <Text className="text-white">Nombre Completo</Text>
                    <TextInput
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="Ingresa tu nombre completo"
                      placeholderTextColor="#aaa"
                      className="bg-background text-white p-4 mt-2 rounded-lg"
                    />
                  </View>
                  <View className="mt-4">
                    <Text className="text-white">Correo Electrónico</Text>
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Ingresa tu correo electrónico"
                      placeholderTextColor="#aaa"
                      className="bg-background text-white p-4 mt-2 rounded-lg"
                      keyboardType="email-address"
                    />
                  </View>
                </View>
              )}
          </View>
        </ScrollView>
        <View className="absolute bottom-4 flex-row justify-between w-max space-x-2 mt-4 mx-2 items-center ">
          <TouchableOpacity
            className="bg-background-card p-4 mt-4 rounded-xl w-36"
            onPress={handleClose}
          >
            <Text className="text-white text-center text-lg font-bold">
              Cerrar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-primary p-4 mt-4 rounded-xl w-36"
            onPress={handleBuy}
          >
            <Text className="text-white text-center text-lg font-bold">
              Comprar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-primary items-center justify-center w-14 mt-4 rounded-xl aspect-square"
            onPress={addCart}
          >
            <Image
              source={images.addCart}
              className="w-10 h-10"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        swipeDirection={cardVisible || qrVisible ? undefined : "down"}
        isVisible={modalVisible}
        onSwipeComplete={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        presentationStyle="overFullScreen"
        className="m-0 justify-end"
      >
        <SafeAreaView className="bg-background rounded-t-3xl items-center h-[30vh]">
          <View className="bg-background my-2 h-1 w-[40vw] rounded-full " />
          <Text className="text-white">Pagar con</Text>
          <View className="flex-row mt-4">
            <TouchableOpacity
              onPress={() => {
                setCardVisible(true);
              }}
              className="bg-background-card p-4 mr-2 rounded-lg"
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
              className="bg-background-card p-4 ml-2 rounded-lg"
            >
              <Image
                source={images.qr}
                className="w-10 h-10"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <CardPaymentView visible={cardVisible} onClose={closePayment} />
        <QrPaymentView visible={qrVisible} onClose={closePayment} />
      </Modal>
    </Modal>
  );
};

export default TicketModal;

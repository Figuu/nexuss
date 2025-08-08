import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL, useAuth } from "../../context/AuthContext";
import { router } from "expo-router";
import { images } from "../../../constants";
import CustomDropDownPicker from "../../../components/CustomDropDown";
import { useCart } from "../../context/CartContext";
import PaymentOptionsModal from "../../../components/payment/paymentOptions";

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
  const { authState } = useAuth();
  const { addToCart, getCartError } = useCart();

  const [schedule, setSchedule] = useState<ScheduleType[]>([]);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [numberedTickets, setNumberedTickets] = useState<NumberedTicket[]>([]);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false); // New: Loading state

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [selectedNumberedTicket, setSelectedNumberedTicket] = useState<
    string | null
  >(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [qrVisible, setQrVisible] = useState(false);

  const [dropdownDateOpen, setDropdownDateOpen] = useState(false);
  const [dropdownTicketOpen, setDropdownTicketOpen] = useState(false);
  const [dropdownNumberedOpen, setDropdownNumberedOpen] = useState(false);

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
      setNumberedTickets([]);
      setSelectedNumberedTicket(null);
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

  const [paymentData, setPaymentData] = useState<any>(null);

  const handleBuy = () => {
    const ticket = tickets.find((t) => t.id === selectedTicket);
    if (!ticket || !selectedDate) {
      setError("Por favor, selecciona una fecha y un ticket.");
      return;
    }
    const paymentData = {
      event,
      ticketTypeId: ticket.id,
      quantity,
      totalAmount: parseFloat(ticket.price) * quantity,
      currency: ticket.currency.code,
      fullName,
      email,
      numberedTicketId: selectedNumberedTicket,
    };
    setModalVisible(true);
    setPaymentData(paymentData);
  };

  const addCart = () => {
    const ticket = tickets.find((t) => t.id === selectedTicket);
    const selectedSchedule = schedule.find((s) => s.id === selectedDate);
    if (!ticket || !selectedSchedule) {
      Alert.alert("Error", "Por favor, selecciona una fecha y un ticket.");
      return;
    }
    if (ticket.is_personal && (!fullName || !email)) {
      Alert.alert("Error", "Por favor, completa todos los campos requeridos.");
      return;
    }
    if (ticket.is_numbered && !selectedNumberedTicket) {
      Alert.alert("Error", "Por favor, selecciona al menos un asiento.");
      return;
    }

    setIsAddingToCart(true);

    const selectedNumberedTicketsArray = selectedNumberedTicket
      ? Array.isArray(selectedNumberedTicket)
        ? selectedNumberedTicket
        : [selectedNumberedTicket]
      : [];

    const numberedTicketDetails = ticket.is_numbered
      ? numberedTickets.filter((nt) =>
          selectedNumberedTicketsArray.includes(nt.id)
        )
      : [];

    const cartItem = {
      ticketId: ticket.id,
      quantity: ticket.is_numbered ? numberedTicketDetails.length : quantity,
      name: ticket.name,
      price: ticket.price,
      currency: ticket.currency.code,
      isNumbered: ticket.is_numbered,
      numberedTickets: ticket.is_numbered ? numberedTicketDetails : undefined,
      event,
      date: selectedSchedule.date,
      personalInfo: ticket.is_personal ? { fullName, email } : undefined,
      userId: authState?.user?.id,
    };

    addToCart(cartItem);
    const cartError = getCartError();
    if (cartError) {
      Alert.alert("Error", cartError);
      setIsAddingToCart(false);
      return;
    }
    setIsAddingToCart(false);

    // Reset form
    setQuantity(1);
    setSelectedDate(null);
    setSelectedTicket(null);
    setSelectedNumberedTicket(null);
    setFullName("");
    setEmail("");
    onClose();
  };

  const handleClose = () => {
    setModalVisible(false);
    setTimeout(() => onClose(), 100);
  };

  const closePayment = () => {
    // setCardVisible(false);
    setQrVisible(false);
    setTimeout(() => setModalVisible(false), 100);
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-background">
        <View className="bg-white my-2 h-1 w-[40vw] rounded-full self-center" />
        <Text className="text-center text-white text-2xl font-bold">
          {event.name}
        </Text>
        {error ? (
          <Text className="text-red-500 text-center mt-2">{error}</Text>
        ) : null}

        <View className="w-full px-4 mt-4">
          <View className="flex-row w-full my-2">
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
                zIndex={10}
              />
            </View>
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
                zIndex={10}
              />
            </View>
          </View>
          {numberedTickets.length > 0 && (
            <View className="w-full mt-4">
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
                zIndex={1}
              />
            </View>
          )}
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className={`flex-1 ${Platform.OS === "ios" ? "-mb-4" : "mb-2"}`}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <ScrollView
            className="w-full flex-1"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 100 }}
          >
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
              {numberedTickets.length === 0 && (
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
                        autoComplete="name"
                        spellCheck={false}
                        autoCorrect={false}
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
                        autoComplete="email"
                        spellCheck={false}
                        autoCorrect={false}
                        keyboardType="email-address"
                      />
                    </View>
                  </View>
                )}
            </View>
          </ScrollView>

          <View className="absolute bottom-0 flex-row justify-between w-max space-x-2 mx-2 items-center">
            <TouchableOpacity
              className="bg-background-card p-4 rounded-xl flex-1 h-14"
              onPress={handleClose}
            >
              <Text className="text-white text-center text-lg font-bold">
                Cerrar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-primary p-4 rounded-xl flex-1 h-14"
              onPress={handleBuy}
            >
              <Text className="text-white text-center text-lg font-bold">
                Comprar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-primary items-center justify-center rounded-xl aspect-square h-14"
              onPress={addCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <Text className="text-white">...</Text>
              ) : (
                <Image
                  source={images.addCart}
                  className="w-10 h-10"
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <PaymentOptionsModal
        visible={modalVisible}
        onClose={closePayment}
        qrVisible={qrVisible}
        setQrVisible={setQrVisible}
        paymentData={paymentData}
        closePayment={closePayment}
      />
    </Modal>
  );
};

export default TicketModal;

// const handleClose = () => {
//   if (cardVisible || qrVisible) {
//     closePayment();
//   }
//   setTimeout(() => {
//     setModalVisible(false);
//     setTimeout(() => {
//       onClose();
//     }, 100);
//   }, 100);
// };
// const closePayment = () => {
//   setCardVisible(false);
//   setQrVisible(false);
//   setTimeout(() => {
//     setModalVisible(false);
//   }, 100);
// };

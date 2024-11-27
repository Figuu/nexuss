import { View, Text, SafeAreaView, Modal, TouchableOpacity } from "react-native";
import React, { useState } from "react";

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
}

interface TicketModalProps {
  visible: boolean;
  onClose: () => void;
  eventId: string; 
}

const TicketModal: React.FC<TicketModalProps> = ({
  visible,
  onClose,
  eventId,
}) => {


  console.log(eventId);

  const [schedule, setSchedule] = useState<ScheduleType[]>([]);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const filteredTickets = tickets.filter(
    (ticket) => ticket.id === selectedDate
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString("en-US", { day: "numeric" });
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return { day, month };    
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-gray rounded-t-3xl">
        <View className="p-4 rounded-lg w-[90%] h-[90%]">
          <Text className="text-center text-white text-2xl font-sbold">
            Evento
          </Text>
          <Text className="text-gray-400"></Text>
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
                      className={`p-2 mr-2 mb-2 rounded-lg ${
                        isSelectedT ? "bg-red-500" : "bg-gray-200"
                      }`}
                    >
                      <Text className="text-white font-sbold text-base">
                        {ticket.name}
                      </Text>
                      <Text className="text-sm font-semibold text-gray-400">
                        {ticket.price} {ticket.currency.code}
                      </Text>
                      <Text className="text-sm text-gray-400">
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
                          className="bg-gray-500 p-2 rounded-md"
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
          >
            <Text className="text-white text-center text-lg font-sbold">
              Comprar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500 p-4 mt-4 rounded-xl"
            onPress={onClose}
          >
            <Text className="text-white text-center text-lg font-sbold">
              Cerrar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TicketModal;

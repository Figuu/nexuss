import axios from 'axios';
import { API_URL, useAuth } from '../../app/context/AuthContext';

export interface PaymentItem {
  event: any;
  ticketTypeId: string;
  quantity: number;
  totalAmount: number;
  currency: string;
  fullName?: string;
  email?: string;
  numberedTicketId?: string | null;
  personalInfo?: { fullName: string; email: string };
  numberedTickets?: any[];
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentId?: string;
  error?: string;
  tickets?: any[];
}

export class PaymentProcessor {
  private authState: any;

  constructor(authState: any) {
    this.authState = authState;
  }

  async processPayment(
    paymentData: PaymentItem,
    paymentMethod: 'qr' | 'card'
  ): Promise<PaymentResult> {
    try {
      // Step 1: Generate payment with external provider
      const externalPayment = await this.generateExternalPayment(paymentData, paymentMethod);
      
      if (!externalPayment.success) {
        return { success: false, error: externalPayment.error };
      }

      // Step 2: Register payment in our system
      const paymentRegistration = await this.registerPayment(
        paymentData,
        externalPayment.transactionId!,
        paymentMethod
      );

      if (!paymentRegistration.success) {
        return { success: false, error: paymentRegistration.error };
      }

      // Step 3: Register tickets
      const ticketRegistration = await this.registerTickets(
        paymentData,
        paymentRegistration.paymentId!,
        externalPayment.transactionId!
      );

      if (!ticketRegistration.success) {
        return { success: false, error: ticketRegistration.error };
      }

      return {
        success: true,
        transactionId: externalPayment.transactionId,
        paymentId: paymentRegistration.paymentId,
        tickets: ticketRegistration.tickets,
      };

    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: 'Error interno del sistema. Por favor, intenta de nuevo.',
      };
    }
  }

  private async generateExternalPayment(
    paymentData: PaymentItem,
    paymentMethod: 'qr' | 'card'
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      const cleanName = paymentData.event.name.replace(/[^a-zA-Z0-9]/g, "");
      const timestamp = new Date().getTime();
      
      const payload = {
        companyCode: "XXNN-D4F4-4J03-27MA",
        codeTransaction: `${cleanName}-${timestamp}`,
        urlSuccess: "https://exito.com.bo",
        urlFailed: "https://falla.com.bo",
        billName: this.authState.user?.name || paymentData.fullName,
        billNit: "123456789",
        email: this.authState.user?.username || paymentData.email,
        generateBill: "1",
        concept: `Pago para evento ${paymentData.event.name}`,
        currency: paymentData.currency,
        amount: paymentData.totalAmount.toString(),
        messagePayment: "¡Gracias por tu compra!",
        codeExternal: "",
      };

      let response;
      if (paymentMethod === 'qr') {
        response = await axios.post(
          "https://yopago.com.bo/pay/qr/generateQr",
          payload
        );
      } else {
        response = await axios.post(
          "https://yopago.com.bo/pay/api/generateUrl",
          payload
        );
      }

      return {
        success: true,
        transactionId: response.data.transactionId || response.data.qrId,
      };

    } catch (error) {
      console.error('External payment generation error:', error);
      return {
        success: false,
        error: 'No se pudo generar el pago externo.',
      };
    }
  }

  private async registerPayment(
    paymentData: PaymentItem,
    transactionId: string,
    paymentMethod: 'qr' | 'card'
  ): Promise<{ success: boolean; paymentId?: string; error?: string }> {
    try {
      // Create invoice event
      const invoiceResponse = await axios.post(`${API_URL}/invoice-event`, {
        date: new Date().toISOString(),
        event_invoice_id: paymentData.event.id,
        tax_id: "string",
        tax_qr: "string",
        name: paymentData.fullName || this.authState.user?.name,
        document_type: "string",
        document_number: "string",
        document_complement: "string",
        phone: "string",
        email: paymentData.email || this.authState.user?.username,
        total: paymentData.totalAmount,
      });

      // Create ticket payment
      const paymentResponse = await axios.post(`${API_URL}/ticket-payment`, {
        execute_date: new Date().toISOString(),
        date: new Date().toISOString(),
        amount: paymentData.totalAmount,
        payment_method_id: "8a5c28e5-50be-4352-8f23-0c31d1dc70d5",
        currency_id: "673cca72-426b-4979-8c85-7a000c40fda1",
        external_code: transactionId,
        invoice_id: invoiceResponse.data.id,
        status_id: 2, // Success status
        commission_amount: 0,
        total: paymentData.totalAmount,
      });

      return {
        success: true,
        paymentId: paymentResponse.data.id,
      };

    } catch (error) {
      console.error('Payment registration error:', error);
      return {
        success: false,
        error: 'No se pudo registrar el pago en el sistema.',
      };
    }
  }

  private async registerTickets(
    paymentData: PaymentItem,
    paymentId: string,
    transactionId: string
  ): Promise<{ success: boolean; tickets?: any[]; error?: string }> {
    try {
      const tickets = [];

      // If it's a numbered ticket, register each seat
      if (paymentData.numberedTickets && paymentData.numberedTickets.length > 0) {
        for (const numberedTicket of paymentData.numberedTickets) {
          const ticketResponse = await axios.post(`${API_URL}/ticket`, {
            date: new Date().toISOString(),
            event_id: paymentData.event.id,
            ticket_type_id: paymentData.ticketTypeId,
            number: 1,
            user_id: this.authState.user?.id,
            payment_id: paymentId,
            pay_method: "8a5c28e5-50be-4352-8f23-0c31d1dc70d5",
            status_id: 1,
            price: paymentData.totalAmount / paymentData.numberedTickets.length,
            numbered_ticket_id: numberedTicket.id,
            is_payment: true,
            transaction_id: transactionId,
          });
          tickets.push(ticketResponse.data);
        }
      } else {
        // Regular ticket
        const ticketResponse = await axios.post(`${API_URL}/ticket`, {
          date: new Date().toISOString(),
          event_id: paymentData.event.id,
          ticket_type_id: paymentData.ticketTypeId,
          number: paymentData.quantity,
          user_id: this.authState.user?.id,
          payment_id: paymentId,
          pay_method: "8a5c28e5-50be-4352-8f23-0c31d1dc70d5",
          status_id: 1,
          price: paymentData.totalAmount,
          numbered_ticket_id: paymentData.numberedTicketId,
          is_payment: true,
          transaction_id: transactionId,
        });
        tickets.push(ticketResponse.data);
      }

      return {
        success: true,
        tickets,
      };

    } catch (error) {
      console.error('Ticket registration error:', error);
      return {
        success: false,
        error: 'No se pudieron registrar los tickets.',
      };
    }
  }

  async verifyPayment(
    transactionId: string,
    paymentMethod: 'qr' | 'card'
  ): Promise<{ success: boolean; status?: string; error?: string }> {
    try {
      let response;
      
      if (paymentMethod === 'qr') {
        response = await axios.post(
          "https://yopago.com.bo/pay/qr/verifyQr",
          {
            companyCode: "XXNN-D4F4-4J03-27MA",
            transactionId: transactionId,
            qrId: transactionId,
          }
        );
      } else {
        response = await axios.post(
          "https://yopago.com.bo/pay/api/verifyTransfer",
          {
            companyCode: "XXNN-D4F4-4J03-27MA",
            transactionId: transactionId,
          }
        );
      }

      const isSuccess = response.data.status === 0 && response.data.statusQr === 2;
      
      return {
        success: isSuccess,
        status: isSuccess ? 'completed' : 'pending',
      };

    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        error: 'No se pudo verificar el pago.',
      };
    }
  }
}

export const usePaymentProcessor = () => {
  const { authState } = useAuth();
  return new PaymentProcessor(authState);
};




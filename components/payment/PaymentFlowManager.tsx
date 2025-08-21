import React, { useState, useEffect } from 'react';
import { Alert, Modal } from 'react-native';
import PaymentOptionsModal from './paymentOptions';
import PaymentSuccessScreen from './PaymentSuccessScreen';
import { PaymentProcessor, PaymentItem, PaymentResult } from './PaymentProcessor';
import { useAuth } from '../../app/context/AuthContext';

interface PaymentFlowManagerProps {
  visible: boolean;
  onClose: () => void;
  paymentData: PaymentItem;
  onPaymentComplete?: (result: PaymentResult) => void;
}

interface PaymentFlowState {
  step: 'options' | 'processing' | 'success' | 'error';
  paymentMethod?: 'qr' | 'card';
  result?: PaymentResult;
  error?: string;
}

const PaymentFlowManager: React.FC<PaymentFlowManagerProps> = ({
  visible,
  onClose,
  paymentData,
  onPaymentComplete,
}) => {
  const { authState } = useAuth();
  const [flowState, setFlowState] = useState<PaymentFlowState>({ step: 'options' });
  const [paymentProcessor] = useState(() => new PaymentProcessor(authState));

  useEffect(() => {
    if (visible) {
      setFlowState({ step: 'options' });
    }
  }, [visible]);

  const handlePaymentMethodSelect = async (method: 'qr' | 'card') => {
    setFlowState({ step: 'processing', paymentMethod: method });

    try {
      const result = await paymentProcessor.processPayment(paymentData, method);
      
      if (result.success) {
        setFlowState({
          step: 'success',
          paymentMethod: method,
          result,
        });
        
        // Notify parent component
        onPaymentComplete?.(result);
      } else {
        setFlowState({
          step: 'error',
          paymentMethod: method,
          error: result.error || 'Error desconocido',
        });
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setFlowState({
        step: 'error',
        paymentMethod: method,
        error: 'Error interno del sistema',
      });
    }
  };

  const handleClose = () => {
    setFlowState({ step: 'options' });
    onClose();
  };

  const handleRetry = () => {
    if (flowState.paymentMethod) {
      handlePaymentMethodSelect(flowState.paymentMethod);
    }
  };

  const handleSuccessClose = () => {
    setFlowState({ step: 'options' });
    onClose();
  };

  // Show success screen
  if (flowState.step === 'success' && flowState.result) {
    const successData = {
      transactionId: flowState.result.transactionId || 'unknown',
      amount: paymentData.totalAmount,
      currency: paymentData.currency,
      eventName: paymentData.event.name,
      ticketCount: paymentData.quantity,
      paymentMethod: flowState.paymentMethod || 'unknown',
      date: new Date().toISOString(),
    };

    return (
      <PaymentSuccessScreen
        visible={true}
        onClose={handleSuccessClose}
        paymentData={successData}
      />
    );
  }

  // Show error state
  if (flowState.step === 'error') {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <div className="flex-1 bg-black/50 justify-center items-center p-4">
          <div className="bg-background-card rounded-xl p-6 max-w-sm w-full">
            <div className="items-center mb-4">
              <div className="bg-red-500 w-16 h-16 rounded-full items-center justify-center mb-4">
                <span className="text-white text-2xl">✕</span>
              </div>
              <h2 className="text-white text-xl font-bold text-center">
                Error en el pago
              </h2>
            </div>
            
            <p className="text-white-100 text-center mb-6">
              {flowState.error || 'Ocurrió un error durante el procesamiento del pago.'}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-primary p-4 rounded-xl"
              >
                <span className="text-white text-center text-lg font-bold">
                  Intentar de nuevo
                </span>
              </button>
              
              <button
                onClick={handleClose}
                className="w-full bg-background-card p-4 rounded-xl border border-white-200"
              >
                <span className="text-white text-center text-lg font-bold">
                  Cancelar
                </span>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  // Show processing state
  if (flowState.step === 'processing') {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <div className="flex-1 bg-black/50 justify-center items-center p-4">
          <div className="bg-background-card rounded-xl p-6 max-w-sm w-full items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <h2 className="text-white text-xl font-bold text-center mb-2">
              Procesando pago
            </h2>
            <p className="text-white-100 text-center">
              Por favor, espera mientras procesamos tu pago...
            </p>
          </div>
        </div>
      </Modal>
    );
  }

  // Show payment options
  return (
    <PaymentOptionsModal
      visible={visible}
      onClose={handleClose}
      qrVisible={false}
      setQrVisible={() => {}}
      paymentData={paymentData}
      closePayment={handleClose}
      onPaymentMethodSelect={handlePaymentMethodSelect}
    />
  );
};

export default PaymentFlowManager;




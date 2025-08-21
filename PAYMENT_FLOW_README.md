# Payment Flow Implementation

This document describes the complete payment flow implementation for the event ticket booking application.

## Overview

The payment system supports two payment methods:
- **QR Payment**: Generate QR codes for mobile payment apps
- **Card Payment**: Web-based card payment processing

## Components Structure

### Core Payment Components

1. **PaymentOptionsModal** (`components/payment/paymentOptions.tsx`)
   - Main entry point for payment selection
   - Displays QR and Card payment options
   - Handles payment method selection

2. **QrPaymentView** (`components/payment/qrPayment.tsx`)
   - Generates QR codes for mobile payments
   - Handles QR payment verification
   - Saves QR images to gallery
   - Integrates with payment success flow

3. **CardPaymentView** (`components/payment/cardPayment.tsx`)
   - Generates payment URLs for card processing
   - Embeds WebView for payment form
   - Monitors payment completion
   - Handles card payment verification

4. **PaymentSuccessScreen** (`components/payment/PaymentSuccessScreen.tsx`)
   - Displays payment confirmation
   - Shows transaction details
   - Provides next steps guidance
   - Navigation to tickets or continue shopping

### Payment Processing

5. **PaymentProcessor** (`components/payment/PaymentProcessor.tsx`)
   - Core payment processing logic
   - Handles external payment generation
   - Manages payment registration
   - Processes ticket creation
   - Payment verification

6. **PaymentFlowManager** (`components/payment/PaymentFlowManager.tsx`)
   - Orchestrates entire payment flow
   - Manages payment states (options, processing, success, error)
   - Provides unified payment interface
   - Error handling and retry logic

## Payment Flow Steps

### 1. Payment Initiation
```typescript
// From cart or ticket selection
const paymentData = {
  event: eventData,
  ticketTypeId: selectedTicket.id,
  quantity: selectedQuantity,
  totalAmount: calculatedTotal,
  currency: "BOB",
  fullName: userInfo.fullName,
  email: userInfo.email,
  numberedTicketId: selectedSeat?.id || null,
};
```

### 2. Payment Method Selection
- User selects QR or Card payment
- PaymentOptionsModal displays available options
- Selection triggers payment processing

### 3. Payment Processing
```typescript
// QR Payment Flow
1. Generate QR code via external API
2. Display QR code to user
3. User scans with mobile payment app
4. Verify payment status
5. Register payment in system
6. Create tickets

// Card Payment Flow
1. Generate payment URL via external API
2. Open WebView with payment form
3. User completes card payment
4. Monitor payment completion
5. Register payment in system
6. Create tickets
```

### 4. Payment Success
- Display success screen with transaction details
- Clear cart
- Navigate to tickets or continue shopping
- Send confirmation email (backend)

## API Integration

### External Payment Provider (YoPago)
```typescript
// QR Payment Generation
POST https://yopago.com.bo/pay/qr/generateQr
{
  companyCode: "XXNN-D4F4-4J03-27MA",
  codeTransaction: "event-timestamp",
  amount: "100.00",
  currency: "BOB",
  // ... other fields
}

// Card Payment Generation
POST https://yopago.com.bo/pay/api/generateUrl
{
  // Similar payload structure
}
```

### Backend Integration
```typescript
// Payment Registration
POST /api/ticket-payment
{
  amount: 100.00,
  payment_method_id: "payment-method-uuid",
  external_code: "transaction-id",
  status_id: 2, // Success
  // ... other fields
}

// Ticket Creation
POST /api/ticket
{
  event_id: "event-uuid",
  ticket_type_id: "ticket-type-uuid",
  user_id: "user-uuid",
  payment_id: "payment-uuid",
  // ... other fields
}
```

## Usage Examples

### Basic Payment Flow
```typescript
import PaymentFlowManager from '../components/payment/PaymentFlowManager';

const MyComponent = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const handlePaymentComplete = (result) => {
    console.log('Payment completed:', result);
    // Handle post-payment logic
  };

  return (
    <PaymentFlowManager
      visible={showPayment}
      onClose={() => setShowPayment(false)}
      paymentData={paymentData}
      onPaymentComplete={handlePaymentComplete}
    />
  );
};
```

### Cart Integration
```typescript
// In cart screen
const handleBuy = () => {
  const validation = validateCart();
  if (!validation.isValid) {
    Alert.alert("Error", validation.errors.join('\n'));
    return;
  }
  
  const paymentData = {
    event: cart[0].event,
    ticketTypeId: cart[0].ticketId,
    quantity: cart[0].quantity,
    totalAmount: totalAmount(),
    currency: cart[0].currency,
    // ... other fields
  };
  
  setPaymentData(paymentData);
  setShowPayment(true);
};
```

## Error Handling

### Payment Errors
- Network connectivity issues
- External payment provider errors
- Backend registration failures
- Invalid payment data

### User Feedback
- Loading states during processing
- Error messages with retry options
- Success confirmation with next steps
- Transaction ID for support

## Security Considerations

1. **Payment Data Validation**
   - Validate all payment inputs
   - Sanitize user data
   - Verify payment amounts

2. **Transaction Security**
   - Use HTTPS for all API calls
   - Validate payment confirmations
   - Implement proper error handling

3. **User Data Protection**
   - Secure storage of payment tokens
   - Minimal data collection
   - Proper data disposal

## Testing

### Payment Flow Testing
```typescript
// Test payment data
const testPaymentData = {
  event: mockEvent,
  ticketTypeId: "test-ticket-id",
  quantity: 1,
  totalAmount: 10.00,
  currency: "BOB",
  fullName: "Test User",
  email: "test@example.com",
};

// Test payment processing
const result = await paymentProcessor.processPayment(
  testPaymentData,
  'qr'
);
```

### Error Scenarios
- Network failures
- Invalid payment data
- External API errors
- Backend registration failures

## Future Enhancements

1. **Multiple Payment Methods**
   - Bank transfers
   - Digital wallets
   - Cryptocurrency payments

2. **Advanced Features**
   - Payment scheduling
   - Installment payments
   - Refund processing
   - Payment analytics

3. **Integration Improvements**
   - Real-time payment status
   - Webhook notifications
   - Payment reconciliation
   - Fraud detection

## Troubleshooting

### Common Issues

1. **QR Code Not Generating**
   - Check network connectivity
   - Verify API credentials
   - Validate payment data

2. **Card Payment Failing**
   - Check WebView permissions
   - Verify payment URL
   - Monitor payment status

3. **Payment Not Registering**
   - Check backend connectivity
   - Verify API endpoints
   - Validate response data

### Debug Information
```typescript
// Enable debug logging
console.log('Payment Data:', paymentData);
console.log('Payment Result:', result);
console.log('Error Details:', error);
```

## Support

For payment-related issues:
1. Check transaction ID in success screen
2. Verify payment method used
3. Contact support with error details
4. Provide payment confirmation if available




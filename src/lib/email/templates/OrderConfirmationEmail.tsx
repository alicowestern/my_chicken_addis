import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface OrderConfirmationEmailProps {
  customerName: string;
  orderNumber: string;
  totalAmount?: number;
}

export const OrderConfirmationEmail = ({
  customerName = 'Valued Customer',
  orderNumber = 'ORD-12345',
  totalAmount
}: OrderConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your My Chicken Addis Order Confirmation - {orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Order Confirmed!</Heading>
          
          <Text style={text}>
            Hello {customerName},
          </Text>
          
          <Text style={text}>
            Thank you for your order with My Chicken Addis. We have received your order <strong>{orderNumber}</strong> and are preparing it now.
          </Text>
          
          <Section style={orderSection}>
            <Text style={orderText}>
              <strong>Order Number:</strong> {orderNumber}
            </Text>
            {totalAmount && (
              <Text style={orderText}>
                <strong>Total Amount:</strong> {totalAmount.toLocaleString()} ETB
              </Text>
            )}
          </Section>

          <Text style={text}>
            If you selected pickup, we will notify you when it's ready. If you selected delivery, we will contact you shortly with an estimated time.
          </Text>
          
          <Text style={footer}>
            My Chicken Addis Team<br />
            Addis Ababa, Ethiopia
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
  padding: '0 40px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 40px',
};

const orderSection = {
  backgroundColor: '#f4f4f5',
  padding: '24px 40px',
  margin: '20px 0',
};

const orderText = {
  color: '#333',
  fontSize: '16px',
  margin: '4px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 40px',
  marginTop: '32px',
};

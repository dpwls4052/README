"use client";

import { useState, useEffect, useRef } from 'react';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

function generateRandomString() {
  return window.btoa(Math.random().toString()).slice(0, 20);
}

export default function WidgetCheckoutPage({
  amount,
  orderName,
  onReady,
  triggerPayment,
}) {
  const [widgets, setWidgets] = useState(null);
  const [ready, setReady] = useState(false);
  const widgetsRef = useRef(null);

  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
  // const clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'; // toss test client key
  const customerKey = useRef(generateRandomString()).current;

  useEffect(() => {
    async function fetchPaymentWidgets() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        // console.log("Toss Payments SDK loaded:", clientKey);
        const widgetsInstance = tossPayments.widgets({ customerKey });
        setWidgets(widgetsInstance);
        widgetsRef.current = widgetsInstance;
      } catch (error) {
        console.error('Error fetching payment widget:', error);
      }
    }
    fetchPaymentWidgets();
  }, [clientKey, customerKey]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) return;

      try {
        await widgets.setAmount({
          currency: 'KRW',
          value: amount,
        });

        await Promise.all([
          widgets.renderPaymentMethods({
            selector: '#payment-method',
            variantKey: 'DEFAULT',
          }),
          widgets.renderAgreement({
            selector: '#agreement',
            variantKey: 'AGREEMENT',
          }),
        ]);

        setReady(true);
        if (onReady) onReady(true);
      } catch (error) {
        console.error('Error rendering widgets:', error);
      }
    }
    renderPaymentWidgets();
  }, [widgets, amount, onReady]);

  // 금액 변경 시 위젯 업데이트
  useEffect(() => {
    if (widgetsRef.current && ready) {
      widgetsRef.current.setAmount({
        currency: 'KRW',
        value: amount,
      });
    }
  }, [amount, ready]);

  // 외부에서 결제 트리거
  useEffect(() => {
    if (triggerPayment && ready && widgetsRef.current) {
      handlePayment();
    }
  }, [triggerPayment, ready]);

  const handlePayment = async () => {
    // Next.js에서는 process.env.NODE_ENV 사용
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction
      ? `${window.location.origin}`
      : window.location.origin;

    try {
      await widgetsRef.current.requestPayment({
        orderId: generateRandomString(),
        orderName: orderName,
        successUrl: `${window.location.origin}/pay/success`,
        failUrl: `${baseUrl}/pay/fail`,
        customerEmail: 'customer123@gmail.com',
        customerName: '김토스',
      });
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <div>
      <div id="payment-method" className="mb-4"></div>
      <div id="agreement"></div>
    </div>
  );
}
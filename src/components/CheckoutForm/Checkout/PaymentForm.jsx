import React from 'react';
import Reveiw from '../Reveiw';
import {Elements, CardElement, ElementsConsumer} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {Typography, Button, Divider} from '@material-ui/core';
const stripeProimse = loadStripe (process.env.REACT_APP_STRIPE_API_KEY);

const PaymentForm = ({
  checkoutToken,
  back,
  shippingData,
  next,
  onCaptureCheckout,
}) => {
  const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault ();
    if (!stripe || !elements) return;
    const cardElement = elements.getElement (CardElement);
    const {error, paymentMethod} = await stripe.createPaymentMethod ({
      type: 'card',
      card: cardElement,
    });
    if (error) {
      console.log (error);
    } else {
      const orderData = {
        line_items: checkoutToken.live.line_items,
        customer: {
          firstname: shippingData.firstName,
          lastname: shippingData.lastName,
          email: shippingData.email,
        },
        shipping: {
          name: 'International',
          street: shippingData.address1,
          town_city: shippingData.city,
          county_state: shippingData.shippingSubDivsion,
          postal_zip_code: shippingData.zip,
          country: shippingData.shippingCountry,
        },
        fulfillment: {shipping_method: shippingData.shippingOption},
        payment: {
          gateway: 'stripe',
          stripe: {
            payment_method_id: paymentMethod.id,
          },
        },
      };
      onCaptureCheckout (checkoutToken.id, orderData);
      next ();
    }
  };

  return (
    <>
      <Reveiw checkoutToken={checkoutToken} />
      <Divider />
      <Typography variant="h6" gutterBottom style={{margin: '20px 0'}}>
        Payment Method
      </Typography>
      <Elements stripe={stripeProimse}>
        <ElementsConsumer>
          {({elements, stripe}) => (
            <form onSubmit={e => handleSubmit (e, elements, stripe)}>
              <CardElement />
              <br />
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Button variant="outlined" onClick={back} disabled={!stripe}>
                  Back
                </Button>
                <Button variant="contained" type="submit" color="primary">
                  Pay {checkoutToken.live.subtotal.formatted_with_symbol}
                </Button>
              </div>
            </form>
          )}
        </ElementsConsumer>
      </Elements>
    </>
  );
};
export default PaymentForm;

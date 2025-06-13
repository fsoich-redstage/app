import React, { useEffect, useState } from 'react';
import { useLazyMutation, gql } from '@apollo/client';

const CALCULATE_SHIPPING = gql`
  mutation CalculateShipping($product_price_total: Float!, $zipcode: String!) {
    calculateShipping(input: { product_price_total: $product_price_total, zipcode: $zipcode }) {
      shipping_price
    }
  }
`;

export default function ShippingMethodsForm({ cart, availableShippingMethods, onShippingMethodSelect }) {
  const [fulcrumShipping, setFulcrumShipping] = useState(null);
  const [runCalcShipping] = useLazyMutation(CALCULATE_SHIPPING);

  useEffect(() => {
    const total = cart?.prices?.grand_total?.value;
    const zipcode = cart?.shipping_addresses?.[0]?.postcode;

    if (typeof total === 'number' && zipcode) {
      runCalcShipping({
        variables: { product_price_total: total, zipcode },
        onCompleted: (data) => {
          const price = data?.calculateShipping?.shipping_price;
          if (price != null) {
            setFulcrumShipping({
              carrier_code: 'fulcrum',
              method_code: 'fulcrum_qr',
              carrier_title: 'Fulcrum Shipping',
              method_title: 'Envío QR Fulcrum',
              amount: {
                value: price,
                currency: cart.prices?.grand_total?.currency || 'USD'
              }
            });
          }
        }
      });
    }
  }, [cart, runCalcShipping]);

  const methods = [...availableShippingMethods];
  if (fulcrumShipping) methods.push(fulcrumShipping);

  return (
    <div>
      {methods.map((method) => (
        <div key={`${method.carrier_code}_${method.method_code}`}>
          <input
            type="radio"
            name="shippingMethod"
            onChange={() => onShippingMethodSelect(method)}
          />
          <label>
            {method.carrier_title} - {method.method_title} (${method.amount.value})
          </label>
        </div>
      ))}
    </div>
  );
}

import { initializers } from '@dropins/tools/initializer.js';
import { initialize, setFetchGraphQlHeaders } from '@dropins/storefront-checkout/api.js';
import { initializeDropin } from './index.js';
import { fetchPlaceholders } from '../commerce.js';
import { getHeaders } from '../configs.js';
import { h, render } from 'preact';
import { getCart } from '@dropins/storefront-cart';
import { useState, useEffect } from 'preact/hooks';

function FulcrumShipping() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShipping() {
      try {
        const cart = await getCart();
        const total = cart?.prices?.grand_total?.value;
        const address = cart?.shipping_addresses?.[0];
        const zipcode = address?.postcode;

        if (!total || !zipcode) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          'https://393418-845emeraldcentipede-stage.adobeioruntime.net/api/v1/web/app/calculateShipping_object',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_price_total: total, zipcode })
          }
        );

        const data = await response.json();
        setMethods(data.shipping_methods || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchShipping();
  }, []);

  if (loading) return <div>Loading Fulcrum Shipping...</div>;
  if (!methods.length) return <div>No shipping methods available.</div>;

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '20px 0' }}>
      <h3>Fulcrum Shipping</h3>
      {methods.map(method => (
        <div key={method.method_code}>
          {method.method_title} - ${method.amount.toFixed(2)}
        </div>
      ))}
    </div>
  );
}

await initializeDropin(async () => {
  setFetchGraphQlHeaders((prev) => ({ ...prev, ...getHeaders('checkout') }));

  const labels = await fetchPlaceholders();
  const langDefinitions = {
    default: {
      ...labels,
    },
  };

  return initializers.mountImmediately(async () => {
    const result = await initialize();

    const main = document.querySelector('main');
    if (main && !document.querySelector('#fulcrum-shipping-methods')) {
      const container = document.createElement('div');
      container.id = 'fulcrum-shipping-methods';
      main.prepend(container);
      render(h(FulcrumShipping, {}), container);
    }
alert('FD');
    return

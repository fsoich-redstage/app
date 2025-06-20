import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

// Tu endpoint de Fulcrum (ajustalo si cambia el namespace de la action)
const FULCRUM_ENDPOINT = 'https://393418-845emeraldcentipede-stage.adobeioruntime.net/api/v1/web/app/calculateShipping_object';

export default function ShippingMethodSelector({ cart, onShippingMethodSelect }) {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMethods = async () => {
      try {
        // Obtenemos el total y zipcode desde el cart
        const total = cart?.prices?.grand_total?.value || 0;
        const zipcode = cart?.shipping_addresses?.[0]?.postcode || '0000';

        // Llamamos a la API de Fulcrum
        const response = await fetch(FULCRUM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_price_total: total, zipcode })
        });

        const data = await response.json();

        const fulcrumMethods = data?.shipping_methods?.map(method => ({
          carrier_code: method.carrier_code,
          method_code: method.method_code,
          method_title: method.method_title,
          amount: method.amount
        })) || [];

        // Tomamos también los métodos nativos que pueda haber
        const nativeMethods = cart?.shipping_addresses?.[0]?.available_shipping_methods || [];

        setMethods([...nativeMethods, ...fulcrumMethods]);
      } catch (err) {
        console.error('Error fetching Fulcrum Shipping:', err);
        setMethods([]);
      } finally {
        setLoading(false);
      }
    };

    loadMethods();
  }, [cart]);

  if (loading) {
    return <div>Loading Fulcrum Shipping...</div>;
  }

  return (
    <div>
      <h3>Select a Shipping Method</h3>
      <ul>
        {methods.map((method) => (
          <li key={`${method.carrier_code}-${method.method_code}`}>
            <label>
              <input
                type="radio"
                name="shipping_method"
                value={`${method.carrier_code}_${method.method_code}`}
                onChange={() => onShippingMethodSelect(method)}
              />
              {method.method_title} - ${method.amount.toFixed(2)}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

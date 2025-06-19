import { getCart } from '@dropins/storefront-cart';
import { decoratePage } from '@dropins/tools/page-utils';
import { decorateForm } from '@dropins/storefront-checkout';
import { h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

function FulcrumShipping() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCartAndMethods() {
      try {
        const cart = await getCart();

        const total = cart?.prices?.grand_total?.value;
        const address = cart?.shipping_addresses?.[0];
        const zipcode = address?.postcode;

        if (!total || !zipcode) {
          setError("Missing cart data.");
          setLoading(false);
          return;
        }

        const response = await fetch('https://393418-845emeraldcentipede-stage.adobeioruntime.net/api/v1/web/app/calculateShipping_object', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_price_total: total,
            zipcode
          })
        });

        const data = await response.json();
        setMethods(data.shipping_methods || []);
      } catch (err) {
        console.error('Error fetching Fulcrum Shipping:', err);
        setError("Error fetching Fulcrum Shipping");
      } finally {
        setLoading(false);
      }
    }

    fetchCartAndMethods();
  }, []);

  if (loading) return <div>Loading Fulcrum Shipping...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!methods.length) return <div>No Fulcrum Shipping methods available.</div>;

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', marginBottom: '20px' }}>
      <h3>Fulcrum Shipping Options</h3>
      {methods.map(method => (
        <div key={method.method_code}>
          <label>
            <input type="radio" name="fulcrum-shipping" />
            {method.method_title} - ${method.amount.toFixed(2)}
          </label>
        </div>
      ))}
    </div>
  );
}

export default async function decorate(main) {
  await decoratePage(main);

  const container = document.createElement('div');
  container.id = 'fulcrum-shipping-methods';
  main.prepend(container);

  render(h(FulcrumShipping, {}), container);

  await decorateForm(main);
}

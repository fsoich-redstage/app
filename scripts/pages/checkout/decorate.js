import { getCart } from '@dropins/storefront-cart';
import { decoratePage } from '@dropins/tools/page-utils';
import { decorateForm } from '@dropins/storefront-checkout';
import { h, render } from 'preact';
import ShippingMethodSelector from '../../__dropins__/storefront-checkout/components/ShippingMethods/ShippingMethodSelector.js';

export default async function decorate(main) {
  await decoratePage(main);

  const cart = await getCart();

  // Intentamos esperar a que el container de shipping exista en el DOM
  const waitForContainer = async (selector, timeout = 5000) => {
    const pollInterval = 100;
    let elapsed = 0;

    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
          clearInterval(interval);
          resolve(el);
        } else {
          elapsed += pollInterval;
          if (elapsed >= timeout) {
            clearInterval(interval);
            reject(new Error('Shipping container not found.'));
          }
        }
      }, pollInterval);
    });
  };

  try {
    const target = await waitForContainer('[data-testid="checkout-shipping-methods"]');

    target.innerHTML = '';

    render(
      h(ShippingMethodSelector, {
        cart,
        onShippingMethodSelect: (method) => {
          console.log('Fulcrum Shipping selected:', method);
        }
      }),
      target
    );

  } catch (err) {
    console.error('Error injecting Fulcrum Shipping:', err);
  }

  await decorateForm(main);
}

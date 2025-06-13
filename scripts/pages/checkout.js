import { getCart } from '@dropins/storefront-cart';
import { decoratePage } from '@dropins/tools/page-utils';
import { decorateForm } from '@dropins/storefront-checkout';
import ShippingMethodsForm from '../../src/components/Checkout/ShippingMethod/ShippingMethodsForm.js';

export default async function decorate(main) {
  await decoratePage(main);

  const cart = await getCart();

  const shippingContainer = document.createElement('div');
  shippingContainer.id = 'fulcrum-shipping-methods';
  main.prepend(shippingContainer);

  const { h, render } = await import('preact');
  render(
    h(ShippingMethodsForm, {
      cart,
      availableShippingMethods: cart.shipping_addresses?.[0]?.available_shipping_methods || [],
      onShippingMethodSelect: (method) => {
        console.log('✅ Método Fulcrum seleccionado:', method);
        // acá podrías hacer persistencia con API si querés
      },
    }),
    shippingContainer
  );

  await decorateForm(main);
}

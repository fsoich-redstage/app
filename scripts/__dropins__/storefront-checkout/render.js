/*! Copyright 2025 Adobe
All Rights Reserved. */
(function(n,o){try{if(typeof document<"u"){const t=document.createElement("style"),r=o.styleId;for(const e in o.attributes)t.setAttribute(e,o.attributes[e]);t.setAttribute("data-dropin",r),t.appendChild(document.createTextNode(n));const a=document.querySelector('style[data-dropin="sdk"]');if(a)a.after(t);else{const e=document.querySelector('link[rel="stylesheet"], style');e?e.before(t):document.head.append(t)}}}catch(t){console.error("dropin-styles (injectCodeFunction)",t)}})(`.checkout-estimate-shipping{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-xxsmall);align-items:center;color:var(--color-neutral-800)}.checkout-estimate-shipping__label,.checkout-estimate-shipping__price{font:var(--type-body-1-default-font);letter-spacing:var(--type-body-1-default-letter-spacing)}...`,{styleId:"checkout"});

import { jsx as f } from "@dropins/tools/preact-jsx-runtime.js";
import { Render as d } from "@dropins/tools/lib.js";
import "./chunks/state.js";
import "./chunks/transform-store-config.js";
import { events as p } from "@dropins/tools/event-bus.js";
import { c as g } from "./chunks/synchronizeCheckout.js";
import { UIProvider as y } from "@dropins/tools/components.js";
import { useState as b, useEffect as h } from "@dropins/tools/preact-hooks.js";
import "@dropins/tools/fetch-graphql.js";
import "./chunks/store-config.js";
import "@dropins/tools/signals.js";
import "./fragments.js";
import "./chunks/errors.js";

//AGREGADO para registrar el decorate blindado:
import { pages } from '@dropins/tools/page-registry.js';
import { loadTemplate } from '@dropins/tools/page-utils.js';

(async () => {
    try {
        const CheckoutTemplate = await loadTemplate('storefront-checkout/templates/checkout.html');
        pages.register({
            id: 'checkout',
            route: '/checkout',
            template: CheckoutTemplate,
            decorate: async () => {
                try {
                    const decorateModule = await import('../../../pages/checkout/decorate.js');
                    return decorateModule.default;
                } catch (err) {
                    console.error("Error loading decorate.js:", err);
                    return undefined; // sigue el flow igual aunque falle el decorate
                }
            }
        });
    } catch (err) {
        console.error("Error registering checkout page:", err);
    }
})();

export { f as jsx, d as Render };

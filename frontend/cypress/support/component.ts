/* eslint-disable @typescript-eslint/no-namespace */
import { mount } from 'cypress/react';

// Augment the Cypress namespace to include type definitions for mount
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', mount);
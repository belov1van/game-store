/// <reference types="cypress" />

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/login');
  cy.get('input[name="login"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
    }
  }
}

export {};
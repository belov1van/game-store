describe('Footer', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders footer', () => {
    cy.get('.footer-logo').should('be.visible');
    cy.get('.copyright').should('be.visible');
  });
});
describe('Header', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders logo and navigation', () => {
    cy.get('.logo').should('be.visible');
    cy.get('.search-bar input').should('be.visible');
  });
});
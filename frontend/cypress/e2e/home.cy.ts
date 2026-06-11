describe('Home Page', () => {
  it('loads home page', () => {
    cy.visit('/');
    cy.get('.home-container').should('be.visible');
  });
});
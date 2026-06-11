describe('Authentication', () => {
  it('displays login form', () => {
    cy.visit('/login');
    cy.get('input[name="login"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
  });

  it('displays register form', () => {
    cy.visit('/register');
    cy.get('input[name="login"]').should('be.visible');
    cy.get('input[name="mail"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
  });
});
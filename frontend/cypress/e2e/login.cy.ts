describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('displays login form', () => {
    cy.get('input[name="login"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
  });
});
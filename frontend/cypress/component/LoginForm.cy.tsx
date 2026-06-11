import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../src/context/ThemeContext';
import { AuthProvider } from '../../src/context/AuthProvider';
import { CartProvider } from '../../src/context/CartProvider';
import LoginForm from '../../src/components/login/LoginForm';

describe('LoginForm Component', () => {
  it('renders login form', () => {
    cy.mount(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <LoginForm />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
    cy.get('input[name="login"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });
});
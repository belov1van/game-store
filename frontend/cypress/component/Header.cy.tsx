import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../src/context/ThemeContext';
import { CartProvider } from '../../src/context/CartProvider';
import { AuthProvider } from '../../src/context/AuthProvider';
import Header from '../../src/components/header/Header';

describe('Header Component', () => {
  it('renders logo', () => {
    cy.mount(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Header onSearch={() => {}} onCartClick={() => {}} />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
    cy.get('.logo').should('be.visible');
  });
});
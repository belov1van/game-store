import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../src/context/ThemeContext';
import Footer from '../../src/components/footer /Footer';

describe('Footer Component', () => {
  it('renders logo', () => {
    cy.mount(
      <BrowserRouter>
        <ThemeProvider>
          <Footer />
        </ThemeProvider>
      </BrowserRouter>
    );
    cy.get('.footer-logo').should('be.visible');
  });
});
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './Routes/Routes';

function Layout() {
  const location = useLocation();

  // Pages where Navbar and Footer should be hidden
  const hideLayout = ['/login', '/register', '/404', '/admin'];

  // Check if current path matches exactly OR starts with '/admin'
  const shouldHide = hideLayout.some(route =>
    route === location.pathname || location.pathname.startsWith(route)
  );

  return (
    <>
      {!shouldHide && <Navbar />}
      <AppRoutes />
      {!shouldHide && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;

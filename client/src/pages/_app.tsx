import { AppProps } from 'next/app';
import Axios from 'axios';
import { useRouter } from 'next/router';

import { AuthProvider } from '../context/auth';

import '../styles/tailwind.css';
import '../styles/icons.css';

import NavBar from '../components/NavBar';

Axios.defaults.baseURL = 'http://localhost:5000/api';
Axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ['/register', '/login'];
  const authRoute = authRoutes.includes(pathname);

  return (
    <AuthProvider>
      {!authRoute && <NavBar />}
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default App;

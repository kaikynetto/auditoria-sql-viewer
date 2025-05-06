import '../styles/global.css'; // Importando o CSS global
import { StateProvider } from '../context/StateContext';

export default function App({ Component, pageProps }) {
  return (
    // 4. Colocando o Provider aqui para que todos os componentes possam acessar o contexto
    <StateProvider>
      <Component {...pageProps} />
    </StateProvider>
  );
}

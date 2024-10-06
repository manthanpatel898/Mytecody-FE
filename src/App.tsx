import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRouting from './routing/AppRouting';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId='579522450676-m45rt335esul36btglc5g8t72141afgi.apps.googleusercontent.com'>

        <BrowserRouter>
          <AppRouting />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;

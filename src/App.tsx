import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRouting from './routing/AppRouting';

function App() {
  return (
    <>
    <BrowserRouter>
      <AppRouting />
    </BrowserRouter>
  </>
  );
}

export default App;

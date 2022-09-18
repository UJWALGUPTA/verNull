import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Header from './components/header/Header';
import Resources from './pages/Resources/Resources';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/resources' element={<Resources />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

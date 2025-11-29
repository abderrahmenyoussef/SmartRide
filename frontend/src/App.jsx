import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import Auth from './components/Auth/Auth';
import Dashboard from './components/Dashboard/Dashboard';
import TrajetForm from './components/TrajetForm/TrajetForm';
import './App.css';

function App() {
  return (
    <Router>
      <Navigation />
      <main className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/trajets/nouveau" element={<TrajetForm />} />
          <Route path="/trajets/modifier/:id" element={<TrajetForm />} />
          <Route path="/profile" element={<Dashboard />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

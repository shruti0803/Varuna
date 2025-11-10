import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  const [activeTab, setActiveTab] = useState("Routes");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="pt-20 max-w-7xl mx-auto px-6">
        <Dashboard activeTab={activeTab} />
      </main>
      <Footer />
    </div>
  );
}

export default App;

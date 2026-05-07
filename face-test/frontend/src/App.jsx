import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';  // ← 新增导入
import Home from './pages/Home';
import WorkflowMarket from './pages/WorkflowMarket';
import WorkGallery from './pages/WorkGallery';
import ModelLibrary from './pages/ModelLibrary';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Generation from './pages/Generation';
import Dashboard from './pages/Dashboard';


function App() {
  const token = localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workflows" element={<WorkflowMarket />} />
          <Route path="/gallery" element={<WorkGallery />} />
          <Route path="/models" element={<ModelLibrary />} />
          <Route path="/generate" element={<Generation />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/profile"
            element={token ? <UserProfile /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!token ? <Login /> : <Navigate to="/" />}
          />
        </Routes>
      </main>

      <Footer />
      <BackToTop />  {/* ← 新增：回到顶部按钮 */}
    </div>
  );
}

export default App;
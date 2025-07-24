import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PluginProvider } from './contexts/PluginContext';
import ProtectedRoute from './components/ProtectedRoute';
import SideMenu from './components/SideMenu';
import HomePage from './components/HomePage';
import InventoryPage from './components/InventoryPage';
import NewProductPage from './components/NewProductPage';
import EditProductPage from './components/EditProductPage';
import OCRResultPage from './components/OCRResultPage';
import SmartInventoryPage from './components/SmartInventoryPage';
import ProfilePage from './components/ProfilePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PluginStorePage from './components/PluginStorePage';

function App() {
  return (
    <AuthProvider>
      <PluginProvider>
        <BrowserRouter>
        <Routes>
          {/* Auth Routes - No sidebar */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Main App Routes - With sidebar */}
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-bg-main">
                {/* Side Menu - only visible on desktop */}
                <SideMenu />
                
                {/* Main content with left padding on desktop to account for sidebar */}
                <main className="pt-16 md:pt-0 md:pl-64">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/smart-inventory" element={<SmartInventoryPage />} />
                    <Route path="/new-product" element={<NewProductPage />} />
                    <Route path="/edit-product/:id" element={<EditProductPage />} />
                    <Route path="/ocr-result" element={<OCRResultPage />} />
                    <Route path="/pos-integration" element={<div className="p-8"><h1 className="text-2xl font-bold">POS Integration</h1><p className="mt-4">POS system integration module is active and ready to use.</p></div>} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/plugin-store" element={<PluginStorePage />} />
                    {/* Redirect invalid routes to Home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
      </PluginProvider>
    </AuthProvider>
  );
}

export default App;
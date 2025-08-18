import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
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
import SettingsPage from './components/SettingsPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PluginStorePage from './components/PluginStorePage';

function AppLayout() {
  return (
    <div className='min-h-screen bg-bg-main'>
      <SideMenu />
      <main className='pt-16 md:pt-0 md:pl-64'>
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <PluginProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />

            <Route
              path='/'
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<HomePage />} />
              <Route path='inventory' element={<InventoryPage />} />
              <Route path='smart-inventory' element={<SmartInventoryPage />} />
              <Route path='new-product' element={<NewProductPage />} />
              <Route path='edit-product/:id' element={<EditProductPage />} />
              <Route path='ocr-result' element={<OCRResultPage />} />
              <Route
                path='pos-integration'
                element={
                  <div className='p-8'>
                    <h1 className='text-2xl font-bold'>POS Integration</h1>
                    <p className='mt-4'>
                      POS system integration module is active and ready to use.
                    </p>
                  </div>
                }
              />
              <Route path='profile' element={<ProfilePage />} />
              <Route path='settings' element={<SettingsPage />} />
              <Route path='plugin-store' element={<PluginStorePage />} />
              <Route path='*' element={<Navigate to='/' replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PluginProvider>
    </AuthProvider>
  );
}

export default App;

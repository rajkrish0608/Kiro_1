import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/layout/Layout/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CreatePost } from './pages/CreatePost';
import { Feed } from './pages/Feed';
import { PostDetail } from './pages/PostDetail';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth routes without layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main app routes with layout */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Feed />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/search" element={<div>Search Page Coming Soon</div>} />
                <Route path="/communities" element={<div>Communities Page Coming Soon</div>} />
                <Route path="/legends" element={<div>Unsung Legends Coming Soon</div>} />
                <Route path="/pix" element={<div>Pix Page Coming Soon</div>} />
                <Route path="/create" element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                } />
              </Routes>
            </Layout>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

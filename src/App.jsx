import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ScrollToTop from './components/shared/ScrollToTop';
import BackToTop from './components/shared/BackToTop';


// Pages publiques
import HomePage from './pages/public/HomePage';
import CommandePage from './pages/public/CommandePage';
import PaiementSuccesPage from './pages/public/PaiementSuccesPage';
import PaiementAnnulePage from './pages/public/PaiementAnnulePage';
import ContactPage from './pages/public/ContactPage';
import BlogPage from './pages/public/BlogPage';
import BlogArticlePage from './pages/public/BlogArticlePage';
import MentionsLegalesPage from './pages/public/MentionsLegalesPage';
import ConfidentialitePage from './pages/public/ConfidentialitePage';
import CookiePage from './pages/public/CookiePage';
import NotFoundPage from './pages/public/NotFoundPage';

// Pages admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCommandes from './pages/admin/AdminCommandes';
import AdminCommandeDetail from './pages/admin/AdminCommandeDetail';
import AdminServices from './pages/admin/AdminServices';
import AdminContacts from './pages/admin/AdminContacts';
import AdminBlog from './pages/admin/AdminBlog';
import AdminParametres from './pages/admin/AdminParametres';
import AdminPreviews from './pages/admin/AdminPreviews';
import AdminLayout from './components/admin/AdminLayout';
import PrivateRoute from './components/shared/PrivateRoute';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />   {/* ← remet en haut à chaque navigation */}
          <BackToTop />     {/* ← bouton flottant visible après 300px de scroll */}
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<HomePage />} />
            <Route path="/commander" element={<CommandePage />} />
            <Route path="/commander/:serviceId" element={<CommandePage />} />
            <Route path="/paiement/succes/:numero" element={<PaiementSuccesPage />} />
            <Route path="/paiement/annule/:numero" element={<PaiementAnnulePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogArticlePage />} />
            <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
            <Route path="/confidentialite" element={<ConfidentialitePage />} />
            <Route path="/cookies" element={<CookiePage />} />

            {/* ADMIN */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="commandes" element={<AdminCommandes />} />
              <Route path="commandes/:id" element={<AdminCommandeDetail />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="parametres" element={<AdminParametres />} />
              <Route path="previews" element={<AdminPreviews />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
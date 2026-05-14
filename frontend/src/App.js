import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Portfolio from "@/pages/Portfolio";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/lib/auth";
import { ContentProvider } from "@/lib/content";

function Protected({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground font-mono-label text-[10px]">
        Chargement…
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return children;
}

function App() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <div className="App bg-background min-h-screen">
      <div className="grain-overlay" />
      <BrowserRouter>
        <AuthProvider>
          <ContentProvider>
            <Routes>
              <Route path="/" element={<Portfolio />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <Protected>
                    <AdminDashboard />
                  </Protected>
                }
              />
            </Routes>
          </ContentProvider>
        </AuthProvider>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#121212",
            color: "#F5F5F0",
            border: "1px solid #2A2A2A",
            borderRadius: "0px",
            fontFamily: "Outfit, sans-serif",
          },
        }}
      />
    </div>
  );
}

export default App;

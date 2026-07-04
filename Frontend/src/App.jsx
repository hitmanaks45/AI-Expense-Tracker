import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthSuccess from "./pages/AuthSuccess";
import { ThemeProvider } from "./context/ThemeContext";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Budget from "./pages/Budget";
import Analytics from "./pages/Analytics";
import AIGuru from "./pages/AIGuru";
import Profile from "./pages/Profile";
import { ExpenseProvider } from "./context/ExpenseContext";
import GoalPlanner from "./pages/GoalPlanner";
import ReceiptScanner from "./pages/ReceiptScanner";

const RouteLoader = () => (
  <div className="flex min-h-screen items-center justify-center text-sm text-gray-500 dark:text-gray-400">
    Loading...
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <RouteLoader />;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <RouteLoader />;

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
    <Route path="/auth/success" element={<AuthSuccess />} />
    <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="expenses" element={<Expenses />} />
      <Route path="budget" element={<Budget />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="ai-guru" element={<AIGuru />} />
      <Route path="profile" element={<Profile />} />
      <Route path="/goal-planner" element={<GoalPlanner />}/>
      <Route
    path="/receipt-scanner"
    element={<ReceiptScanner />}
/>
        
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ExpenseProvider>
            <AppRoutes />
          </ExpenseProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

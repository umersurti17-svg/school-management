import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SidebarProvider } from './contexts/SidebarContext';
import AppRoutes from './routes/AppRoutes';
import Toast from './components/common/Toast';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <Toast />
          <AppRoutes />
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

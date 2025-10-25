import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardLayout } from "@/components/dashboard-layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FrontDesk from "./pages/FrontDesk";
import Rooms from "./pages/Rooms";
import Bookings from "./pages/Bookings";
import Finance from "./pages/Finance";
import Housekeeping from "./pages/Housekeeping";
import Restaurant from "./pages/Restaurant";
import Employees from "./pages/Employees";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
            <Route path="/front-desk" element={<DashboardLayout><FrontDesk /></DashboardLayout>} />
            <Route path="/rooms" element={<DashboardLayout><Rooms /></DashboardLayout>} />
            <Route path="/bookings" element={<DashboardLayout><Bookings /></DashboardLayout>} />
            <Route path="/finance" element={<DashboardLayout><Finance /></DashboardLayout>} />
            <Route path="/housekeeping" element={<DashboardLayout><Housekeeping /></DashboardLayout>} />
            <Route path="/restaurant" element={<DashboardLayout><Restaurant /></DashboardLayout>} />
            <Route path="/employees" element={<DashboardLayout><Employees /></DashboardLayout>} />
            <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

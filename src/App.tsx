import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import EmployeeLayout from './layouts/EmployeeLayout';

import LoginPage from './pages/Auth/Login';
import TestPage from './Test';

import AdminDashboard from './pages/Admin/Dashboard';

import ClientListPage from './pages/Clients/ClientList';
import ClientDetail from './pages/Clients/ClientDetail';
import TaskListPage from './pages/Tasks/TaskList';
import CreateProjectPage from './pages/Projects/CreateProject';
import ProjectListPage from './pages/Projects/ProjectList';
import ApprovalsPage from './pages/Admin/ApprovalsPage';
import TeamPage from './pages/Admin/TeamPage';
import AdminTimesheetsPage from './pages/Admin/Timesheets';
import AdminReportsPage from './pages/Admin/Reports/AdminReportsPage';
import InvoicesPage from './pages/Admin/Billing/InvoicesPage';
import CreateInvoicePage from './pages/Admin/Billing/CreateInvoicePage';
import PayrollPage from './pages/Admin/Payroll/PayrollPage';
import AvailabilityPage from './pages/Admin/Availability/AvailabilityPage';
import SettingsPage from './pages/Admin/Settings/SettingsPage';

// Employee Pages
import EmployeeDashboard from './pages/Employee/Dashboard';
import TimerPage from './pages/Employee/TimerPage';
import TimesheetPage from './pages/Employee/TimesheetPage';
import MyProjectsPage from './pages/Employee/MyProjects';
import ProjectDetailsPage from './pages/Employee/ProjectDetails';
import MyReportsPage from './pages/Employee/MyReports';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/client-test" element={<ClientListPage />} />

                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />

                <Route path="/admin" element={<DashboardLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="clients" element={<ClientListPage />} />
                  <Route path="clients/:id" element={<ClientDetail />} />
                  <Route path="projects" element={<ProjectListPage />} />
                  <Route path="projects/new" element={<CreateProjectPage />} />
                  <Route path="projects/:id/edit" element={<CreateProjectPage />} />
                  <Route path="tasks" element={<TaskListPage />} />
                  <Route path="approvals" element={<ApprovalsPage />} />
                  <Route path="team" element={<TeamPage />} />
                  <Route path="timesheets" element={<AdminTimesheetsPage />} />
                  <Route path="reports" element={<AdminReportsPage />} />
                  <Route path="billing/invoices" element={<InvoicesPage />} />
                  <Route path="billing/invoices/create" element={<CreateInvoicePage />} />
                  <Route path="billing/invoices/:id" element={<CreateInvoicePage />} />
                  <Route path="payroll" element={<PayrollPage />} />
                  <Route path="availability" element={<AvailabilityPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
// ... (rest remains)



                <Route path="/employee" element={<EmployeeLayout />}>
                  <Route path="dashboard" element={<EmployeeDashboard />} />
                  <Route path="timer" element={<TimerPage />} />
                  <Route path="timesheet" element={<TimesheetPage />} />
                  <Route path="projects" element={<MyProjectsPage />} />
                  <Route path="projects/:id" element={<ProjectDetailsPage />} />
                  <Route path="reports" element={<MyReportsPage />} />
                </Route>
              </Routes>
            </Router>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

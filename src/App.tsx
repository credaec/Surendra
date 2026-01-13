
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import LoginPage from './pages/Auth/Login';

// Admin Pages
import DashboardHelper from './pages/Dashboard';
import ClientListPage from './pages/Clients/ClientList';
import ClientDetail from './pages/Clients/ClientDetail';
import TaskListPage from './pages/Tasks/TaskList';
import CreateProjectPage from './pages/Projects/CreateProject';

// Employee Pages
import EmployeeDashboard from './pages/Employee/Dashboard';
import TimerPage from './pages/Employee/TimerPage';
import TimesheetPage from './pages/Employee/TimesheetPage';
import MyProjectsPage from './pages/Employee/MyProjects';
import MyReportsPage from './pages/Employee/MyReports';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              {/* Redirect root based on role (mock for now, default to login) */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Admin / Main Layout Routes */}
              <Route path="/" element={<DashboardLayout />}>
                <Route path="dashboard" element={<DashboardHelper />} />
                <Route path="clients" element={<ClientListPage />} />
                <Route path="clients/:id" element={<ClientDetail />} />
                <Route path="tasks" element={<TaskListPage />} />
                <Route path="projects/new" element={<CreateProjectPage />} />
              </Route>

              {/* Employee Routes */}
              <Route path="/employee" element={<EmployeeLayout />}>
                <Route path="dashboard" element={<EmployeeDashboard />} />
                <Route path="timer" element={<TimerPage />} />
                <Route path="timesheet" element={<TimesheetPage />} />
                <Route path="projects" element={<MyProjectsPage />} />
                <Route path="reports" element={<MyReportsPage />} />
              </Route>

            </Routes>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

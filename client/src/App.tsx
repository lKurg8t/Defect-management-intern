import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/ProjectsPage';
import ProjectView from './pages/ProjectView/ProjectView';
import SettingsPage from './pages/SettingsPage';
import ReportsPage from './pages/ReportsPage';
import TestersPage from './pages/TestersPage';
import TestCasesPage from './pages/TestCasesPage';
import TestCyclesPage from './pages/TestCyclesPage';
import DefectsPage from './pages/DefectsPage';
import ExecutionsPage from './pages/ExecutionsPage';
import ParametersPage from './pages/ParametersPage';
import Protected from './components/shared/Protected';
import Layout from './components/shared/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Protected routes with layout */}
        <Route path="/" element={<Protected><Layout /></Protected>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:projectId/*" element={<ProjectView />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="testers" element={<TestersPage />} />
          <Route path="test-cases" element={<TestCasesPage />} />
          <Route path="test-cycles" element={<TestCyclesPage />} />
          <Route path="defects" element={<DefectsPage />} />
          <Route path="executions" element={<ExecutionsPage />} />
          <Route path="parameters" element={<ParametersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
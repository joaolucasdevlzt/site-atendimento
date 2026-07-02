import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '@/pages/Login/LoginPage';
import { AtendimentoPage } from '@/pages/Atendimento/AtendimentoPage';
import { AtendimentoFocoPage } from '@/pages/AtendimentoFoco/AtendimentoFocoPage';
import { DashboardPage } from '@/pages/Dashboard/DashboardPage';
import { FilaPage } from '@/pages/Fila/FilaPage';
import { MotoristasPage } from '@/pages/Motoristas/MotoristasPage';
import { HistoricoPage } from '@/pages/Historico/HistoricoPage';
import { PerfilPage } from '@/pages/Perfil/PerfilPage';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import type { ReactNode } from 'react';

/** Envolve uma página em rota protegida. */
function Private({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/atendimento" element={<Private><AtendimentoPage /></Private>} />
      <Route path="/atendimento/foco" element={<Private><AtendimentoFocoPage /></Private>} />
      <Route path="/fila" element={<Private><FilaPage /></Private>} />
      <Route path="/motoristas" element={<Private><MotoristasPage /></Private>} />
      <Route path="/historico" element={<Private><HistoricoPage /></Private>} />
      <Route path="/dashboard" element={<Private><DashboardPage /></Private>} />
      <Route path="/perfil" element={<Private><PerfilPage /></Private>} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

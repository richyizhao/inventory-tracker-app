import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "@/app/routes/protected-route";
import { routedSidebarItems } from "@/app/routes/route-config";
import { AppShell } from "@/components/layouts/app-shell";
import { useAuth } from "@/lib/auth/auth-provider";

export function App() {
  useAuth();

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        {routedSidebarItems.map((item) => (
          <Route
            key={item.path}
            path={item.path.slice(1)}
            element={
              item.requiresAuth ? (
                <ProtectedRoute>
                  <item.component />
                </ProtectedRoute>
              ) : (
                <item.component />
              )
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;

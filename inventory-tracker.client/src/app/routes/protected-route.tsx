import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/lib/auth/auth-provider";

export function ProtectedRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return (
      <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth/auth-provider";
import {
  type DemoDataResult,
} from "@/features/settings/api/settings-api";
import {
  generateDemoDataMutationOptions,
  resetDemoDataMutationOptions,
} from "@/features/settings/api/settings-mutations";

export function useSettingsPage() {
  const { token } = useAuth();
  const [lastResult, setLastResult] = useState<DemoDataResult | null>(null);
  const generateDemoDataMutation = useMutation(
    token
      ? generateDemoDataMutationOptions(token)
      : {
          mutationFn: async () => {
            throw new Error("You need to log in before generating demo data.");
          },
        },
  );
  const resetDemoDataMutation = useMutation(
    token
      ? resetDemoDataMutationOptions(token)
      : {
          mutationFn: async () => {
            throw new Error("You need to log in before resetting demo data.");
          },
        },
  );

  async function handleGenerateDemoData() {
    if (!token) {
      toast.error("You need to log in before generating demo data.");
      return;
    }

    try {
      const result = await generateDemoDataMutation.mutateAsync();
      setLastResult(result);
      toast.success(result.message);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to generate demo data.",
      );
    }
  }

  async function handleResetDemoData() {
    if (!token) {
      toast.error("You need to log in before resetting demo data.");
      return;
    }

    try {
      const result = await resetDemoDataMutation.mutateAsync();
      setLastResult(result);
      toast.success(result.message);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to reset demo data.",
      );
    }
  }

  return {
    handleGenerateDemoData,
    handleResetDemoData,
    isGenerating: generateDemoDataMutation.isPending,
    isResetting: resetDemoDataMutation.isPending,
    lastResult,
  };
}

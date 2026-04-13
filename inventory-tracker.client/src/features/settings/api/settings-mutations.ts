import { mutationOptions } from "@tanstack/react-query";

import {
  generateDemoData,
  resetDemoData,
} from "@/features/settings/api/settings-api";

export function generateDemoDataMutationOptions(token: string) {
  return mutationOptions({
    mutationFn: () => generateDemoData(token),
  });
}

export function resetDemoDataMutationOptions(token: string) {
  return mutationOptions({
    mutationFn: () => resetDemoData(token),
  });
}

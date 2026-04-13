import { RefreshCcw, Sparkles } from "lucide-react";

import { SettingsActionCard } from "@/features/settings/components/settings-action-card";
import { SettingsLastRunCard } from "@/features/settings/components/settings-last-run-card";
import { useSettingsPage } from "@/features/settings/hooks/use-settings-page";

export function SettingsPage() {
  const {
    handleGenerateDemoData,
    handleResetDemoData,
    isGenerating,
    isResetting,
    lastResult,
  } = useSettingsPage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold mb-1 max-md:text-center">
          Configuration
        </h2>
        <p className="text-sm text-muted-foreground max-md:text-center">
          Demo environment with seeded catalog, roles, and realistic data.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SettingsActionCard
          actionLabel="Generate demo data"
          description="Rebuild demo-ready products, transactions, and users using seeded categories and roles."
          detail="This creates a realistic catalog with varied stock levels, recent inventory movement, low-stock edge cases, and populated dashboard activity."
          icon={Sparkles}
          isDisabled={isGenerating || isResetting}
          isLoading={isGenerating}
          loadingLabel="Generating..."
          onAction={handleGenerateDemoData}
        />

        <SettingsActionCard
          actionLabel="Reset demo data"
          description="Remove records created for demonstrations without touching the seeded structure that ships with the app."
          detail="Reset only affects demo-tagged products, transactions, and demo users. Seeded categories, subcategories, and roles remain intact."
          icon={RefreshCcw}
          isDisabled={isGenerating || isResetting}
          isLoading={isResetting}
          loadingLabel="Resetting..."
          onAction={handleResetDemoData}
          variant="outline"
        />
      </div>

      <SettingsLastRunCard lastResult={lastResult} />
    </div>
  );
}

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useDemoDataActions } from "@/features/settings/hooks/use-demo-data-actions"

export function SettingsSeedCard() {
  const {
    isAdminUser,
    isAuthenticated,
    isCreatingDemoData,
    isDeletingDemoData,
    handleCreateDemoData,
    handleDeleteDemoData,
  } = useDemoDataActions()

  return (
    <Card className="m-auto w-full max-w-lg text-center">
      <CardHeader>
        <CardTitle>Demo Data</CardTitle>
        <CardDescription>
          Create or remove the seeded demo users, products, and transactions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          Creating demo data will upsert the demo users and products,
          <br />
          then recreate the demo transactions from the JSON seed files.
        </p>
        <p>
          Removing demo data will delete demo transactions first,
          <br />
          then demo products, and finally demo users.
        </p>
        {!isAuthenticated ? (
          <p>You need to be signed in to use these actions.</p>
        ) : !isAdminUser ? (
          <p>Only the admin user can manage demo data.</p>
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-3 sm:flex-row">
        <Button
          type="button"
          onClick={handleCreateDemoData}
          disabled={!isAdminUser || isCreatingDemoData || isDeletingDemoData}
          className="sm:flex-1"
        >
          {isCreatingDemoData ? "Creating demo data..." : "Create demo data"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDeleteDemoData}
          disabled={!isAdminUser || isCreatingDemoData || isDeletingDemoData}
          className="sm:flex-1"
        >
          {isDeletingDemoData ? "Removing demo data..." : "Remove demo data"}
        </Button>
      </CardFooter>
    </Card>
  )
}

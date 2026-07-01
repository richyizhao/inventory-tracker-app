import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { createDemoData } from "@/features/settings/api/create-demo-data"
import { deleteDemoData } from "@/features/settings/api/delete-demo-data"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

const ADMIN_USERNAME = "admin"

export function SettingsPage() {
  const { isAuthenticated, session } = useAuth()
  const [isCreatingDemoData, setIsCreatingDemoData] = React.useState(false)
  const [isDeletingDemoData, setIsDeletingDemoData] = React.useState(false)

  const isAdminUser =
    isAuthenticated &&
    session?.username.toLowerCase() === ADMIN_USERNAME

  async function handleCreateDemoData() {
    if (!session?.token) {
      toast.error("You need to be signed in to create demo data.")
      return
    }

    setIsCreatingDemoData(true)

    try {
      const response = await createDemoData(session.token)
      toast.success(response.message)
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to create demo data right now."

      toast.error(message)
    } finally {
      setIsCreatingDemoData(false)
    }
  }

  async function handleDeleteDemoData() {
    if (!session?.token) {
      toast.error("You need to be signed in to remove demo data.")
      return
    }

    setIsDeletingDemoData(true)

    try {
      const response = await deleteDemoData(session.token)
      toast.success(response.message)
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to remove demo data right now."

      toast.error(message)
    } finally {
      setIsDeletingDemoData(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <Card className="max-w-3xl">
              <CardHeader>
                <CardTitle>Demo Data</CardTitle>
                <CardDescription>
                  Create or remove the seeded demo users, products, and transactions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Creating demo data will upsert the demo users and products, then recreate
                  the demo transactions from the JSON seed files.
                </p>
                <p>
                  Removing demo data will delete demo transactions first, then demo products,
                  and finally demo users.
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
          </div>
        </div>
      </div>
    </div>
  )
}

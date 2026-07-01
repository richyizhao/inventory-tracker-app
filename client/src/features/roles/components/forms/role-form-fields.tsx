import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { rolePermissionPageOptions } from "@/features/roles/lib/role-config"
import type { RoleFormValues } from "@/features/roles/types/roles"

export function RoleFormFields({
  error,
  idPrefix,
  isSubmitting,
  onNameChange,
  onPermissionChange,
  values,
}: {
  error: string
  idPrefix: string
  isSubmitting: boolean
  onNameChange: (value: string) => void
  onPermissionChange: (
    page: RoleFormValues["permissions"][number]["page"],
    field: "canView" | "canEdit",
    checked: boolean
  ) => void
  values: RoleFormValues
}) {
  return (
    <div className="space-y-4 pb-4">
      <div className="flex flex-col gap-2">
        <label htmlFor={`${idPrefix}-name`} className="text-sm font-medium">
          Role name
        </label>
        <Input
          id={`${idPrefix}-name`}
          value={values.name}
          onChange={(event) => onNameChange(event.target.value)}
          disabled={isSubmitting}
          placeholder="Role name"
        />
      </div>
      <div className="overflow-hidden rounded-lg border">
        <div className="grid grid-cols-[minmax(0,1fr)_72px_72px] gap-x-4 border-b bg-muted/50 px-4 py-3 text-sm font-medium">
          <div>Page</div>
          <div className="text-center">View</div>
          <div className="text-center">Edit</div>
        </div>
        <div className="divide-y">
          {rolePermissionPageOptions.map(({ page, label }) => {
            const permission = values.permissions.find(
              (currentPermission) => currentPermission.page === page
            )

            if (!permission) {
              return null
            }

            return (
              <div
                key={page}
                className="grid grid-cols-[minmax(0,1fr)_72px_72px] items-center gap-x-4 px-4 py-3"
              >
                <div className="text-sm">{label}</div>
                <div className="flex justify-center">
                  <Checkbox
                    checked={permission.canView}
                    onCheckedChange={(checked) =>
                      onPermissionChange(page, "canView", checked === true)
                    }
                    disabled={isSubmitting}
                    aria-label={`${label} view permission`}
                  />
                </div>
                <div className="flex justify-center">
                  <Checkbox
                    checked={permission.canEdit}
                    onCheckedChange={(checked) =>
                      onPermissionChange(page, "canEdit", checked === true)
                    }
                    disabled={isSubmitting}
                    aria-label={`${label} edit permission`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}
    </div>
  )
}

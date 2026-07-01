import * as React from "react"

import type { RoleFormValues } from "@/features/roles/types/roles"

export function useRoleForm(initialValues: RoleFormValues) {
  const [values, setValues] = React.useState<RoleFormValues>(initialValues)

  React.useEffect(() => {
    setValues(initialValues)
  }, [initialValues])

  function setName(value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      name: value,
    }))
  }

  function setPermission(
    page: RoleFormValues["permissions"][number]["page"],
    field: "canView" | "canEdit",
    checked: boolean
  ) {
    setValues((currentValues) => ({
      ...currentValues,
      permissions: currentValues.permissions.map((permission) =>
        permission.page === page
          ? {
              ...permission,
              [field]: checked,
            }
          : permission
      ),
    }))
  }

  return {
    setName,
    setPermission,
    setValues,
    values,
  }
}

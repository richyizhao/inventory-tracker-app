import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { UserRoleOption } from "@/features/roles/types/roles"
import type { UserFormValues } from "@/features/users/types/users"

export function UserFormFields({
  error,
  idPrefix,
  isPasswordRequired,
  isLoadingRoles,
  isSubmitting,
  onFieldChange,
  roles,
  values,
}: {
  error: string
  idPrefix: string
  isPasswordRequired: boolean
  isLoadingRoles: boolean
  isSubmitting: boolean
  onFieldChange: <TKey extends keyof UserFormValues>(
    key: TKey,
    value: UserFormValues[TKey]
  ) => void
  roles: UserRoleOption[]
  values: UserFormValues
}) {
  return (
    <FieldGroup>
      <Field>
        <Label htmlFor={`${idPrefix}-display-name`}>Display name</Label>
        <Input
          id={`${idPrefix}-display-name`}
          value={values.displayName}
          onChange={(event) => onFieldChange("displayName", event.target.value)}
          disabled={isSubmitting}
          required
        />
      </Field>
      <Field>
        <Label htmlFor={`${idPrefix}-username`}>Username</Label>
        <Input
          id={`${idPrefix}-username`}
          value={values.username}
          onChange={(event) => onFieldChange("username", event.target.value)}
          disabled={isSubmitting}
          required
        />
      </Field>
      <Field>
        <Label htmlFor={`${idPrefix}-password`}>Password</Label>
        <Input
          id={`${idPrefix}-password`}
          type="password"
          value={values.password}
          onChange={(event) => onFieldChange("password", event.target.value)}
          disabled={isSubmitting}
          required={isPasswordRequired}
        />
      </Field>
      <Field>
        <Label htmlFor={`${idPrefix}-email`}>Email</Label>
        <Input
          id={`${idPrefix}-email`}
          type="email"
          value={values.email}
          onChange={(event) => onFieldChange("email", event.target.value)}
          disabled={isSubmitting}
          required
        />
      </Field>
      <Field>
        <Label htmlFor={`${idPrefix}-role`}>Role</Label>
        <Select
          value={values.selectedRoleName}
          onValueChange={(value) => {
            if (value !== null) {
              onFieldChange("selectedRoleName", value)
            }
          }}
        >
          <SelectTrigger
            id={`${idPrefix}-role`}
            className="w-full"
            disabled={isLoadingRoles || isSubmitting}
          >
            <SelectValue
              placeholder={isLoadingRoles ? "Loading roles..." : "Select a role"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.name}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <FieldError>{error}</FieldError>
    </FieldGroup>
  )
}

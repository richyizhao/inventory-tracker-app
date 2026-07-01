import * as React from "react"

import { SEEDED_ADMIN_USERNAME } from "@/config/app-config"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { getCurrentUserProfile } from "@/features/users/api/get-current-user-profile"
import { updateCurrentUserProfile } from "@/features/users/api/update-current-user-profile"
import { useUserForm } from "@/features/users/hooks/use-user-form"
import { createEmptyUserFormValues } from "@/features/users/lib/user-form"
import { dispatchUsersRefresh } from "@/lib/refresh-events"
import type { CurrentUserProfile } from "@/features/users/types/users"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

const initialFormValues = createEmptyUserFormValues()

export function usePersonalProfile() {
  const { session, updateSessionUsername } = useAuth()
  const isAdminUser = session?.username.toLowerCase() === SEEDED_ADMIN_USERNAME
  const { setField, setValues, values } = useUserForm(initialFormValues)
  const [profile, setProfile] = React.useState<CurrentUserProfile | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    if (!session?.token) {
      setProfile(null)
      setValues(initialFormValues)
      setIsLoading(false)
      return
    }

    let isCancelled = false
    setIsLoading(true)
    setError("")

    getCurrentUserProfile(session.token)
      .then((nextProfile) => {
        if (isCancelled) {
          return
        }

        setProfile(nextProfile)
        setValues({
          displayName: nextProfile.displayName,
          username: nextProfile.username,
          email: nextProfile.email,
          selectedRoleName: "",
          password: "",
        })
      })
      .catch((loadError: unknown) => {
        if (!isCancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load your profile right now."
          )
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [session?.token, setValues])

  async function submitProfileUpdate() {
    if (!session?.token) {
      const message = "You need to be signed in to update your profile."
      setError(message)
      toast.error(message)
      return false
    }

    if (isAdminUser) {
      const message = "Cannot change admin profile."
      setError(message)
      toast.error(message)
      return false
    }

    setIsSubmitting(true)

    try {
      await updateCurrentUserProfile(
        {
          displayName: values.displayName,
          username: values.username,
          email: values.email,
          password: values.password || undefined,
        },
        session.token
      )

      setProfile((currentProfile) =>
        currentProfile
          ? {
              ...currentProfile,
              displayName: values.displayName,
              username: values.username,
              email: values.email,
            }
          : currentProfile
      )
      setField("password", "")
      updateSessionUsername(values.username)
      dispatchUsersRefresh()
      toast.success("Updated your profile")
      return true
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to update your profile right now."

      setError(message)
      toast.error(message)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    error,
    isAdminUser,
    isLoading,
    isSubmitting,
    profile,
    setError,
    setField,
    submitProfileUpdate,
    values,
  }
}

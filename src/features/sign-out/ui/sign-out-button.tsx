import { IconButton, LogoutIcon } from '@/shared/ui'
import { useSignOut } from '../model/use-sign-out'

export function SignOutButton() {
  const signOut = useSignOut()
  return <IconButton icon={LogoutIcon} label="Выйти" onClick={signOut} />
}

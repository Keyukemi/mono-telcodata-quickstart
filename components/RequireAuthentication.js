// components/RequireAuthentication.js
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import LoadingSpinner from './LoadingSpinner'

const RequireAuthentication = ({ children }) => {
  const { status } = useSession()
  const isUserLoaded = status === 'loaded'
  const router = useRouter()

  useEffect(() => {
    if (isUserLoaded) {
      if (!session) {
        router.push('/login')
      }
    }
  }, [isUserLoaded, router])

  if (isUserLoaded && !session) {
    
    return <LoadingSpinner/>
  }

  return children
}

export default RequireAuthentication

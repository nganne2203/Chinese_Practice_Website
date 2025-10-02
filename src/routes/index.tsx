import { Routes } from 'react-router-dom'
import { getPublicRoutes } from './PublicRoutes'

export const AppRoutes = () => {
  return (
    <Routes>
      {getPublicRoutes()}
    </Routes>
  )
}

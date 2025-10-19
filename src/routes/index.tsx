import { Routes } from 'react-router'
import { getPublicRoutes } from './PublicRoutes'

export const AppRoutes = () => {
    return (
        <Routes>
            {getPublicRoutes()}
        </Routes>
    )
}

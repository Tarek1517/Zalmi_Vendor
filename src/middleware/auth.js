import { useAuthStore } from '@/stores/useAuthStore.js'
export default (to, from, next) => {
    const auth = useAuthStore()
    const authProtectedRoutes = ['Dashboard', 'OrderInvoice','OrderSuccess']
    const isAuthProtected = authProtectedRoutes.includes(to.name)
    if (!auth.isLoggedIn && isAuthProtected) {
        next({ 
            name: 'Login',
            query: { redirect: to.fullPath }
        })
    } else {
        next()
    }
}

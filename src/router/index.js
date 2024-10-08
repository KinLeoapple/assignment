import {createRouter, createWebHistory} from 'vue-router'
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ReservationView from "@/views/ReservationView.vue";
import BlogView from "@/views/BlogView.vue";

const isLogin = () => {
    const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    const currentAccount = JSON.parse(localStorage.getItem("currentAccount") || '{"name": "", "password": ""}');
    const account = accounts.find((account) => account.username === currentAccount.username);
    if (account) {
        return account.password === currentAccount.password;
    } else {
        return false;
    }
}

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/reservation',
        name: 'Reservation',
        component: ReservationView,
        beforeEnter: (to, from, next) => {
            if (isLogin()) {
                next();
            } else {
                next({ name: 'Login' });
            }
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView
    },
    {
        path: '/blogs',
        name: 'Blogs',
        component: BlogView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router
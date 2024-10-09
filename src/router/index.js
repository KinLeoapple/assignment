import {createRouter, createWebHistory} from 'vue-router'
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ReservationView from "@/views/ReservationView.vue";
import BlogView from "@/views/BlogView.vue";
import {collection, getDocs, query, where} from "firebase/firestore";
import db from "@/firebase/db.js";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import MapView from "@/views/MapView.vue";
import WeatherView from "@/views/WeatherView.vue";

const isLogin = () => {
    return new Promise((resolve) => {
        const currentAccount = JSON.parse(localStorage.getItem("currentAccount") || '{"username": ""}');
        try {
            const q = query(collection(db, "users"), where("username", "==", currentAccount.username));
            getDocs(q).then(users => {
                if (users.size > 0) {
                    users.forEach((user) => {
                        if (user.data().username === currentAccount.username) {
                            signInWithEmailAndPassword(getAuth(), user.data().email, user.data().password)
                                .then(() => {
                                    console.log("Firebase Login Successful!");
                                    resolve(true);
                                })
                                .catch(error => {
                                    console.log(error.code);
                                    resolve(false);
                                });
                        } else {
                            resolve(false);
                        }
                    });
                }
            });
        } catch (e) {
            console.error(e);
            resolve(false);
        }
    })
}

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView,
    },
    {
        path: '/reservation',
        name: 'Reservation',
        component: ReservationView,
        beforeEnter: (to, from, next) => {
            isLogin().then(r => {
                if (r) {
                    next();
                } else {
                    next({name: 'Login'});
                }
            })
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView,
    },
    {
        path: '/blogs',
        name: 'Blogs',
        component: BlogView,
    },
    {
        path: '/map',
        name: 'Map',
        component: MapView,
    },
    {
        path: '/weather',
        name: 'Weather',
        component: WeatherView,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router
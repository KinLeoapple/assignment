import {collection, getDocs, query, where} from "firebase/firestore";
import db from "@/firebase/db.js";

export const checkOnline = async (name) => {
    const q = query(collection(db, "session"), where("username", "==", name));
    const sessions = await getDocs(q);
    let isOnline = false;
    sessions.forEach((session) => {
        if (session.data().username === name) {
            let now = new Date().getTime();
            let pass = Number(session.data().heartbeat);
            isOnline = (now - pass) <= 5 * 60 * 1000; // offline if more than 5 min
        }
    });
    console.log(isOnline);
    return isOnline;
}
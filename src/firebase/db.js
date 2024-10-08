import {getFirestore} from "firebase/firestore";
import {initDB} from "@/firebase/init.js";

initDB;
const db = getFirestore();
export default db;
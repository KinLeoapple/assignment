<script setup>
import AuthorizationLinkBox from "@/components/AuthorizationLinkBox.vue";
import AuthorizationError from "@/components/AuthorizationError.vue";
import {ref} from "vue";
import {checkStr} from "@/assets/js/checkStr.js";
import {collection, getDocs, query, where} from "firebase/firestore";
import db from "@/firebase/db.js";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {hash} from "@/assets/js/hash.js";

document.head.getElementsByTagName("title")[0].innerText = checkStr("Login");

const auth = getAuth();

const findEmail = async (email) => {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const emails = await getDocs(q);
    return emails.size > 0
  } catch (e) {
    console.error(e);
    return true;
  }
}

const formData = ref({
  email: "",
  password: ""
});

const errors = ref({
  email: null,
  password: null
});

const validateEmail = async (blur) => {
  let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  if (!reg.test(formData.value.email)) {
    if (blur) errors.value.email = "Email format is not valid";
  } else if (await findEmail(formData.value.email) === false) {
    if (blur) errors.value.username = "Account does not exists";
  } else {
    errors.value.email = null;
  }
}

const validatePassword = (blur) => {
  if (formData.value.password.length < 10) {
    if (blur) errors.value.password = "Password must be at least 10 characters";
  } else {
    errors.value.password = null;
  }
}

const submitForm = async () => {
  await validateEmail(true);
  validatePassword(true);
  if (!errors.value.email && !errors.value.password) {
    try {
      tryLogin().then(r => {
        if (r) {
          storeCurrentAccount();
          clearForm();
          window.location.replace("/");
        } else {
          errors.value.email = "Login failed";
          errors.value.password = "Login failed";
        }
      })
    } catch (_) {

    }
  }
}

const tryLogin = () => {
  return new Promise(resolve => {
    signInWithEmailAndPassword(auth, formData.value.email, hash(formData.value.password))
        .then(data => {
          console.log("Firebase Login Successful!");
          resolve(true);
        })
        .catch(error => {
          console.log(error.code);
          resolve(false);
        });
  });
}

const storeCurrentAccount = async () => {
  try {
    const q = query(collection(db, "users"), where("email", "==", formData.value.email));
    const emails = await getDocs(q);
    emails.forEach(email => {
      if (email.data().email === formData.value.email) {
        localStorage.setItem("currentAccount", JSON.stringify({
            username:email.data().username
        }));
      }
    });
  } catch (e) {
    console.error(e);
  }
}

const clearForm = () => {
  formData.value.username = "";
  formData.value.password = "";
}
</script>

<template>
  <form class="mt-3 container-fluid col-6 d-flex flex-column gap-4 p-5 bg-body-secondary border rounded"
        @submit.prevent="submitForm">
    <h1 class="mb-1 font-monospace text-center">Login</h1>
    <!-- Email -->
    <div class="row">
      <label for="loginName" class="form-label">Email</label>
      <input type="text" maxlength="20" class="form-control" id="loginName"
             @blur="() => validateEmail(true)"
             @input="() => validateEmail(false)"
             v-model="formData.email">
      <AuthorizationError :error-msg="errors.email"/>
    </div>
    <!-- Password -->
    <div class="row">
      <label for="loginPassword" class="form-label">Password</label>
      <input type="password" maxlength="30" class="form-control" id="loginPassword"
             @blur="() => validatePassword(true)"
             @input="() => validatePassword(false)"
             v-model="formData.password">
      <AuthorizationError :error-msg="errors.password"/>
    </div>
    <div class="row justify-content-end">
      <div class="d-grid gap-2 d-md-flex justify-content-md-end" style="padding: 0">
        <button type="submit" class="btn btn-primary">Login</button>
      </div>
    </div>
  </form>
  <AuthorizationLinkBox msg="New to here?" link="/register" action-msg="Create an account"/>
</template>

<style scoped>

</style>
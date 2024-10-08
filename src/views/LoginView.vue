<script setup>
import AuthorizationLinkBox from "@/components/AuthorizationLinkBox.vue";
import AuthorizationError from "@/components/AuthorizationError.vue";
import {computed, ref} from "vue";
import {checkStr} from "@/assets/js/checkStr.js";
import {collection, getDocs, query, where} from "firebase/firestore";
import db from "@/firebase/db.js";

document.head.getElementsByTagName("title")[0].innerText = checkStr("Login");

const findUser = async (name) => {
  try {
    const q = query(collection(db, "users"), where("username", "==", "Leo"));
    const users = await getDocs(q);
    return users.size > 0
  } catch (e) {
    console.error(e);
    return true;
  }
}

const formData = ref({
  username: "",
  password: ""
});

const errors = ref({
  username: null,
  password: null
});

const validateName = async (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = "Name must be at least 3 characters";
  } else if (await findUser(formData.value.username) === false) {
    if (blur) errors.value.username = "Account does not exists";
  } else {
    errors.value.username = null;
  }
}

const validatePassword = (blur) => {
  if (formData.value.password.length < 10) {
    if (blur) errors.value.password = "Password must be at least 10 characters";
  } else {
    errors.value.password = null;
  }
}

const submitForm = () => {
  validateName(true);
  validatePassword(true);

  if (!errors.value.username && !errors.value.password) {
    try {
      if (tryLogin()) {
        storeCurrentAccount();
        clearForm();
        window.location.replace("/");
      } else {
        errors.value.password = "Password does not match";
      }
    } catch (_) {

    }
  }
}

const tryLogin = () => {
  const account = accounts.value.find((account) => account.username === formData.value.username);
  if (account) {
    return account.password === formData.value.password;
  } else {
    return false;
  }
}

const storeCurrentAccount = () => {
  localStorage.setItem("currentAccount", JSON.stringify(formData.value));
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
    <!-- Name -->
    <div class="row">
      <label for="loginName" class="form-label">Name</label>
      <input type="text" maxlength="20" class="form-control" id="loginName"
             @blur="() => validateName(true)"
             @input="() => validateName(false)"
             v-model="formData.username">
      <AuthorizationError :error-msg="errors.username"/>
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
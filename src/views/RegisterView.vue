<script setup>
import AuthorizationLinkBox from "@/components/AuthorizationLinkBox.vue";
import AuthorizationError from "@/components/AuthorizationError.vue";
import {computed, ref} from "vue";
import {useRouter} from "vue-router";
import {checkStr} from "@/assets/js/checkStr.js";

const router = useRouter();

document.head.getElementsByTagName("title")[0].innerText = checkStr("Register");

const accounts = computed(() => {
  return JSON.parse(localStorage.getItem("accounts") || "[]");
});

const formData = ref({
  username: "",
  role: "",
  password: "",
  confirmPassword: ""
});

const errors = ref({
  username: null,
  role: null,
  password: null,
  confirmPassword: null
});

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = "Name must be at least 3 characters";
  } else if (accounts.value.find((account) => account.username === formData.value.username) !== undefined) {
    if (blur) errors.value.username = "Account already exists";
  } else {
    errors.value.username = null;
  }
}

const validateRole = () => {
  if (formData.value.role === "" || formData.value.role === null || formData.value.role === undefined) {
    errors.value.role = "Must select one role";
  } else {
    errors.value.role = null;
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password;
  const minLength = 10;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters`;
  } else if (!hasUppercase) {
    if (blur) errors.value.password = `Password must contain at least one uppercase letter`;
  } else if (!hasLowercase) {
    if (blur) errors.value.password = `Password must contain at least one lowercase letter`;
  } else if (!hasNumber) {
    if (blur) errors.value.password = `Password must contain at least one number`;
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = `Password must contain at least one special character`;
  } else {
    errors.value.password = null;
  }
}

const validateConfirmPassword = (blur) => {
  const password = formData.value.password;
  const confirmPassword = formData.value.confirmPassword;

  if (password !== confirmPassword) {
    if (blur) errors.value.confirmPassword = "Two passwords must match";
  } else {
    errors.value.confirmPassword = null;
  }
}

const submitForm = () => {
  validateName(true);
  validateRole();
  validatePassword(true);
  validateConfirmPassword(true);

  if (!errors.value.username && !errors.value.role && !errors.value.password && !errors.value.confirmPassword) {
    try {
      storeAccount();
      clearForm();
      router.push("/login");
    } catch (_) {

    }
  }
}

const storeAccount = () => {
  accounts.value.push({
    username: formData.value.username,
    role: formData.value.role,
    password: formData.value.password,
  });
  localStorage.setItem("accounts", JSON.stringify(accounts.value));
}

const clearForm = () => {
  formData.value.username = "";
  formData.value.role = "";
  formData.value.password = "";
  formData.value.confirmPassword = "";
}
</script>

<template>
  <form class="mt-3 container-fluid col-6 d-flex flex-column gap-4 p-5 bg-body-secondary border rounded"
        @submit.prevent="submitForm">
    <h1 class="mb-1 font-monospace text-center">Register</h1>
    <!-- Name -->
    <div class="row">
      <label for="registerName" class="form-label">Name</label>
      <input type="text" maxlength="20" class="form-control" id="registerName"
             @blur="() => validateName(true)"
             @input="() => validateName(false)"
             v-model="formData.username">
      <AuthorizationError :error-msg="errors.username"/>
    </div>
    <!-- Role -->
    <div class="row">
      <label for="registerRole" class="form-label">Role</label>
      <select class="form-select" id="registerRole" v-model="formData.role">
        <option disabled selected value style="display: none">Select Your Role</option>
        <option value="1">Member</option>
        <option value="2">Psychotherapist</option>
      </select>
      <AuthorizationError :error-msg="errors.role"/>
    </div>
    <!-- Password -->
    <div class="row">
      <label for="registerPassword" class="form-label">Password</label>
      <input type="password" maxlength="30" class="form-control" id="registerPassword"
             @blur="() => validatePassword(true)"
             @input="() => validatePassword(false)"
             v-model="formData.password">
      <AuthorizationError :error-msg="errors.password"/>
    </div>
    <!-- Confirm Password -->
    <div class="row">
      <label for="registerConfirmPassword" class="form-label">Confirm Password</label>
      <input type="password" maxlength="30" class="form-control" id="registerConfirmPassword"
             @blur="() => validateConfirmPassword(true)"
             @input="() => validateConfirmPassword(false)"
             v-model="formData.confirmPassword">
      <AuthorizationError :error-msg="errors.confirmPassword"/>
    </div>
    <div class="row justify-content-end">
      <div class="d-grid gap-2 d-md-flex justify-content-md-end" style="padding: 0">
        <button type="submit" class="btn btn-primary">Submit</button>
      </div>
    </div>
  </form>
  <AuthorizationLinkBox msg="Already have an account?" link="/login" action-msg="Login"/>
</template>

<style scoped>

</style>
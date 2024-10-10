<script setup>
import AuthorizationLinkBox from "@/components/AuthorizationLinkBox.vue";
import AuthorizationError from "@/components/AuthorizationError.vue";
import {ref} from "vue";
import {useRouter} from "vue-router";
import {checkStr} from "@/assets/js/checkStr.js";
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import {sendEmail} from "@/assets/js/email.js";
import {collection, addDoc, query, where, getDocs} from "firebase/firestore";
import db from "@/firebase/db.js";
import {hash} from "@/assets/js/hash.js";

const auth = getAuth();

const router = useRouter();

document.head.getElementsByTagName("title")[0].innerText = checkStr("Register");

const formData = ref({
  username: "",
  role: "",
  email: "",
  password: "",
  confirmPassword: ""
});

const errors = ref({
  username: null,
  role: null,
  email: null,
  password: null,
  confirmPassword: null
});

const findUser = async (name) => {
  try {
    const q = query(collection(db, "users"), where("username", "==", name));
    const users = await getDocs(q);
    return users.size > 0
  } catch (e) {
    console.error(e);
    return true;
  }
}

const validateName = async (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = "Name must be at least 3 characters";
  } else if (await findUser(formData.value.username) === true) {
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

const validateEmail = (blur) => {
  let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  if (!reg.test(formData.value.email)) {
    if (blur) errors.value.email = "Email format is not valid";
  } else {
    errors.value.email = null;
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

const submitForm = async () => {
  await validateName(true);
  validateRole();
  validateEmail(true);
  validatePassword(true);
  validateConfirmPassword(true);

  if (!errors.value.username &&
      !errors.value.role &&
      !errors.value.email &&
      !errors.value.password &&
      !errors.value.confirmPassword
  ) {
    try {
      storeAccount().then(r => {
        if (r) {
          addDoc(collection(db, "users"), {
            username: formData.value.username,
            role: formData.value.role,
            email: formData.value.email,
            password: hash(formData.value.password),
          }).then(() => {
            addDoc(collection(db, "session"), {
              username: formData.value.username,
              heartbeat: new Date().getTime(),
            }).then(() => {
              sendEmail(
                  formData.value.username,
                  "Congratulations! You have successfully created an account!",
                  formData.value.email);
              clearForm();
              router.push("/login");
            })
          });
        }
      });
    } catch (_) {

    }
  }
}

const storeAccount = () => {
  return new Promise(resolve => {
    createUserWithEmailAndPassword(auth, formData.value.email, hash(formData.value.password))
        .then(data => {
          console.log("Firebase Register Successful!");
          resolve(true);
        })
        .catch(error => {
          console.log(error.code);
          if (error.code.includes("email-already-in-use"))
            errors.value.email = "Email already in use";
          resolve(false);
        });
  });
}

const clearForm = () => {
  formData.value.username = "";
  formData.value.role = "";
  formData.value.email = "";
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
    <!-- Email -->
    <div class="row">
      <label for="registerEmail" class="form-label">Email</label>
      <input type="text" maxlength="100" class="form-control" id="registerEmail"
             @blur="() => validateEmail(true)"
             @input="() => validateEmail(false)"
             v-model="formData.email">
      <AuthorizationError :error-msg="errors.email"/>
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
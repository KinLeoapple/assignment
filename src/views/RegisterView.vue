<script setup>
import AuthorizationLinkBox from "@/components/AuthorizationLinkBox.vue";

document.head.getElementsByTagName("title")[0].innerText = "Register";
</script>

<template>
  <div class="mt-3 container-fluid col-6 d-flex flex-column gap-4 p-5 bg-body-secondary border rounded">
    <h1 class="mb-1 font-monospace text-center">Register</h1>
    <!-- Name -->
    <div class="row">
      <label for="registerName" class="form-label">Name</label>
      <input type="text" maxlength="20" class="form-control" id="registerName">
    </div>
    <!-- Role -->
    <div class="row">
      <label for="registerRole" class="form-label">Role</label>
      <select class="form-select" id="registerRole">
        <option disabled selected value style="display: none">Select Your Role</option>
        <option value="1">Member</option>
        <option value="2">Psychotherapist</option>
      </select>
    </div>
    <!-- Password -->
    <div class="row">
      <label for="registerPassword" class="form-label">Password</label>
      <input type="password" maxlength="30" class="form-control" id="registerPassword">
    </div>
    <!-- Confirm Password -->
    <div class="row">
      <label for="registerConfirmPassword" class="form-label">Confirm Password</label>
      <input type="password" maxlength="30" class="form-control" id="registerConfirmPassword">
    </div>
    <div class="row justify-content-end">
      <div class="d-grid gap-2 d-md-flex justify-content-md-end" style="padding: 0">
        <button type="submit" class="btn btn-primary">Submit</button>
      </div>
    </div>
  </div>
  <AuthorizationLinkBox msg="Already have an account?" link="/login" action-msg="Login"/>
</template>

<style scoped>

</style>
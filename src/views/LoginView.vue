<script setup>
import AuthorizationLinkBox from "@/components/AuthorizationLinkBox.vue";

document.head.getElementsByTagName("title")[0].innerText = "Login";
</script>

<template>
  <div class="mt-3 container-fluid col-6 d-flex flex-column gap-4 p-5 bg-body-secondary border rounded">
    <h1 class="mb-1 font-monospace text-center">Login</h1>
    <!-- Name -->
    <div class="row">
      <label for="loginName" class="form-label">Name</label>
      <input type="text" maxlength="20" class="form-control" id="loginName">
    </div>
    <!-- Password -->
    <div class="row">
      <label for="loginPassword" class="form-label">Password</label>
      <input type="password" maxlength="30" class="form-control" id="loginPassword">
    </div>
    <div class="row justify-content-end">
      <div class="d-grid gap-2 d-md-flex justify-content-md-end" style="padding: 0">
        <button type="submit" class="btn btn-primary">Login</button>
      </div>
    </div>
  </div>
  <AuthorizationLinkBox msg="New to here?" link="/register" action-msg="Create an account"/>
</template>

<style scoped>

</style>
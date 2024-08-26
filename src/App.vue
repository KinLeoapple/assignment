<script setup>
import {ref} from "vue";

const headerLeftBtn = ["Home", "Reading", "Community", "Reservation"];
const headerRightBtn = ["Login"];

const collapse = ref(false);
const currentPageIndex = ref(0);
const changePage = (pageIndex) => {
  currentPageIndex.value = pageIndex;
}
</script>

<template>
  <div class="container">
    <!-- Page Header -->
    <header>
      <nav class="navbar navbar-expand-lg bg-body-secondary mt-3">
        <div class="container-fluid">
          <div class="navbar-brand logo" @click="changePage(0)">Navbar</div>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarBtn"
                  aria-controls="navbarBtn" :aria-expanded="collapse" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <!-- Header Buttons -->
          <div class="collapse navbar-collapse justify-content-between" id="navbarBtn">
            <!-- Left Button -->
            <ul class="navbar-nav column-gap-3">
              <li v-for="(btn, index) in headerLeftBtn" class="nav-item">
                <button class="btn btn-sm" @click="changePage(index)">
                  <span class="nav-link">{{ btn }}</span>
                </button>
              </li>
            </ul>
            <!-- Right Button -->
            <ul class="navbar-nav column-gap-3">
              <li v-for="(btn, index) in headerRightBtn" class="nav-item">
                <button class="btn btn-sm" @click="changePage(headerLeftBtn.length + index)">
                  <span class="nav-link">{{ btn }}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <!-- Page Content -->
    <main>

    </main>
  </div>
</template>

<style scoped>
.logo {
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
}
</style>

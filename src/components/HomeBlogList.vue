<script setup>
import {ref} from "vue";
import blogImg from "@/assets/img/img.jpg";
import blogsJson from "@/assets/blogs/blogs.json";

const homeBlogNavBtn = ["Latest", "Top"];

const blogsIndex = ref(0);
const changeBlogs = (index) => {
  blogsIndex.value = index;
}

const buildPreViewText = (text) => {
  const maxLength = 200;
  let previewText = text.substring(0, maxLength);
  if (text.length > maxLength) {
    previewText += "...";
  }
  return previewText;
}
</script>

<template>
  <div class="row justify-content-between mt-3">
    <div class="col-9">
      <!-- Nav -->
      <nav class="navbar navbar-expand-lg bg-body-secondary rounded mb-3">
        <div class="container-fluid">
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#homeBlogNavbarBtn"
                  aria-controls="homeBlogNavbarBtn" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse justify-content-between" id="homeBlogNavbarBtn">
            <ul class="navbar-nav column-gap-3">
              <li v-for="(btn, index) in homeBlogNavBtn" class="nav-item">
                <button class="btn btn-sm" @click="changeBlogs(index)">
                  <span class="nav-link">{{ btn }}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <!-- Blog List -->
      <div class="container-fluid">
        <div class="row justify-content-between overflow-hidden bg-body-secondary rounded"
             style="cursor: pointer">
          <div class="col-3" style="padding-left: 0">
            <div class="ratio ratio-16x9">
              <img :src="blogImg" alt="">
            </div>
          </div>
          <div class="col-9">
            <div class="card-body">
              <h5 class="mt-2">Card title</h5>
              <p class="">
                {{
                  buildPreViewText(`Some quick example text to build on the card title and make up the bulk of the card's
                  content.Some quick example text to build on the card title and make up the bulk of the card's
                  content.`)
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
<script setup>
import {computed, ref} from "vue";
import blogImg from "@/assets/img/img.jpg";
import blogsJson from "@/assets/blogs/blogs.json";
import {useRouter} from "vue-router";
import Weather from "@/components/Weather.vue";

const router = useRouter();

const homeBlogNavBtn = ["Latest", "Top", "More"];

const blogsIndex = ref(0);
const changeBlogs = (index) => {
  blogsIndex.value = index;
  if (index === 2) {
    router.push("/blogs");
  }
}

const blogs = computed(() => {
  let blogsJsonSlice = blogsJson.slice(0, 5)
  if (blogsIndex.value === 0)
    return blogsJsonSlice.sort((a, b) => new Date(b.date) - new Date(a.date));
  else if (blogsIndex.value === 1)
    return blogsJsonSlice.sort((a, b) => b.view - a.view);
});

const buildPreviewText = (text) => {
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
                  <span class="nav-link" :class="{'active text-primary': blogsIndex === index}">{{ btn }}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <!-- Blog List -->
      <div class="container-fluid">
        <div v-for="blog in blogs" class="row justify-content-between overflow-hidden bg-body-secondary rounded mb-3"
             style="cursor: pointer">
          <div class="col-3" style="padding-left: 0">
            <img class="blog-img" :src="blogImg" alt="">
          </div>
          <div class="col-9">
            <div class="card-body">
              <h5 class="mt-2 text-truncate">{{ blog.title }}</h5>
              <p class="fs-6">
                {{ buildPreviewText(blog.content) }}
              </p>
              <p class="fs-6">{{ new Date(blog.date).toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-3">
      <Weather/>
    </div>
  </div>
</template>

<style scoped>
.blog-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
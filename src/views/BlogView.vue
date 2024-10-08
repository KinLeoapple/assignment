<script setup>
import InteractiveDataTable from "@/components/InteractiveDataTable.vue";
import {computed} from "vue";
import blogsJson from "@/assets/blogs/blogs.json";

const columns = [
  { data: 'title', title: 'Title' },
  { data: 'content', title: 'Content' },
  { data: 'view', title: 'View' },
  { data: 'date', title: 'Date' },
];

const blogs = computed(() => {
  let blogsJsonSlice = blogsJson.slice(0)
  blogsJsonSlice = blogsJsonSlice.sort((a, b) => new Date(b.date) - new Date(a.date));
  blogsJsonSlice.forEach(blog => {
    blog.content = buildPreviewText(blog.content);
    blog.date = new Date(blog.date).toLocaleString();
  });
  return blogsJsonSlice;
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
<InteractiveDataTable :columns="columns" :data="blogs"/>
</template>

<style scoped>

</style>
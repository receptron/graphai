<template>
  <ul>
    <li v-for="article in data.articles" :key="article.url" class="post-item">
      <p>
        <a :href="article.url" class="post-link" target="_blank">{{ article.title }}</a>
      </p>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { data } from "./article.data.mts";
</script>

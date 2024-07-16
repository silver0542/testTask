<template>
  <div>
    <q-layout view="hHh lpR fFf">
      <HeaderComponent />
      <q-page-container>
        <slot />
      </q-page-container>
      <FooterComponent />
    </q-layout>
  </div>
</template>
<script setup lang="ts"></script>

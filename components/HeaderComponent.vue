<template>
  <q-header
    elevated
    class="q-py-md"
    :class="[
      !$q.dark.isActive ? 'bg-white text-black' : 'bg-grey-7 text-white',
    ]"
  >
    <q-toolbar class="container">
      <q-toolbar-title>
        <NuxtLink :to="{ path: '/' }">
          <q-img
            :src="logo"
            spinner-color="red"
            style="max-width: 160px; height: 24px"
            class="q-mr-sm"
          />
        </NuxtLink>
        {{ pageTitle }}
      </q-toolbar-title>
      <ModeToggler />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuasar } from "quasar";
import type { QVueGlobals } from "quasar";
import logo from "~/assets/images/logotype.svg";
const route = useRoute();
const $q: QVueGlobals = useQuasar();
const pageTitle = computed(() => route.meta.title);
</script>

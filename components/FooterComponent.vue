<template>
  <q-footer
    elevated
    :class="[
      !$q.dark.isActive ? 'bg-white text-black' : 'bg-grey-7 text-white',
    ]"
  >
    <q-toolbar>
      <q-toolbar-title>
        <p class="text-center text-subtitle2 q-mb-none">
          {{ new Date().getFullYear() }}
        </p>
      </q-toolbar-title>
    </q-toolbar>
  </q-footer>
</template>
<script setup lang="ts">
import { useQuasar } from "quasar";
import type { QVueGlobals } from "quasar";

const $q: QVueGlobals = useQuasar();
</script>

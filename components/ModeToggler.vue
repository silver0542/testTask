<template>
  <q-toggle
    v-model="cookie_mode"
    icon="dark_mode"
    unchecked-icon="light_mode"
    label="Dark Mode"
    color="red"
    @update:model-value="changeStatus()"
  />
</template>
<script setup lang="ts">
import { useQuasar } from "quasar";
import { ref, onMounted } from "vue";
import type { QVueGlobals } from "quasar";

const $q: QVueGlobals = useQuasar();
const cookie_mode = ref<boolean>($q.dark.isActive);

const checkCookies = (): void => {
  if ($q.cookies.has("dark_mode")) {
    cookie_mode.value = $q.cookies.get("dark_mode") == "false" ? false : true;
    if (cookie_mode.value) {
      $q.dark.set(Boolean(cookie_mode.value));
    }
  } else {
    $q.cookies.set("dark_mode", String($q.dark.isActive));
  }
};
const changeStatus = () => {
  $q.dark.toggle();
  $q.cookies.set("dark_mode", String($q.dark.isActive));
};

checkCookies();
</script>

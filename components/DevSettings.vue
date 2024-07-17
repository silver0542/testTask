<template>
  <q-card class="my-card q-pa-md q-mt-md q-mx-auto" style="max-width: 80%">
    <q-card-section>
      <q-list>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Show SearchBox</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle
              @update:model-value="changeStatus()"
              color="blue"
              v-model="devProps.showSearch"
              val="true"
            />
          </q-item-section>
        </q-item>

        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Allow to select candidates</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle
              @update:model-value="changeStatus()"
              color="blue"
              v-model="devProps.checkboxes"
              val="true"
            />
          </q-item-section>
        </q-item>

        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Show Add button</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle
              @update:model-value="changeStatus()"
              color="blue"
              v-model="devProps.showAddButton"
              val="true"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { ref } from "vue";

const devProps = ref({
  showSearch: true,
  checkboxes: true,
  showAddButton: true,
});

const $emit = defineEmits(["updateDevValues"]);
const changeStatus = () => {
  $emit("updateDevValues", devProps.value);
};
</script>

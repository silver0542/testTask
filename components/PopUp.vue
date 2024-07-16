<template>
  <q-dialog
    v-model="props.visible"
    transition-show="rotate"
    transition-hide="rotate"
    backdrop-filter="blur(4px)"
  >
    <q-card>
      <q-card-section class="row items-center q-pb-sm">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closePopUp" />
      </q-card-section>

      <q-card-section style="max-height: 50vh" class="scroll">
        <slot></slot>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          v-if="props.showCancel"
          flat
          :label="props.cancelTitle"
          color="primary"
          @click="closePopUp"
        />
        <q-btn
          v-if="props.showConfirm"
          flat
          :label="props.confirmTitle"
          color="primary"
          @click="confirmAction"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { useCandidateStore } from "~/stores/candidatesStore";
const candidatesStore = useCandidateStore();
const props = defineProps({
  title: {
    type: String,
    default: "Details",
  },
  visible: {
    type: Boolean,
    default: true,
  },
  showConfirm: {
    type: Boolean,
    default: true,
  },
  confirmTitle: {
    type: String,
    default: "Yes",
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  cancelTitle: {
    type: String,
    default: "No",
  },
});
const $emit = defineEmits(["confirmClick", "cancelClick"]);

const closePopUp = () => {
  $emit("cancelClick");
};

const confirmAction = async () => {
  $emit("confirmClick");
};
</script>

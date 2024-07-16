<template>
  <q-page class="container">
    <div v-if="candidate">
      <h5 class="q-py-sm text-center">
        Edit
        <strong>{{ candidate.first_name }} {{ candidate.last_name }}</strong>
      </h5>
      <CandidateForm :editMode="true" :candidate="candidate" />
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { useCandidateStore } from "~/stores/candidatesStore";
import type { ICandidate } from "~/types/types";

const candidatesStore = useCandidateStore();
const route = useRoute();
const id = route.params.id;

const { data: candidate } = await useAsyncData("candidates", async () => {
  let candidateFetching = await candidatesStore.getCandidate(Number(id));
  return candidateFetching;
});

definePageMeta({
  title: `Edit`,
});
useHead({
  title: `Edit `,
});
</script>

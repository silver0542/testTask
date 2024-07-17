<template>
  <q-page class="container">
    <div class="my-card q-pa-md q-mt-md q-mx-auto" style="max-width: 80%">
      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Table Component Dev Mode</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle color="blue" v-model="devMode" val="true" />
        </q-item-section>
      </q-item>
    </div>
    <q-slide-transition>
      <div v-show="devMode">
        <DevSettings @updateDevValues="updateDev" />
      </div>
    </q-slide-transition>
    <DataTable
      :headLine="columns"
      v-if="candidates"
      :rowData="candidates.candidates"
      :per_page="candidates.per_page"
      :page="candidates.page"
      :total_rows="candidates.total"
      :showSearch="devProps.showSearch"
      :checkboxes="devProps.checkboxes"
      :showAddButton="devProps.showAddButton"
      :selectedValues="selectedValues"
      @addButtonEvent="addClickHandle()"
      @editButtonEvent="editClickHandle($event)"
      @deleteButtonEvent="deleteClickHandle($event)"
      @bulkDeleteButtonEvent="bulkdeleteClickHandle($event)"
      @pagginationUpdate="paginationHandler($event)"
      @onRequest="updateData($event)"
      @onSearch="searchCandidate($event)"
      @rowClick="preview($event)"
      @onSelect="selectHandler($event)"
    />
    <PopUp
      v-bind="{ ...popUpData }"
      @cancelClick="closePreview"
      v-if="popUpData.visible"
    >
      <CandidateForm :candidate="candidatePreview" :previewMode="true" />
    </PopUp>
  </q-page>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useCandidateStore } from "~/stores/candidatesStore";
import { QTable, useQuasar } from "quasar";
import type { QVueGlobals, QNotifyUpdateOptions } from "quasar";
import type { ICandidate, ICandidateState, IPopUpProps } from "../types/types";

definePageMeta({
  title: "Candidates List",
});
useHead({
  title: "Candidates List",
});

const router = useRouter();
const $q: QVueGlobals = useQuasar();
const candidatesStore = useCandidateStore();
const selectedValues = ref<ICandidate[]>([]);
const { data: candidates } = await useAsyncData(
  "candidates",
  async (): Promise<ICandidateState> => {
    let fetching = await candidatesStore.getCandidates(
      candidatesStore.page,
      candidatesStore.per_page
    );
    return <ICandidateState>fetching;
  }
);
const devMode = ref<boolean>(false);
const devProps = ref({
  showSearch: true,
  checkboxes: true,
  showAddButton: true,
});

const columns: QTable["columns"] = [
  {
    name: "full_name",
    label: "Full Name",
    align: "left",
    field: (row: any) =>
      // "[" + row.id + "] " +
      row.first_name + " " + row.last_name,
  },
  {
    name: "email",
    align: "left",
    label: "Email",
    field: "email",
  },
  {
    name: "skills",
    align: "left",
    label: "Skills",
    field: "skills",
  },
  {
    name: "actions",
    align: "right",
    label: "Actions",
    field: "actions",
    sortable: false,
  },
];

const popUpData = ref(<IPopUpProps>{
  visible: false,
  showConfirm: false,
  cancelTitle: "Close",
});
const candidatePreview = ref<ICandidate>();

const addClickHandle = (): void => {
  router.push({ path: "/candidate/add" });
};
const editClickHandle = (id: number): void => {
  router.push({ name: "candidate-edit-id", params: { id: id } });
  // router.push({ path: `/candidate/edit/${id}` });
};
const deleteClickHandle = (candidate: ICandidate): void => {
  let dismiss: (props?: QNotifyUpdateOptions | undefined) => void = $q.notify({
    message: `Are you sure want to delete ${candidate.first_name} ${candidate.last_name} ?`,
    color: "red",
    icon: "delete",
    position: "center",
    timeout: 20000,
    actions: [
      {
        label: "Yes",
        color: "white",
        handler: () => {
          confirmHandle([candidate.id]);
        },
      },
      {
        label: "No",
        color: "white",
        handler: () => {
          /* ... */
          dismiss();
        },
      },
    ],
  });
};
const bulkdeleteClickHandle = (candidates: ICandidate[]): void => {
  let title: string = "Are you sure want to delete cadidates:";
  let ids: number[] = [];
  candidates.forEach((item: ICandidate, index: number) => {
    ids.push(item.id);
    title += `${item.first_name} ${item.last_name}`;
    if (index !== candidates.length - 1) {
      title += ", ";
    } else {
      title += "?";
    }
  });
  let dismiss: (props?: QNotifyUpdateOptions | undefined) => void = $q.notify({
    message: title,
    color: "red",
    icon: "delete",
    position: "center",
    timeout: 20000,
    actions: [
      {
        label: "Yes",
        color: "white",
        handler: () => {
          confirmHandle(ids);
        },
      },
      {
        label: "No",
        color: "white",
        handler: () => {
          /* ... */
          dismiss();
        },
      },
    ],
  });
};
const confirmHandle = async (ids: number[]): Promise<void> => {
  let succes_count: number = 0;
  if (ids) {
    for (let i: number = 0; i < ids.length; i++) {
      let id: number = ids[i];
      let result: Response = await candidatesStore.removeCandidate(id);
      if (result && result.ok) {
        succes_count++;
      }
    }

    if (succes_count == ids.length) {
      $q.notify({
        type: "positive",
        position: "center",
        message: `${
          ids.length > 1 ? "Candidates" : "Candidate"
        } successfully removed`,
      });
      unselect();
      candidates.value = await candidatesStore.getCandidates(
        candidatesStore.page,
        candidatesStore.per_page
      );
    } else {
      $q.notify({
        message: "Some Candidates wasn't removed",
        type: "negative",
      });
    }
  }
};

const paginationHandler = (event: any): void => {
  candidatesStore.setPagination(event.rowsPerPage, event.page);
  if (candidates && candidates.value) {
    candidates.value.candidates = candidatesStore.candidates;
  }
};
const updateData = async (event: any): Promise<void> => {
  console.log(event);
  candidates.value = await candidatesStore.getCandidates(
    event.pagination.page,
    event.pagination.rowsPerPage
  );
};
const searchCandidate = async (value: string): Promise<void> => {
  await candidatesStore.setSearchValue(value);
  if (candidates && candidates.value) {
    candidates.value.candidates = candidatesStore.candidates;
  }
};
const preview = (data: ICandidate): void => {
  candidatePreview.value = data;
  popUpData.value.title = `Candidate: ${data.first_name} ${data.last_name}`;
  popUpData.value.visible = true;
};
const closePreview = (): void => {
  popUpData.value.visible = false;
  popUpData.value.title = "";
};
const unselect = (): void => {
  selectedValues.value = [];
};
const selectHandler = (data: ICandidate[]): void => {
  console.log("Emit:", data);
  selectedValues.value = data;
};
const updateDev = (data: any): void => {
  devProps.value = data;
};
</script>

<template>
  <div class="q-pa-md">
    <q-table
      row-key="id"
      :title="props.tableTitle"
      :columns="props.headLine"
      :rows="props.rowData"
      :rows-per-page-options="[3, 5, 10, 20]"
      :filter="filter"
      :selection="props.checkboxes ? 'multiple' : 'none'"
      :pagination="{
        page: props.page,
        rowsPerPage: props.per_page,
        rowsNumber: props.total_rows,
      }"
      :table-header-class="[!$q.dark.isActive ? 'bg-grey-2 text-black' : '']"
      :card-class="[!$q.dark.isActive ? 'bg-grey-2 text-black' : '']"
      :table-class="[!$q.dark.isActive ? 'bg-white text-grey-8' : '']"
      v-model:selected="selected"
      @request="onRequest"
      @update:pagination="pgUpdate($event)"
      @row-click="rowClick"
    >
      <template v-slot:top-right>
        <div class="row items-center q-gutter-md">
          <q-btn
            v-if="selected.length > 0"
            color="red"
            icon="delete"
            class="col"
            size="sm"
            :label="`Delete All (${selected.length})`"
            @click="bulkDelete(selected)"
          />
          <q-input
            v-if="props.showSearch"
            class="col"
            size="sm"
            color="white"
            dense
            debounce="300"
            v-model="filter as string"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            v-if="props.showAddButton"
            color="primary"
            icon="add"
            class="col"
            size="sm"
            label="Add"
            @click="add()"
          />
        </div>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" @click.stop>
          <q-btn
            color="primary"
            icon="mode_edit"
            @click="edit(props.row.id)"
          ></q-btn>
          <q-btn
            color="red"
            icon="delete"
            @click="removeItem(props.row)"
          ></q-btn>
        </q-td>
      </template>
      <template v-slot:body-cell-skills="props">
        <q-td :props="props">
          <span class="q-mx-xs" v-for="skill in getSkills(props.row.skills)">
            <q-badge :label="skill" :color="getSkillColor(skill)" />
          </span>
        </q-td>
      </template>
    </q-table>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, type PropType } from "vue";
import { QTable } from "quasar";
import { useQuasar } from "quasar";
import type { ICandidate } from "../types/types";
import type { QVueGlobals } from "quasar";

const $q: QVueGlobals = useQuasar();
const $emit = defineEmits([
  "addButtonEvent",
  "editButtonEvent",
  "deleteButtonEvent",
  "bulkDeleteButtonEvent",
  "pagginationUpdate",
  "onRequest",
  "onSearch",
  "rowClick",
  "onSelect",
]);
const props = defineProps({
  headLine: {
    type: QTable["columns"],
  },
  rowData: {
    type: Array,
    required: true,
  },
  tableTitle: {
    type: String,
    default: "Candidates",
  },
  page: {
    type: Number,
    default: 0,
  },
  per_page: {
    type: Number,
    default: 5,
  },
  total_rows: {
    type: Number,
    default: 0,
  },
  showSearch: {
    type: Boolean,
    default: true,
  },
  checkboxes: {
    type: Boolean,
    default: true,
  },
  showAddButton: {
    type: Boolean,
    default: true,
  },
  selectedValues: {
    type: Array,
    default: [],
  },
});

const filter = ref<string>("");
const selected = ref<ICandidate[]>([]);

watch(filter, async (newParam, oldParam): Promise<void> => {
  $emit("onSearch", newParam);
});

watch(selected, async (newParam, oldParam): Promise<void> => {
  $emit("onSelect", newParam);
});
watch(
  () => props.selectedValues,
  (newParam, oldParam) => {
    if (newParam.length == 0 && oldParam.length !== 0) {
      selected.value = [];
    }
  }
);

const removeItem = (item: ICandidate): void => {
  $emit("deleteButtonEvent", item);
};

const bulkDelete = (items: ICandidate[]): void => {
  $emit("bulkDeleteButtonEvent", items);
};
const getSkills = (skill: string): string[] => {
  return skill.trim().split(",");
};

const add = (): void => {
  $emit("addButtonEvent");
};
const edit = (id: number): void => {
  $emit("editButtonEvent", id);
};

const pgUpdate = (event: any): void => {
  $emit("pagginationUpdate", event);
};
const onRequest = (event: any): void => {
  $emit("onRequest", event);
};
const rowClick = (event: any, row: ICandidate): void => {
  $emit("rowClick", row);
};
const getSkillColor = (skill: string): string => {
  switch (skill.trim()) {
    case "HTML":
      return "red";
    case "CSS":
      return "blue";
    case "JavaScript":
      return "orange";
    case "React":
      return "cyan";
    case "Angular":
      return "red-10";
    case "Vue.js":
      return "green";
    case "Node.js":
      return "teal";
    case "Express.js":
      return "purple";
    case "Django":
      return "green-10";
    case "Flask":
      return "grey";
    default:
      return "primary";
  }
};
</script>

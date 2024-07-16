<template>
  <div class="q-pa-md q-mx-auto" style="max-width: 700px">
    <Form @submit="onSubmit" :validation-schema="schema">
      <div class="row items-center q-gutter-md">
        <Field
          name="first_name"
          type="text"
          :value="candidate.first_name"
          v-slot="{ errorMessage, value, field }"
        >
          <q-input
            v-bind="field"
            class="col"
            filled
            :model-value="value"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="First Name *"
            :readonly="props.previewMode"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
        </Field>
        <Field
          name="last_name"
          type="text"
          :value="candidate.last_name"
          v-slot="{ errorMessage, value, field }"
        >
          <q-input
            v-bind="field"
            :model-value="value"
            :error-message="errorMessage"
            :error="!!errorMessage"
            class="col"
            filled
            label="Last Name *"
            :readonly="props.previewMode"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
        </Field>
      </div>
      <div class="row items-center q-gutter-md q-my-sm">
        <Field
          name="email"
          type="email"
          :value="candidate.email"
          v-slot="{ errorMessage, value, field }"
        >
          <q-input
            filled
            label="Email *"
            v-bind="field"
            class="col"
            :model-value="value"
            :error-message="errorMessage"
            :error="!!errorMessage"
            :readonly="props.previewMode"
          >
            <template v-slot:prepend> <q-icon name="email" /> </template
          ></q-input>
        </Field>
      </div>
      <div class="row items-center q-gutter-md q-my-sm">
        <Field
          name="bio"
          type="text"
          v-slot="{ errorMessage, value, field }"
          :value="candidate.bio"
        >
          <q-input
            filled
            type="textarea"
            label="About Candidate"
            min-height="5rem"
            v-bind="field"
            class="col"
            :model-value="value"
            :error-message="errorMessage"
            :error="!!errorMessage"
            :readonly="props.previewMode"
          >
            <template v-slot:prepend>
              <q-icon name="note_add" />
            </template>
          </q-input>
        </Field>
      </div>
      <div class="row items-center q-gutter-md q-my-sm">
        <Field
          name="skills"
          type="text"
          :value="candidate.skills"
          v-slot="{ errorMessage, value, field }"
        >
          <q-select
            v-bind="field"
            filled
            multiple
            :options="skills"
            use-chips
            stack-label
            label="Skills *"
            class="col"
            :model-value="value"
            :error-message="errorMessage"
            :error="!!errorMessage"
            :readonly="props.previewMode"
          >
            <template v-slot:prepend>
              <q-icon name="bolt" />
            </template>
          </q-select>
        </Field>
      </div>
      <div class="row items-center q-gutter-md q-my-sm">
        <Field
          name="github_url"
          type="text"
          :value="candidate.github_url"
          v-slot="{ errorMessage, value, field }"
        >
          <q-input
            filled
            label="Github Username *"
            v-bind="field"
            class="col"
            :model-value="value"
            :error-message="errorMessage"
            :error="!!errorMessage"
            prefix="https://github.com/"
            :readonly="props.previewMode"
          >
            <template v-slot:prepend>
              <q-icon name="fa-brands fa-github" />
            </template>
          </q-input>
        </Field>
      </div>
      <div class="row items-center q-gutter-md q-my-sm">
        <Field
          name="resume_file"
          type="text"
          disabled
          class="col"
          v-if="(props.editMode && !showUploader) || props.previewMode"
        >
          <q-input
            @click="openResume(candidate.resume_file as string)"
            filled
            label="Resume url *"
            disabled
            class="col"
            :model-value="candidate.resume_file as string"
            style="cursor: pointer"
            hint="Click to open Resume in new browser tab"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-input>
        </Field>

        <Field
          name="resume_file"
          type="file"
          :value="candidate.resume_file"
          v-slot="{ errorMessage, value, field }"
          v-if="
            (!props.editMode && !props.previewMode) ||
            (props.editMode && showUploader)
          "
        >
          <q-file
            label="Resume File"
            counter
            accept=".pdf"
            filled
            v-bind="field"
            class="col"
            :model-value="value"
            :error-message="errorMessage"
            :error="!!errorMessage"
          >
            <template v-slot:prepend>
              <q-icon name="cloud_upload" @click.stop.prevent />
            </template>
          </q-file>
        </Field>
        <q-btn
          flat
          :color="!showUploader ? 'primary' : 'red'"
          :label="!showUploader ? 'Replace' : 'Cancel'"
          size="md"
          v-if="props.editMode"
          @click="showUploader = !showUploader"
        ></q-btn>
      </div>
      <div
        class="row items-center justify-between q-gutter-md q-my-sm"
        v-if="!props.previewMode"
      >
        <div class="col">
          <q-btn color="black" label="Cancel" @click="goHome()" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
            v-if="!props.editMode"
          />
        </div>
        <q-btn label="Submit" type="submit" size="lg" color="primary" />
      </div>
    </Form>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { useQuasar } from "quasar";
import { Form, Field, useForm } from "vee-validate";
import * as yup from "yup";
import type { ICandidate, IEmailVerificationResp } from "~/types/types";
import type { QVueGlobals, QNotifyUpdateOptions } from "quasar";

const router = useRouter();
const candidate = ref<ICandidate>({
  id: -1,
  first_name: "",
  last_name: "",
  email: "",
  bio: "",
  skills: [],
  resume_file: "",
  github_url: "",
});
const props = defineProps({
  candidate: {
    type: Object as PropType<ICandidate>,
    default: {},
  },
  editMode: {
    type: Boolean,
    default: false,
  },
  previewMode: {
    type: Boolean,
    default: false,
  },
});

const { data } = await useAsyncData("skills", async () => {
  let res = await $fetch("/api/candidates/skills/")
    .then((res) => {
      if (res && res.rows) {
        let d = res.rows.map((skill) => skill.title);
        return d;
      }
    })
    .catch((err) => {
      console.log(err);
      return ["HTML", "CSS"];
    });
  return { skills: res };
});

if (props.editMode || props.previewMode) {
  candidate.value.id = props.candidate.id;
  candidate.value.first_name = props.candidate.first_name;
  candidate.value.last_name = props.candidate.last_name;
  candidate.value.email = props.candidate.email;
  candidate.value.bio = props.candidate.bio;
  candidate.value.resume_file = props.candidate.resume_file;
  candidate.value.skills =
    typeof props.candidate.skills == "string"
      ? props.candidate.skills.split(",").map((skill) => skill.trim())
      : props.candidate.skills;
  candidate.value.github_url = props.candidate.github_url;
}

const skills = ref<String[] | undefined>(data.value?.skills);
const showUploader = ref<Boolean>(false);
const $q: QVueGlobals = useQuasar();

const schema = yup.object({
  first_name: yup
    .string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  last_name: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),

  email: yup
    .string()
    .email("Invalid email address")
    .test("unique-email", "Email already exists", async (value) => {
      if (props.editMode && props.candidate.email == value) {
        return true;
      }

      if (value && !props.candidate.email) {
        const isUnique = await isEmailUnique(value);

        return isUnique;
      }

      return true;
    })
    .required("Email is required"),

  bio: yup.string().notRequired().default(""),
  skills: yup
    .array()
    .of(yup.string())
    .required("Skills are required")
    .transform((value) => {
      if (typeof value === "string") {
        return value.split(",").map((skill) => skill.trim());
      }
      return value;
    }),
  resume_file: !props.editMode
    ? yup
        .mixed()
        .test("fileType", "Resume must be a PDF file", (value: any) => {
          if (!value) return true;
          return value && value.type === "application/pdf";
        })
        .required("Resume file is required")
    : yup.string().notRequired().default(""),
  github_url: yup
    .string()
    .matches(
      /^[a-zA-Z0-9-]*$/,
      "GitHub username can only contain alphanumeric characters and dashes ( - )"
    )
    .default(""),
});

const onSubmit = async (
  values: any,
  { resetForm }: { resetForm: () => void }
): Promise<void> => {
  const dismiss: (props?: QNotifyUpdateOptions | undefined) => void = $q.notify(
    {
      spinner: true,
      message: "Please wait...",
      timeout: 2000,
    }
  );
  try {
    const formData: FormData = new FormData();
    formData.append("first_name", values.first_name);
    formData.append("last_name", values.last_name);
    formData.append("email", values.email);
    formData.append("bio", values.bio);
    formData.append(
      "skills",
      JSON.stringify(values.skills).replace(/\[|\]|"/g, "")
    );

    if (values.resume_file == undefined) {
      formData.append("resume_file", candidate.value.resume_file);
    } else {
      formData.append("resume_file", values.resume_file);
    }

    formData.append("github_url", values.github_url);
    let id_ = props.editMode ? candidate.value.id : "";
    const response = await $fetch<Response>(`/api/candidates/${id_}`, {
      method: props.editMode ? "PUT" : "POST",
      body: formData,
    });

    if (!response) {
      dismiss();
      $q.notify({
        message: "Failed ",
        type: "negative",
      });
    } else {
      dismiss();

      setTimeout(() => {
        router.push({ path: "/" });
      }, 3000);
      $q.notify({
        type: "positive",
        position: "center",
        message: `Candidate successfully ${
          props.editMode ? "updated" : "created"
        }. You will be redirected to home page in 3s`,
        timeout: 3000,
        onDismiss: () => {
          router.push({ path: "/" });
        },
      });
      if (!props.editMode) {
        resetForm();
      }
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    dismiss();
    $q.notify({
      message: "Failed ",
      type: "negative",
    });
  }
};

const openResume = (resumeUrl: string): void => {
  const win: Window | null = window.open(resumeUrl, "_blank");
  if (win) {
    win.focus();
  } else {
    alert("Please allow popups for this website");
  }
};

const goHome = (): void => {
  router.push("/");
};
const isEmailUnique = async (value: string): Promise<boolean> => {
  const response = await $fetch<IEmailVerificationResp>(
    `/api/candidates/verifyEmail/`,
    {
      method: "POST",
      body: { email: value },
    }
  );
  if (!response) {
    return true;
  } else {
    return response.uniqe;
  }
};
</script>

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  ssr: true,
  // devtools: { enabled: true }
  pages: true,
  typescript: {
    typeCheck: true,
  },
  css: ["~/assets/css/main.scss"],
  modules: ["@pinia/nuxt", "nuxt-quasar-ui", "@vee-validate/nuxt"],
  nitro: {
    experimental: {
      database: true,
    },
    database: {
      default: {
        connector: "sqlite",
        options: {
          name: "db",
          path: "./database.db",
        },
      },
    },
  },
  quasar: {
    plugins: ["Notify", "Cookies"],
    extras: {
      fontIcons: ["material-icons", "fontawesome-v6"],
    },
  },
  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
    componentNames: {
      Form: "VeeForm",
      Field: "VeeField",
      FieldArray: "VeeFieldArray",
      ErrorMessage: "VeeErrorMessage",
    },
  },
  runtimeConfig: {
    cloudKey: "mnM9LI5dJkdAM9XnQCDp033uQWouvevl", // must come form env, but it's just example
    cloudFolder: "c1a5c7ab-be22-4446-bc33-2d01dd25e0db", // must come form env, but it's just example
  },
});

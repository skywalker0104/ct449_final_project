import colors from "vuetify/es5/util/colors";
require("dotenv").config();

export default {
  head: {
    titleTemplate: "Admin / GK Stack",
    title: "employee_management",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.gstatic.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap",
      },
    ],
  },
  css: [],
  plugins: [
    "@/plugins/vue-awesome-countdown",
    "@/plugins/vue-observe-visibility",
    { src: "@/plugins/vue-apexchart", ssr: false },
  ],
  components: true,
  buildModules: [
    "@nuxtjs/vuetify",
    "@nuxtjs/toast",
    "@nuxtjs/auth-next",
    "@nuxtjs/moment",
  ],
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/toast",
    "@nuxtjs/auth-next",
    "@nuxtjs/moment",
    "@nuxtjs/dotenv",
  ],
  axios: {
    baseURL: "http://localhost:5000/api",
  },

  auth: {
    redirect: {
      login: "/login",
      logout: "/",
      home: "/",
    },
    strategies: {
      local: {
        token: {
          property: "token",
        },
        user: {
          property: "user",
        },
        endpoints: {
          login: { url: "/auth/admin", method: "post" },
          logout: false,
          user: { url: "/auth/admin/me", method: "get" },
        },
      },
    },
  },
  toast: {
    position: "bottom-right",
    duration: 1000,
    keepOnHover: true,
  },
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    treeShake: true,
    font: {
      family: "Inter",
    },
    theme: {
      dark: false,
      themes: {
        light: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          lightpurple: "#BABBCD",
          headpurple: "#8CA9C6",
          mainpurple: "#645DF6",
          textheadpurple: "#000000",
          subtextgrey: "#8e8e8e",
          holiday: "#9896B0",
          present: colors.green.darken2,
          absent: colors.deepOrange.accent4,
        },
      },
    },
  },
  build: {},
};

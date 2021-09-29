import Vue from "vue";
import VueRouter from "vue-router";

import BootstrapVue from "bootstrap-vue/dist/bootstrap-vue.esm";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootstrap/dist/css/bootstrap.css";

Vue.use(BootstrapVue);

import login from "../components/login.vue";
import upload from "../components/upload.vue";
import home from "../components/home.vue";
import dl from "../components/dl.vue";
import cam from "../components/cam.vue";
import pred from "../components/pred.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: home },
  { path: "/login", component: login },
  { path: "/upload", component: upload },
  { path: "/dl", component: dl },
  { path: "/cam", component: cam },
  { path: "/pred", component: pred },
];

const router = new VueRouter({
  routes,
});

export default router;

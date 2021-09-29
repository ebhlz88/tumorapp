import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
  isloggedin: false,
  token: null,
  username: null,
};

const mutations = {
  isloggedin(state, isloggedin) {
    state.isloggedin = isloggedin;
  },
  token(state, token) {
    state.token = token;
  },
  username(state, username) {
    state.username = username;
  },
};

const actions = {
  isloggedin(context, isloggedin) {
    context.commit("isloggedin", isloggedin);
  },
  token(context, token) {
    context.commit("token", token);
  },
  username(context, username) {
    context.commit("username", username);
  },
};
const getters = {
  isloggedin: (state) => {
    return state.isloggedin;
  },
  token: (state) => {
    return state.token;
  },
  username: (state) => {
    return state.username;
  },
};
export default {
  state,
  getters,
  actions,
  mutations,
};

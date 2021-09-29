<template>
  <div id="login">
    <div>
      <h2>Cancer Image Prediction Tool</h2>
      <p>
        This website completely gives the information about cancer.This is
        useful for nurse and doctors
      </p>
    </div>
    <div class="row btns logindiv">
      <button class="btn btn-primary col-md-1" v-on:click="signupshow">
        Sign Up
      </button>
      <button class="btn btn-primary col-md-1" v-on:click="loginshow">
        Sign in
      </button>
      <GoogleLogin
        class="col-md-1"
        :params="params"
        :renderParams="renderParams"
        :onSuccess="onSuccess"
      ></GoogleLogin>
    </div>
    <div v-if="showsignup" class="signup row">
      <h3>Sign Up</h3>
      <div class="form-group mx-sm-3 mb-2">
        <input
          type="text"
          class="form-control"
          v-model="registerdata.username"
          id="staticEmail2"
          placeholder="Username"
        />
      </div>
      <div class="form-group mx-sm-3 mb-2">
        <input
          type="text"
          class="form-control"
          v-model="registerdata.email"
          id="staticEmail2"
          placeholder="Email"
        />
      </div>
      <div class="form-group mx-sm-3 mb-2 rr row">
        <button class="mx-sm-1 btn btn-primary" @click="getcode">verify</button>
        <input
          type="text"
          class="form-control"
          v-model="fieldcode"
          id="staticEmail2"
          placeholder="Code"
        />
      </div>

      <div class="form-group mx-sm-3 mb-2">
        <input
          type="password"
          class="form-control"
          v-model="registerdata.password1"
          id="inputPassword2"
          placeholder="Password"
        />
      </div>
      <div class="form-group mx-sm-3 mb-2">
        <input
          type="password"
          class="form-control"
          v-model="registerdata.password2"
          id="inputPassword2"
          placeholder="Confirm Password"
        />
      </div>
      <button v-if="code==fieldcode" type="submit" @click="createac" class="btn btn-primary mb-2">
        Create Account
      </button>
      <button v-if="code!=fieldcode" type="submit" disabled class="btn btn-primary mb-2">
        Create Account
      </button>
    </div>
    <div class="signup row" v-if="showlogin">
      <h3>Login</h3>
      <div class="form-group mx-sm-3 mb-2">
        <input
          type="text"
          class="form-control"
          v-model="logindata.username"
          id="staticEmail2"
          placeholder="Username"
        />
      </div>
      <div class="form-group mx-sm-3 mb-2">
        <input
          type="password"
          class="form-control"
          v-model="logindata.password"
          id="inputPassword2"
          placeholder="Password"
        />
      </div>
      <button type="submit" @click="login" class="btn btn-primary mb-2">
        Login
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import Vue from "vue";
import VueAxios from "vue-axios";

Vue.use(VueAxios, axios);

import GoogleLogin from "vue-google-login";
export default {
  components: {
    GoogleLogin,
  },
  data() {
    return {
      isloggedin: false,
      code:33,
      fieldcode:null,
      registerdata: {
        username: null,
        email: null,
        password1: null,
        password2: null,
      },
      logindata: {
        username: null,
        password: null,
      },
      showlogin: false,
      showsignup: false,
      socialdata: {
        access_token: null,
        code: 0,
        id_token: 0,
      },
      params: {
        client_id:
          "499885857695-0tt9kqt9ed3t2su4jtv1cjl4rf72tv2g.apps.googleusercontent.com",
      },
      // only needed if you want to render the button with the google ui
      renderParams: {
        width: 250,
        height: 50,
        longtitle: true,
      },
    };
  },
  methods: {
    getcode(){
      Vue.axios
        .get("http://127.0.0.1:8000/semail/"+ this.registerdata.email )
        .then((resp) => {
          this.code = resp.data.code;
        });
    },
    createac() {
      axios
        .post(
          "http://127.0.0.1:8000/rest-auth/registration/",
          this.registerdata
        )
        .then(() => {});
    },
    signupshow() {
      this.showsignup = true;
      this.showlogin = false;
    },
    loginshow() {
      this.showlogin = true;
      this.showsignup = false;
    },
    login() {
      axios
        .post("http://127.0.0.1:8000/rest-auth/login/", this.logindata)
        .then((resp) => {
          var token = {
            headers: {
              Authorization: "key " + resp.data.key,
            },
          };
          this.$store.dispatch("token", token);
          this.$store.dispatch("isloggedin", true);
          this.$store.dispatch("username", this.logindata.username);
          this.$router.push("/");
        });
    },
    onSuccess(googleUser) {
      console.log("sucesssssss");
      this.socialdata.access_token = googleUser.Zb.access_token;
      console.log(googleUser.Rs.mU);
      axios
        .post("http://127.0.0.1:8000/social-login/google/", this.socialdata)
        .then((resp) => {
          var token = { Authorization: "key " + resp.data.key };
          this.$store.dispatch("token", token);
          this.$store.dispatch("isloggedin", true);
          this.$store.dispatch("username", googleUser.Rs.mU);

          this.$router.push("upload");
        });
    },
  },
};
</script>

<style>
.btns {
  display: flex;
  justify-content: center;
  margin-left: 0%;
}
.rr .form-control{
  width: auto;
}
.btns .btn {
  margin: 0px 15px;
}
#login .row {
  margin-right: 0px;
}
.logindiv {
  margin-top: 70px;
}
.signup {
  max-width: 300px;
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-left: 40%;
}
.rr .btn{
  width: 70px;
  height: 40px;
  margin-top: 9px;
}
.signup .form-control {
  margin: 10px 0px;
}
</style>

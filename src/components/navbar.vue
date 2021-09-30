<template>
  <div id="navdiv">
    <nav id="nav" class="navbar navbar-expand-lg navbar-light nav">
      <div class="container-fluid">
        <router-link v-if="isloggedin" class="navbar-brand" to="/"
          ><p class="rr">Home</p>
        </router-link>
        <router-link v-if="!isloggedin" class="navbar-brand" to="/login"
          ><p class="rr">Home</p>
        </router-link>
        <router-link class="navbar-brand" to="/dl" v-if="isloggedin"
          ><p class="rr">DL</p></router-link
        >
        <router-link class="navbar-brand" to="/pred" v-if="isloggedin"
          ><p class="rr">Prediction Tool</p></router-link
        >

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mb-2 mb-lg-0 mlauto">
            <!-- <li class="nav-item">
              <router-link v-if="!isloggedin" class="nav-link" to="/login"
                ><b>Login</b></router-link
              >
            </li> -->
            <li class="nav-item">
              <div class="nav-link logoutdiv">
                <button v-if="isloggedin" @click="logout" class="astext">
                  <b>Logout</b>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import axios from "axios";
export default {
  name: "navbar",
  computed: {
    ...mapGetters(["isloggedin"]),
    ...mapGetters(["token"]),
    ...mapGetters(["username"]),
  },
  methods: {
    logout() {
      axios.post("http://127.0.0.1:8000/rest-auth/logout/", NaN).then(() => {
        this.$router.push("login");
        this.$store.dispatch("token", null);
        this.$store.dispatch("isloggedin", false);
        this.$store.dispatch("username", NaN);
      });
    },
  },
};
</script>

<style>
.astext {
  background: none;
  border: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
  color: #fff;
}
.navbar {
  display: flex;
  /* background-color: #4e71ee;
  background-color: rgb(83, 83, 158); */
  padding: 0px !important;
  width: 100%;
  height: 70px;
}
#nav .nav-item {
  margin-right: 40px;
}
.mlauto {
  margin-left: auto;
}
.navbar-brand img {
  height: 90px;
  padding: 5px;
}
.navbar-nav li .nav-link {
  color: rgb(255, 255, 255) !important;
}
.rr {
  color: rgb(255, 255, 255) !important;
  font-weight: 600;
}
.fa-bars {
  color: #fff;
}
#nav .btn-outline-success {
  background-color: #19029b;
  border-radius: 10px;
  border: none;
  padding: 8px 25px;
  box-shadow: none;
  width: auto;
  margin: auto;
  color: white;
}

/* Add Zoom Animation */
.astext {
  background: none;
  border: none;
  margin: 0;
  cursor: pointer;
}
.nav-link {
  padding-top: 15px;
  color: white;
}
img {
  height: 30px;
  border: none;
}
span {
  border: none;
}
span:hover {
  cursor: pointer;
}
#nav .input-group {
  margin: auto;
}
.searchdiv {
  margin: auto;
}
.logoutdiv:hover {
  cursor: pointer;
}
.navbar-brand {
  margin-left: 20px;
}
</style>

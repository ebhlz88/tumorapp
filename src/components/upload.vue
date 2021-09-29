<template>
  <div id="#upload" v-if="isloggedin">
    <button
      v-if="!showupload"
      class="btn btn btn-primary my-3"
      @click="resultnone"
    >
      Show Upload
    </button>
    <button
      v-if="showupload"
      class="btn btn btn-primary my-3"
      @click="resultnone"
    >
      Show Result
    </button>
    <div v-if="showupload" class="row uploaddiv">
      <div class="col-md-3 divupload">
        <h4>Upload Image</h4>
        <div class="file btn btn-lg btn-primary">
          Select Image
          <input type="file" @change="onFileChanged" class="upinput" />
        </div>
        <br />
        <button class="btn btn btn-primary my-3" @click="upload">Upload</button>
      </div>
      <div class="col-md-3 divupload">
        <h4>Capture Image</h4>
        <div>
          <camer />
        </div>
      </div>
    </div>
    <br />
    <button
      v-if="!showupload"
      class="btn btn btn-primary my-3"
      @click="getresult"
    >
      Get Result
    </button>

    <div v-if="!showupload">
      <div class="col" v-for="items in result" :key="items.description">
        <img
          v-if="items.tphoto"
          :src="localhost + items.tphoto"
          alt="image"
          class="image"
        />
        <br />
        <p v-if="items.description">Description:{{ items.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Vue from "vue";
import VueAxios from "vue-axios";
import camer from "./cam";

Vue.use(VueAxios, axios);
import { mapGetters } from "vuex";

export default {
  components: {
    camer,
  },
  data() {
    return {
      picture: {
        tphoto: null,
      },
      cam: false,
      imagefile: null,
      result: null,
      showupload: true,
      localhost: "http://127.0.0.1:8000",
    };
  },
  computed: {
    ...mapGetters(["username"]),
    ...mapGetters(["token"]),
    ...mapGetters(["isloggedin"]),
  },
  methods: {
    resultnone() {
      this.showupload = !this.showupload;
    },
    b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || "";
      sliceSize = sliceSize || 512;

      var byteCharacters = atob(b64Data);
      var byteArrays = [];

      for (
        var offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }

      var blob = new Blob(byteArrays, { type: contentType });
      return blob;
    },
    onFileChanged(e) {
      this.imagefile = e.target.files[0];
    },
    uploadcamera() {
      var block = this.picture.tphoto.split(";");
      var contentType = block[0].split(":")[1];
      var realData = block[1].split(",")[1];
      var blob = this.b64toBlob(realData, contentType);
      let tdata = new FormData();
      tdata.append("tphoto", blob);
      axios
        .post("http://127.0.0.1:8000/cupload/" + this.username, tdata)
        .then(() => {});
    },
    deletpicture() {
      this.picture = NaN;
      this.cam = false;
    },
    upload() {
      let tdata = new FormData();
      tdata.append("tphoto", this.imagefile);
      axios
        .post("http://127.0.0.1:8000/cupload/" + this.username, tdata)
        .then(() => {
          this.$bvToast.toast("Succesfully added", {
            title: "Succesful",
            variant: "success",
            solid: true,
            toaster: "b-toaster-top-center",
          });
        })
        .catch((error) =>
          console.log(
            error.response.request._response,
            this.$bvToast.toast(
              "Make sure all fields are filled or pass Null value",
              {
                title: " Failed to Add",
                variant: "danger",
                solid: true,
                toaster: "b-toaster-top-center",
              }
            )
          )
        );
    },
    getresult() {
      Vue.axios
        .get("http://127.0.0.1:8000/cupload/" + this.username)
        .then((resp) => {
          this.result = resp.data;
        });
    },
  },
};
</script>

<style>
.file {
  position: relative;
  overflow: hidden;
}
.upinput {
  position: absolute;
  font-size: 50px;
  opacity: 0;
  right: 0;
  top: 0;
}
/* .uploaddiv {
  margin-right: 0px;
  margin-top: 25px;
  display: flex;
  justify-content: center;
} */
#upload {
  size: auto;
}
.image {
  height: 400px;
  border-radius: 3rem;
}
/* .divupload {
  border: solid 1px black;
  border-radius: 2rem;
  margin: 20px;
  padding-top: 20px;
  background-color: rgba(36, 35, 31, 0.295);
  color: white;
  min-width: 500px;
} */
</style>

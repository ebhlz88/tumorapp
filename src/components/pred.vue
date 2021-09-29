<template>
  <div id="pred">
    <div class="row uploaddiv">
      <!-- v-if="showupload" -->
      <div class="col-md-2 divupload">
        <h4>Upload Image</h4>
        <div class="file btn btn-lg btn-primary">
          Select Image
          <input type="file" @change="onFileChanged" class="upinput" />
        </div>
        <br />
        <button class="btn btn btn-primary my-3" @click="upload">Upload</button>
      </div>
      <div class="d-flex align-self-center"><h5>or</h5></div>
      <div class="col-md-2 divupload">
        <h4>Capture Image</h4>
        <div>
          <div id="cam" class="web-camera-container">
            <div class="camera-button">
              <button
                type="button"
                class="btn btn-primary button"
                @click="toggleCamera"
              >
                <span v-if="!isCameraOpen">Open Camera</span>
                <span v-else>Close Camera</span>
              </button>
            </div>

            <div v-show="isCameraOpen && isLoading" class="camera-loading">
              <ul class="loader-circle">
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>
            <div
              v-if="isCameraOpen"
              v-show="!isLoading"
              class="camera-box"
              :class="{ flash: isShotPhoto }"
            >
              <div class="camera-shutter" :class="{ flash: isShotPhoto }"></div>

              <video
                v-show="!isPhotoTaken"
                ref="camera"
                :width="450"
                :height="337.5"
                autoplay
              ></video>

              <canvas
                v-show="isPhotoTaken"
                id="photoTaken"
                ref="canvas"
                :width="450"
                :height="337.5"
              ></canvas>
            </div>

            <div v-if="isCameraOpen && !isLoading" class="camera-shoot">
              <button type="button" class="button" @click="takePhoto">
                <img
                  src="https://img.icons8.com/material-outlined/50/000000/camera--v2.png"
                />
              </button>
            </div>

            <div v-if="isPhotoTaken && isCameraOpen" class="camera-download">
              <a
                id="downloadPhoto"
                download="my-photo.jpg"
                class="button"
                role="button"
                @click="downloadImage"
              >
                Upload
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      v-if="!showupload"
      class="btn btn btn-primary my-3"
      @click="resultnone"
    >
      Back
    </button>
    <button
      v-if="showupload"
      class="btn btn btn-primary my-3"
      @click="getresult"
    >
      Show Result
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
import { mapGetters } from "vuex";
import Vue from "vue";
import VueAxios from "vue-axios";

Vue.use(VueAxios, axios);
export default {
  computed: {
    ...mapGetters(["username"]),
    ...mapGetters(["token"]),
    ...mapGetters(["isloggedin"]),
  },
  data() {
    return {
      isCameraOpen: false,
      isPhotoTaken: false,
      isShotPhoto: false,
      isLoading: false,
      link: "#",
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

  methods: {
    resultnone() {
      this.showupload = !this.showupload;
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
          this.showupload = false;
        });
    },
    toggleCamera() {
      if (this.isCameraOpen) {
        this.isCameraOpen = false;
        this.isPhotoTaken = false;
        this.isShotPhoto = false;
        this.stopCameraStream();
      } else {
        this.isCameraOpen = true;
        this.createCameraElement();
      }
    },

    createCameraElement() {
      this.isLoading = true;

      const constraints = (window.constraints = {
        audio: false,
        video: true,
      });

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.isLoading = false;
          this.$refs.camera.srcObject = stream;
        })
        .catch((error) => {
          this.isLoading = false;
          alert(
            "May the browser didn't support or there is some errors." + error
          );
        });
    },

    stopCameraStream() {
      let tracks = this.$refs.camera.srcObject.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });
    },

    takePhoto() {
      if (!this.isPhotoTaken) {
        this.isShotPhoto = true;

        const FLASH_TIMEOUT = 50;

        setTimeout(() => {
          this.isShotPhoto = false;
        }, FLASH_TIMEOUT);
      }

      this.isPhotoTaken = !this.isPhotoTaken;

      const context = this.$refs.canvas.getContext("2d");
      context.drawImage(this.$refs.camera, 0, 0, 450, 337.5);
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

    downloadImage() {
      const canvas = document
        .getElementById("photoTaken")
        .toDataURL("image/jpeg")
        .replace("image/jpeg", "image/octet-stream");
      var block = canvas.split(";");
      var contentType = block[0].split(":")[1];
      var realData = block[1].split(",")[1];
      var blob = this.b64toBlob(realData, contentType);
      let tdata = new FormData();
      tdata.append("tphoto", blob);
      axios
        .post("http://127.0.0.1:8000/cupload/" + this.username, tdata)
        .then(() => {});
    },
  },
};
</script>

<style lang="scss">
#pred .divupload {
  margin: 20px;
  padding-top: 20px;
  color: rgb(0, 0, 0);
  min-width: 300px;
}
#pred .align-self-center {
  width: 5px;
  height: 5px;
}
.uploaddiv {
  background-color: rgb(245, 245, 245);
  border: solid 1px black;
  width: 53%;
  margin-left: 20px;
  margin-top: 30px;
}
#pred body {
  display: flex;
  justify-content: center;
}

.web-camera-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .camera-box {
    .camera-shutter {
      opacity: 0;
      width: 450px;
      height: 337.5px;
      background-color: #fff;
      position: absolute;

      &.flash {
        opacity: 1;
      }
    }
  }

  .camera-shoot {
    margin: 1rem 0;

    button {
      height: 60px;
      width: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100%;

      img {
        height: 35px;
        object-fit: cover;
      }
    }
  }

  .camera-loading {
    overflow: hidden;
    height: 100%;
    position: absolute;
    width: 100%;
    min-height: 150px;
    margin: 3rem 0 0 -1.2rem;

    ul {
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: 999999;
      margin: 0;
    }

    .loader-circle {
      display: block;
      height: 14px;
      margin: 0 auto;
      top: 50%;
      left: 100%;
      transform: translateY(-50%);
      transform: translateX(-50%);
      position: absolute;
      width: 100%;
      padding: 0;

      li {
        display: block;
        float: left;
        width: 10px;
        height: 10px;
        line-height: 10px;
        padding: 0;
        position: relative;
        margin: 0 0 0 4px;
        background: #999;
        animation: preload 1s infinite;
        top: -50%;
        border-radius: 100%;

        &:nth-child(2) {
          animation-delay: 0.2s;
        }

        &:nth-child(3) {
          animation-delay: 0.4s;
        }
      }
    }
  }

  @keyframes preload {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>

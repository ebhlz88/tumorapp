<template>
  <div id="pred">
    <div class="row">
      <div class="col-md-6">
        <div class="head">
          <div class="nav">
            <h4 class="nav-item">File Upload</h4>
            <button id="newupload" type="button" class="btn btn-primary nav-item" @click="newupload" >
              New +
            </button>
          </div>
        </div>
        <div class="ndiv row">
          <div class="col-md-6 my-4 tt">
            <p>Upload File</p>
            <!-- <input type="file"> -->
            <button id="chooseimg" class="btn btn-primary" @click="bclick" disabled>
              Choose Image
            </button>
            <p>{{ filename }}</p>
            <input
              type="file"
              @change="onFileChanged"
              id="getFile"
              style="display: none"
            />
          </div>
          <div class="col-md-6 my-4 tt">
            <p>Capture Image</p>
            <div class="camera-button">
              <button
                id="captureimg"
                type="button"
                class="btn btn-primary"
                @click="toggleCamera"
                disabled
              >
                <span v-if="!isCameraOpen">Open Camera</span>
                <span v-else>Close Camera</span>
              </button>
            </div>
          </div>
          <button id="uploadimg" class="btn btn-primary" @click="upload" disabled>Upload Image</button>
        </div>
      </div>
      <div class="camera col-md-6">
        <div id="cam" class="web-camera-container">
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
                src="../assets/camerashutter.png"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div>
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
        <div class="col" v-for="items in result" :key="items.dfsf">
          <img
            v-if="items.tphoto"
            :src="localhost + items.tphoto"
            alt="image"
            class="image"
          />
          <br />
          <h4 v-if="items.description">Name:{{ items.description }}</h4>
        </div>
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
      filename: null,
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
    newupload(){
      document.getElementById("chooseimg").disabled = false;
      document.getElementById("captureimg").disabled = false;
      document.getElementById("uploadimg").disabled = false;
      document.getElementById("newupload").disabled = true;
      this.filename = null
      this.imagefile = null
    },
    bclick() {
      document.getElementById("getFile").click();
    },
    resultnone() {
      this.showupload = !this.showupload;
    },
    onFileChanged(e) {
      this.imagefile = e.target.files[0];
      this.filename = e.target.files[0].name;
    },
    deletpicture() {
      this.picture = NaN;
      this.cam = false;
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
      const canvas = document
        .getElementById("photoTaken")
        .toDataURL("image/jpeg")
        .replace("image/jpeg", "image/octet-stream");
      var block = canvas.split(";");
      var contentType = block[0].split(":")[1];
      var realData = block[1].split(",")[1];
      this.imagefile = this.b64toBlob(realData, contentType);
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
    upload() {
      let tdata = new FormData();
      tdata.append("tphoto", this.imagefile);
      axios
        .post("http://127.0.0.1:8000/cupload/" + this.username, tdata)
        .then(() => {
          document.getElementById("chooseimg").disabled = true;
          document.getElementById("captureimg").disabled = true;
          document.getElementById("uploadimg").disabled = true;
          document.getElementById("newupload").disabled = false;
          this.filename = null
          this.imagefile = null
          this.$toaster.success('Uploaded Successfully.')
        }).catch(error=>{
       this.$toaster.error('Not Uploaded.'+error)
 })
    },
  },
};
</script>

<style lang="scss">
#pred .divupload {
  margin: 20px;
  padding-top: 20px;
  min-width: 300px;
}
#pred .align-self-center {
  width: 5px;
  height: 5px;
}
// .camera{

//   margin-top: 0px;
// }
.uploaddiv {
  width: 53%;
  margin-left: 20px;
  margin-top: 30px;
}
.camera-download {
  height: 50px;
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
#pred{
  padding-bottom: 30px;
}
.ndiv {
  height: auto;
  width: 80%;
  background-color: rgb(228, 228, 228);
  color: black;
  border-radius: 0px 0px 5px 5px;
  margin-left: 40px;
  padding-bottom: 30px;
}
.head {
  height: 70px;
  width: 80%;
  background-color: rgb(68, 68, 68);
  border-radius: 5px 5px 0px 0px;
  margin-left: 40px;
  padding: 0px auto;
}
.head .btn {
  width: 80px;
  height: 35px;
  margin-left: auto;
  margin-right: 10px;
}
.head .nav {
  padding: 18px;
}
.ndiv .btn-primary {
  background-color: rgb(0, 161, 86);
  height: 50px;
  width: 40%;
  margin: auto;
}
.tt .btn-primary {
  background-color: rgb(0, 110, 153);
  height: 40px;
  width: 55%;
}
.image{
  width: 40%;
  height: 40%;
}
</style>

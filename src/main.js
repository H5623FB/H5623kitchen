import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import * as firebase from "firebase";
import router from "./router";
import Vuetify from "vuetify/lib";
import VueNotifications from "vue-notifications";
import "jquery";
import toastr from "toastr"; // https://github.com/CodeSeven/toastr
import "toastr/build/toastr.min.css";
import VueLocalStorage from "vue-localstorage";
import { config } from "./helpers/firebaseConfig";

function toast({ title, message, type, timeout, cb }) {
  if (type === VueNotifications.types.warn) type = "warning";
  return toastr[type](message, title, { timeOut: timeout });
}

const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
};

Vue.config.productionTip = false;

Vue.use(VueLocalStorage);
Vue.use(VueNotifications, options);
Vue.use(Vuetify);
new Vue({
  router,
  render: h => h(App),
  created() {
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$router.push("/dashboard");
      } else {
        this.$router.push("/login");
      }
    });
  }
}).$mount("#app");

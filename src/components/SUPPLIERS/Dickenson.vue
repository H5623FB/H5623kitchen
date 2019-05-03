<template>
    <div id="app">
      <div align="center" class="loading" v-if="loading">
      <h1>Loading...</h1>
    </div>
  <v-app id="inspire">
    <h1  align="center" color="grey">Dickenson </h1>
    <v-card>
        <v-card-title>
            <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
            ></v-text-field>
            <v-btn large color="green" dark @click="createPo()">Add Selected Items to Po</v-btn>
            <v-btn small color="black" dark @click="goToPo()">Purchase Order List </v-btn>
            <!-- <v-btn small color="black" dark @click="na()">Test </v-btn> -->
        </v-card-title>
      <v-data-table
        v-model="selected"
        :search="search"
        :headers="headers"
        :items="databz"
        item-key="code"
        select-all
        hide-actions
      >
       <!-- hide-actions -->
        <template slot="items" slot-scope="props">
        
          <td>
          <v-checkbox
            v-model="props.selected"
            primary
            hide-details
          ></v-checkbox>
        </td>
          <td>
            <v-edit-dialog
              :return-value.sync="props.item.code"
              lazy
              @save="save"
              @cancel="cancel"
              @open="open"
              @close="close"
            > {{ props.item.code }}
              <v-text-field
                slot="input"
                v-model="props.item.description"
                :rules="[max25chars]"
                label="Edit"
                single-line
                counter
              ></v-text-field>
            </v-edit-dialog>
          </td>
          <!-- <td class="text-xs">{{ props.item.code }}</td> -->
          <td class="text-xs">{{ props.item.description }}</td>
          <td class="text-xs">{{ props.item.size }}</td>
          <td class="text-xs">£{{ props.item.price_ea }}</td>
          <td class="text-xs">
            <v-edit-dialog
              :return-value.sync="props.item.received_qty_ea"
              large
              lazy
              persistent
              @save="save"
              @cancel="cancel"
              @open="open"
              @close="close"
            >
              <div>{{ props.item.received_qty_ea }}</div>
              <div slot="input" class="mt-3 title">Update Stock Value</div>
              <v-text-field
                slot="input"
                v-model="props.item.received_qty_ea"
                :rules="[max25chars]"
                label="Edit"
                single-line
                counter
                autofocus
              ></v-text-field>
            </v-edit-dialog>
          </td>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
    </v-card>
      <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
        {{ snackText }}
        <v-btn flat @click="snack = false">Close</v-btn>
      </v-snackbar>
  </v-app>
</div>
</template>

<script>
import axios from "axios";
import * as firebase from "firebase";
import VueNotifications from "vue-notifications";

export default {
  name: "BrakesDry",
  created() {
    this.fetchData();
  },
  watch: {
    // call again the method if the route changes
    $route: "fetchData"
  },
  computed: {
    databz() {
      let items = this.db;
      var array = [];
      for (var element in items) {
        array.push(items[element]);
      }
      return (this.db = array);
    }
  },
  data() {
    return {
      db: [],
      search: "",
      selected: [],
      loading: false,
      snack: false,
      snackColor: "",
      snackText: "",
      max25chars: v => v.length <= 25 || "Input too long!",
      rowsPerPageItems: [10, 20, 30, 40],
      pagination: {
        rowsPerPage: 20
      },
      headers: [
        {
          text: "Items Code",
          align: "left",
          sortable: false,
          value: "code"
        },
        { text: "Name", value: "description" },
        { text: "Size", value: "size" },
        { text: "Price", value: "price_ea" },
        { text: "Purchased Qty", value: "received_qty_ea" }
      ]
    };
  },
  notifications: {
    showSuccessMsg: {
      type: VueNotifications.types.success,
      title: "Well Done",
      message: "Your selected items have been added to Purchase order list"
    },
    showInfoMsg: {
      type: VueNotifications.types.info,
      title: "Hey you",
      message: "Here is some info for you"
    },
    showWarnMsg: {
      type: VueNotifications.types.warn,
      title: "Wow, man",
      message: "That's the kind of warning"
    },
    showErrorMsg: {
      type: VueNotifications.types.error,
      title: "Wow-wow",
      message: "That's the error"
    }
  },
  methods: {
    fetchData() {
         this.loading = true
        let dbRef = firebase.database().ref("/FoodDb/");
        let query = dbRef.orderByChild("supplier").equalTo("Dickenson")
          query.on(
            "value",
            response =>{
              this.db = response.val();
              this.loading = false;
            });
      // axios
      //   .get("http://localhost:3000/dickenson")
      //   .then(function (response) { 
      //     this.db = response;
      //     this.loading = false
      //     }.bind(this))
      //     .catch(function() {
      //       this.loading = false;
      //     }.bind(this))
    },
    createPo() {
      if (this.selected.length == 0) {
        return;
      } else {
        let poItems = this.selected;
        const dbRef = firebase.database();
        dbRef.ref("/purchaseOrderItems/").push({
          poItems: poItems
        });
        this.selected = [];
        this.showSuccessMsg();
        //this.$router.push("/po");
        // window.location.reload();
      }
    },
    goToPo() {
      this.$router.push("/po");
    },
    save() {
      this.snack = true;
      this.snackColor = "success";
      this.snackText = "Data saved";
    },
    cancel() {
      this.snack = true;
      this.snackColor = "error";
      this.snackText = "Canceled";
    },
    open() {
      this.snack = true;
      this.snackColor = "info";
      this.snackText = "Dialog opened";
    },
    close() {
      console.log("Dialog closed");
    }
  }
};
</script>




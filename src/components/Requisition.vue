<template>
    <div id="app">
  <v-app id="inspire">
    <div align="center" class="loading" v-if="loading">
      <h1>Loading...</h1>
    </div>
    <h1  align="center" color="grey">Dry Goods Requisition </h1>
    <v-card>
        <v-card-title>
            <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
            ></v-text-field>
            <v-btn large color="red" dark @click="requisition()">Send Request</v-btn>
            <!-- <v-btn small color="black" dark @click="goToPo()">Purchase Order List </v-btn> -->
            <!-- <v-btn small color="black" dark @click="na()">Test </v-btn> -->
        </v-card-title>
      <v-data-table
        :search="search"
        :headers="headers"
        :items="databz"
        item-key="code"
        hide-actions
      >
       <!-- hide-actions -->
        <template slot="items" slot-scope="props">
          <td align="center" class="text-xs">{{ props.item.code }}</td>
          <td align="center" class="text-xs">{{ props.item.description }}</td>
          <td align="center" class="text-xs">{{ props.item.size }}</td>
          <td align="center" class="text-xs">{{ props.item.m1_ea }}</td>
          <td align="center" class="text-xs">{{ props.item.received_qty_ea }}</td>
          <td  align="center" class="text-xs">
            <v-edit-dialog
              :return-value.sync="props.item.ordered_ea"
              large
              lazy
              persistent
              @save="save(props.item)"
              @cancel="cancel"
              @open="open(props.item)"
              @close="close"
            >
              <div class="text-xs">{{ props.item.ordered_ea }}</div>
              <div slot="input" class="mt-3 title">Requested Qty</div>
              
              <v-text-field
                type="number"
                :disabled="disabled"
                min=0
                slot="input"
                v-model.number="props.item.ordered_ea"
                label="Edit"
                single-line
                counter
                autofocus
              ></v-text-field>
            </v-edit-dialog>
            
          </td>
          <td align="center" class="text-xs">{{ props.item.closing_ea }}</td>
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
  name: "Requisition",
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
    },
    disabled() {
      return this.isDisabled;
    }
  },
  data() {
    return {
      db: [],
      search: "",
      selected: [],
      currentItem: {},
      reqItems: [],
      snack: false,
      snackColor: "",
      snackText: "",
      loading: false,
      isDisabled: false,
      // max25chars: v => v.length <= 25 || "Input too long!",
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
        { text: "Name", value: "description", align: "left" },
        { text: "Size", value: "size", align: "left" },
        { text: "Open Qty", value: "m1_ea", align: "left" },
        { text: "Purchased Qty", value: "received_qty_ea", align: "left" },
        { text: "Requesting Qty", value: "ordered_ea", align: "left" },
        { text: "Curr. Stock Qty", value: "closing_ea", align: "left" }
      ]
    };
  },
  notifications: {
    showSuccessMsg: {
      type: VueNotifications.types.success,
      title: "Well Done",
      message: "Your Stock is updated!"
    },
    showErrMsg: {
      type: VueNotifications.types.error,
      title: "To request:",
      message: "First click under 'Requesting qty' for request amount!"
    },
    showWarnMsg: {
      type: VueNotifications.types.warn,
      title: "Opps",
      message: "Cannot request item not on stock!"
    },
    showErrorMsg: {
      type: VueNotifications.types.error,
      title: "Wow-wow",
      message: "That's the error"
    }
  },
  methods: {
    fetchData() {
      let dbRef = firebase.database().ref("/FoodDb");
      this.loading = true;
      dbRef
        .orderByChild("group")
        .equalTo("Dry Goods")
        .on(
          "value",
          response => ((this.db = response.val()), (this.loading = false))
        );
    },

    save(item) {
      this.currentItem = Object.assign({}, item);
      let currItem = this.currentItem;
      //console.log(currItem.closing_ea);
      currItem.closing_ea =
        +currItem.m1_ea + +currItem.received_qty_ea - +currItem.ordered_ea;
      currItem.m1_ea = currItem.closing_ea;
      currItem.ordered_ea = 0;
      if (currItem.closing_ea < 0) {
        currItem.closing_ea = 0;
        currItem.ordered_ea = 0;
        this.showWarnMsg();
        // return (this.isDisabled = true);
        //this.$refs.form.reset(0);
        return this.cancel();
      }
      //console.log(currItem);

      this.reqItems.push(this.currentItem);
      console.log(this.reqItems);
      this.snack = true;
      this.snackColor = "success";
      this.snackText = "Data saved";
    },
    cancel() {
      this.snack = true;
      this.snackColor = "error";
      this.snackText = "Canceled";
    },
    open(item) {
      this.isDisabled = false;
      this.currentItem = Object.assign({}, item);
      let currItem = this.currentItem;
      //console.log(currItem.closing_ea);
      currItem.closing_ea =
        +currItem.m1_ea + +currItem.received_qty_ea - +currItem.ordered_ea;
      if (isNaN(currItem.closing_ea) == true) {
        currItem.closing_ea = 0;
        currItem.ordered_ea = 0;
        this.isDisabled = true;
        this.showWarnMsg();
        //return this.close();
      }
      this.snack = true;
      this.snackColor = "info";
      this.snackText = "Dialog opened";
    },
    close() {
      console.log("Dialog closed");
    },
    requisition() {
      const db = firebase.database();
      const dbRef = firebase.database().ref("/FoodDb/");
      //console.log(this.reqItems);
      if (this.reqItems.length == 0) {
        return this.showErrMsg();
      } else {
        let objects = this.reqItems;
        //push to db
        for (let j = 0; j < objects.length; j++) {
          dbRef.once("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              let childKey = childSnapshot.key;
              let childData = childSnapshot.val();
              if (childData.no == objects[j].no) {
                // let newNo =
                //   +objects[j].received_qty_ea + +childData.received_qty_ea;
                // objects[j].received_qty_ea = newNo;
                db.ref("/FoodDb/" + childKey).set(objects[j]);
                // db.ref("/FoodDb/" + childKey).remove;
              }
            });
          });
        }
        this.reqItems = [];
        this.showSuccessMsg();
      }
    }
  }
};
</script>




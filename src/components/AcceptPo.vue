<template>
    <div id="app">
  <v-app id="inspire">
    <h1  align="center" color="grey">Your Purchase Orders</h1>
    <v-card>
    <!-- <v-btn align="right" color="black" dark small @click="getPdf()">Retrieve PO</v-btn> -->
    
    <v-btn @click="getSelected()" primary dark >Get Invoice</v-btn>
    <!-- <v-btn  primary dark v-on:click.stop="dialog = true">Get Invoice</v-btn> -->
    <!-- {{dialog}} -->
    <v-dialog v-model="dialog"  transition="dialog-bottom-transition" width="80%" fullscreen hide-overlay>
      <v-card>
        <v-toolbar dark class="primary">
          <v-btn  dark icon @click.native="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Invoice Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <!-- <v-btn dark flat v-model="acceptedOrderMsg" @click.native="dialog = false">Accept Order</v-btn> -->
            <v-btn dark flat  @click="acceptedOrder">Accept Order</v-btn>
          </v-toolbar-items>
        </v-toolbar>
                <v-card>
                  <v-container grid-list-md text-xs-center>
                <v-data-table
                  :headers="itemheaders"
                  :items="finalPoItem"
                  item-key="orderNo"
                  hide-actions
                >
                  <template slot="items" slot-scope="props">
                    <td class="text-xs">{{ props.item.code }}</td>
                    <td class="text-xs" >{{ props.item.description }}</td>
                    <td class="text-xs">{{ props.item.size }}</td>
                    <td class="text-xs">{{ props.item.price_ea }}</td>
                    <td class="text-xs">{{ props.item.ordered_ea }}</td>
                   <td class="text-xs"> <v-edit-dialog
                    :return-value.sync="props.item.received_qty_ea"
                    large
                    lazy
                    persistent
                    @save="save"
                    @cancel="cancel"
                    @open="open"
                    @close="close"
                  >
                    {{ props.item.received_qty_ea }}
                    <div slot="input" class="mt-3 title">Update Stock Value</div>
                    <v-text-field
                      type="number"
                      align= "center"
                      slot="input"
                      v-model.number="props.item.received_qty_ea"
                      :rules="[max25chars]"
                      label="Edit"
                      single-line
                      counter
                      autofocus
              ></v-text-field>
            </v-edit-dialog>
             </td>
                    <!-- <td class="text-xs">{{ props.item.stock_value }}</td> -->
                  </template>
                  <v-alert slot="no-results" :value="true" color="error" icon="warning">
                    Your search for "{{ search }}" found no results.
                  </v-alert>
                </v-data-table>
              </v-container>
              </v-card>
        <!-- <v-card-actions>
          <v-btn flat class="orange--text">Share</v-btn>
          <v-btn flat class="orange--text">Explore</v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>
 
    <v-container grid-list-md text-xs-center> 
      <v-data-table
        :search="search"
        :headers="headers"
        :items="databz"
        item-key="orderNo"
      >
        <template slot="items" slot-scope="props">
          <td >
          <v-radio-group
          row
          class="justify-top"
            v-model="selected"
            name="rowSelector">
            <v-radio class="let" :value="props.item.orderNo" :key="props.item.orderNo"/>
          </v-radio-group>
        </td>
          <td class="text-xs">{{ props.item.date }}</td>
          <td class="text-xs">{{ props.item.supplier }}</td>
          <td class="text-xs">{{ props.item.orderNo }}</td>
          <td class="text-xs">{{ props.item.orderedBy }}</td>
          <td class="text-xs">£{{ props.item.total }}</td>
          <td class="text-xs">{{ props.item.status }}</td>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
    </v-container>
    </v-card>
  </v-app>
</div>
</template>

<script>
import axios from "axios";
import * as firebase from "firebase";
import VueNotifications from "vue-notifications";

export default {
  name: "Delivery",
  created() {
    this.fetchOrders();
  },
  watch: {
    // call again the method if the route changes
    $route: "fetchData"
  },
  computed: {
    databz() {
      let items = this.db;
      console.log(items);
      var array = [];
      for (var key in items) {
        let obj = items[key];
        array.push(obj);
      }
      return (this.db = array);
    }
  },
  data() {
    return {
      db: [],
      search: "",
      items: [],
      finalPoItem: [],
      radioGroup: 1,
      selected: [],
      pagination: {},
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      snack: false,
      snackColor: "",
      snackText: "",
      max25chars: v => v.length <= 25 || "Input too long!",
      itemheaders: [
        {
          text: "Items Code",
          align: "left",
          sortable: false,
          value: "code"
        },
        { text: "Name", value: "description" },
        { text: "Size", value: "size" },
        { text: "Price", value: "price_ea" },
        { text: "Ordered Qty", value: "ordered_ea", align: "left" },
        { text: "Received Qty", value: "received_qty_ea", align: "left" }
        // { text: "Remove Item", value: "description", sortable: false }
      ],
      headers: [
        {
          text: "Invoice",
          align: "left",
          sortable: false,
          value: "date"
        },
        {
          text: "Order Date",
          align: "left",
          sortable: true,
          value: "date"
        },
        { text: "From Supplier", value: "supplier" },
        { text: "Ordered Id", value: "orderNo" },
        { text: "Ordered By", value: "orderedby" },
        { text: "Total of Order", value: "total" },
        { text: "Status", value: "status" }
      ]
    };
  },
  notifications: {
    showSuccessSavedOrder: {
      type: VueNotifications.types.success,
      title: "Well Done!",
      message: "Your stock has been updated!"
    },
    showErrMsg: {
      type: VueNotifications.types.error,
      title: "Opps",
      message: "Please select order"
    }
  },
  methods: {
    fetchOrders() {
      let dbRef = firebase.database().ref("/savedPurchaseOrders/");
      dbRef.on("value", response => (this.db = response.val()));

      // axios
      //   .get("http://localhost:3000/orders")
      //   .then(response => (this.db = response));
    },
    getSelected() {
      if (this.selected.length == 0) {
        return this.showErrMsg();
      }
      this.dialog = true;
      let selected = this.selected;
      let orders = this.db;
      let finalPoItem = [];

      for (let j = 0; j < orders.length; j++) {
        if (orders[j].orderNo == selected) {
          this.finalPoItem = orders[j].finalPoItems;
        }
      }
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
      //return this.showSuccessSavedOrder();
    },
    acceptedOrder() {
      //write into db
      const db = firebase.database();
      const dbRef = firebase.database().ref("/FoodDb/");

      let objects = this.finalPoItem;
      for (let j = 0; j < objects.length; j++) {
        dbRef.once("value", function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            let childKey = childSnapshot.key;
            let childData = childSnapshot.val();
            if (childData.no == objects[j].no) {
              let newNo =
                +objects[j].received_qty_ea + +childData.received_qty_ea;
              objects[j].received_qty_ea = newNo;
              db.ref("/FoodDb/" + childKey).set(objects[j]);
              // db.ref("/FoodDb/" + childKey).remove;
            }
          });
        });
      }
      //change status to received
      //console.log(this.selected);
      let selected = this.selected;
      let orders = this.db;

      for (let j = 0; j < orders.length; j++) {
        if (orders[j].orderNo == selected) {
          orders[j].status = "Received";
          //console.log(orders[j]);
          //this.finalPoItem = orders[j].status;
          const posRef = firebase.database().ref("/savedPurchaseOrders/");
          posRef.once("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              let childKey = childSnapshot.key;
              let childData = childSnapshot.val();
              if (childData.orderNo == orders[j].orderNo) {
                //console.log(orders[j]);
                db.ref("/savedPurchaseOrders/" + childKey).set(orders[j]);
              }
            });
          });
        }
      }

      this.dialog = false;
      return this.showSuccessSavedOrder();
    }
  }
};
</script>
<style scoped>
.flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>





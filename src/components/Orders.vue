// https://vuetifyjs.com/en/components/data-tables
<template>
    <div id="app">
  <v-app id="inspire">
    <h1  align="center" color="grey">Your Purchase Orders</h1>
    <v-card>
        <!-- <v-card-title>
            <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
            ></v-text-field>
            <v-btn large color="green" dark small @click="createPo()">Add Selected Items to Po</v-btn>
        </v-card-title> -->
    <v-btn align="right" color="black" dark small @click="getPdf()">Retrieve PO</v-btn>
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
          
          <!-- <td class="text-xs">{{ props.item.code }}</td> -->
          <td class="text-xs">{{ props.item.date }}</td>
          <td class="text-xs">{{ props.item.supplier }}</td>
          <td class="text-xs">{{ props.item.orderNo }}</td>
          <td class="text-xs">{{ props.item.orderedBy }}</td>
          <td class="text-xs">£{{ props.item.total }}</td>
        
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

export default {
  name: "Orders",
  created() {
    this.fetchOrders();
    this.fetchUrls();
  },
  watch: {
    // call again the method if the route changes
    $route: "fetchData"
  },
  computed: {
    databz() {
      let items = this.db;
      //console.log(items)
      var array = [];
      for (var key in items) {
        let obj = items[key];
        array.push(obj);
      }
      return (this.db = array);

      //-----------------
      // let items = this.db.data;
      // var array = [];
      // for (var key in items) {
      //   let obj = items[key];
      //   for (var k in obj) {
      //     array.push(obj[k]);
      //   }
      // }
      // let merged = array.flat(1);
      // return (this.db = merged);
    }
  },
  data() {
    return {
      db: [],
      search: "",
      items: [],
      urls: [],
      selectedUrl: "",
      radioGroup: 1,
      selected: [],
      pagination: {},
      headers: [
        {
          text: "Pdf",
          align: "left",
          sortable: false,
          value: "date"
        },
        {
          text: "Order Date",
          align: "left",
          sortable: false,
          value: "date"
        },
        { text: "From Supplier", value: "supplier" },
        { text: "Ordered Id", value: "orderNo" },
        { text: "Ordered By", value: "orderedby" },
        { text: "Total of Order", value: "total" }
      ]
    };
  },
  // firebase() {
  //   return {
  //     urls: firebase.database().ref("/purchaseOrderPdfUrls/")
  //   };
  // },
  methods: {
    fetchOrders() {
      // axios
      //   .get("http://localhost:3000/orders")
      //   .then(response => (this.db = response));
      // var self = this;
      let dbRef = firebase.database().ref("/savedPurchaseOrders/");
      // let orders;
      // this.db = orders;

      dbRef.on(
        "value",
        response =>
          //console.log(response.val());
          // var self = this;
          // console.log(self.db);
          //orders = response.val();
          (this.db = response.val())
      );
    },
    fetchUrls() {
      // axios
      //   .get("http://localhost:3000/urls")
      //   .then(response => (this.urls = response));
      let dbRef = firebase.database().ref("/purchaseOrderPdfUrls/");
      dbRef.on("value", response => (this.urls = response.val()));
    },

    getPdf() {
      //console.log(this.urls);
      let urlObj = this.urls;
      console.log(urlObj);
      var array = [];
      for (var key in urlObj) {
        let obj = urlObj[key];
        //for (var k in obj) {
        array.push(obj);
        // }
      }
      let mergedUrls = array.flat(1);
      // console.log(mergedUrls);
      //return (this.db = merged);

      let selected = this.selected;
      let orders = this.db;
      for (let j = 0; j < orders.length; j++) {
        //console.log(orders[j].orderNo);
        if (orders[j].orderNo == selected) {
          let selectedUrl = mergedUrls[j].poUrl;
          console.log(selectedUrl);
          window.open(selectedUrl);
        }
      }

      // console.log(getPoz(selected));
      // let dbRef = firebase.database().ref("/purchaseOrderPdfUrls/");
      // let orders;
      // dbRef.once("value", response => {
      //   let urls = response.val();
      //   console.log(urls);
      //   var array = [];
      //   for (var key in urls) {
      //     let obj = urls[key];
      //     for (var k in obj) {
      //       array.push(obj[k]);
      //     }
      //   }
      //   let mergedUrls = array.flat(1);
      //   console.log(merged);
      // });
    }
  }
  //}
};
</script>
<style scoped>
.flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>





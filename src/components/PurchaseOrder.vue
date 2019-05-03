// https://vuetifyjs.com/en/components/data-tables
<template>
    <div id="app">
      <div align="center" class="loading" v-if="loading">
      <h1>Loading...</h1>
    </div>
  <v-app id="inspire">
      <h2  align="center" color="grey">ILEC Purchase Order</h2>
     <v-layout>
        <v-flex >
          <!-- <v-text-field box 
              prepend-inner-icon="place" single-line  v-model="orderedby"  name="orderedby" label="Ordered By" id="orderedby"></v-text-field>  -->
          <v-container justify-center grid-list-md text-xs-center>
         <label >Supplier - {{ supplier }}</label>
         <v-divider
              class="mx-2"
              inset
              horizontal
            ></v-divider>
         <label align="center">Order Number - {{ getOrderN }}</label>
         <v-divider
              class="mx-2"
              inset
              horizontal
            ></v-divider>
         <label align="center">Date of order - {{ currdate }}</label>
         <v-divider
              class="mx-2"
              inset
              horizontal
            ></v-divider>
        <v-flex xs12 sm6 offset-sm3>
          <label>Ordered By-
            <input
              class="inputfld"
              typle="text"
              required
              v-model="orderedby"  name="orderedby"  id="orderedby"
            > </label>
          </v-flex>        
    </v-container>       
    <v-card>
        <v-card-title data-html2canvas-ignore="true">
          <v-text-field
            
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
            ></v-text-field>
               <v-spacer>
            </v-spacer>
            <v-btn small  color="red" dark  @click="createPo()">Save Purchase order</v-btn>
            <v-divider
          
              class="mx-2"
              inset
              vertical
            ></v-divider>
            <v-btn small color="blue" dark @click="reloadPage()">Refresh Page</v-btn> 
            <v-divider
          
              class="mx-2"
              inset
              vertical
            ></v-divider>
            <v-btn small color="black" dark @click="clearPo()">Clear Po</v-btn> 
            <!-- <v-btn small color="blue" dark @click="createPDF()">Testo</v-btn>    -->
            <v-spacer>
            </v-spacer>
            <v-divider
              class="mx-2"
              inset
              vertical
            ></v-divider>           
        </v-card-title>
        <h3 align="center">Order Total: £{{ totalOrder }}</h3>
      <v-data-table
        :search="search"
        :headers="headers"
        :items="databz"
        item-key="no"
        hide-actions
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs">{{ props.item.supplier }}</td>
          <td class="text-xs">{{ props.item.code }}</td>
          <td class="text-xs" >{{ props.item.description }}</td>
          <td class="text-xs">{{ props.item.size }}</td>
          <td class="text-xs">£{{ props.item.price_ea }}</td>
          <td class="text-xs">
            <v-edit-dialog
              :return-value.sync="props.item.ordered_ea"
              large
              lazy
              persistent
              @save="save"
              @cancel="cancel"
              @open="open"
              @close="close"
            >
              {{ props.item.ordered_ea }}
              <div slot="input" class="mt-3 title">Update Stock Value</div>
              <v-text-field
                type="number"
                slot="input"
                v-model.number="props.item.ordered_ea"
                label="Edit"
                single-line
                counter
                autofocus
              ></v-text-field>
            </v-edit-dialog>
          </td>
          <td class="text-xs">£{{ props.item.tsum }}</td>
          <td class="justify-center layout px-0"><v-icon
              small
              @click="deleteItem(props.item)"
            >
              delete
            </v-icon>
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
   </v-flex>
  </v-layout>    
  </v-app>
</div>
</template>

<script>
import axios from "axios";
import * as firebase from "firebase";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import VueNotifications from "vue-notifications";
import VueLocalStorage from "vue-localstorage";

export default {
  name: "PurchaseOrder",
  created() {
    this.fetchData();
    this.getCurrDate();
    this.ls();
  },
  watch: {
    // call again the method if the route changes
    $route: "fetchData"
  },
  computed: {
    databz() {
      let items = this.db;
      var array = [];
      for (var key in items) {
        let obj = items[key];
        for (var k in obj) {
          array.push(obj[k]);
        }
      }
      let merged = array.flat(1);

      if (localStorage.getItem("items") !== null) {
        let items = JSON.parse(localStorage.getItem("items"));
        //this.db = items
        //push to array
        let array = [];
        for (let key in items) {
          array.push(items[key].ordered_ea);
        }
        let arr = array.map(function(x) {
          return parseInt(x, 10);
        });
        //loop trough object
        //let db = this.db;
        let i = 0;
        for (let obj of merged) {
          obj.ordered_ea = arr[i];
          i = i + 1;
        }
        return (this.db = merged);
      } else {
        return (this.db = merged);
      }
    },
    getOrderN() {
      this.orderNo = Math.floor(10000000 + Math.random() * 90000000);
      //console.log(this.orderNo);
      return this.orderNo;
    }
    // getDb() {
    //   this.db = JSON.parse(localStorage.getItem("db"));
    //   console.log(db);
    // }

    // lStorage() {
    //   this.$localStorage.put("items", JSON.stringify(this.items));
    //   //this.props.items = localStorage.items;
    // }
  },
  data() {
    return {
      db: [],
      pdf: "",
      items: [],
      orderedby: "",
      loading: false,
      supplier: "",
      currdate: "",
      orderNo: "",
      search: "",
      selected: [],
      totalPrice: [],
      totalOrder: null,
      snack: false,
      snackColor: "",
      snackText: "",
      max25chars: v => v.length <= 25 || "Input too long!",
      pagination: {},
      headers: [
        { text: "Supplier", value: "supplier" },
        {
          text: "Items Code",
          align: "left",
          sortable: false,
          value: "code"
        },
        { text: "Name", value: "description" },
        { text: "Size", value: "size" },
        { text: "Price", value: "price_ea" },
        { text: "Order Quantity", value: "ordered_ea" },
        { text: "Total (£)", value: "tsum" },
        { text: "Remove Item", value: "description", sortable: false }
      ]
    };
  },
  notifications: {
    showSuccessSavedOrder: {
      type: VueNotifications.types.success,
      title: "Well Done!",
      message: "Your Purchase order saved!"
    },
    showInfoMsg: {
      type: VueNotifications.types.info,
      title: "Hey you",
      message: "Here is some info for you"
    },
    showWarnMsg: {
      type: VueNotifications.types.warn,
      title: "Opps",
      message: "That's the kind of warning"
    },
    showErrMadeByWho: {
      type: VueNotifications.types.error,
      title: "Wow-wow",
      position: "toast-top-center",
      message:
        "Your Order cannot be saved! Please fill up -> Ordered by field! "
    },
    showErrQtyEmpty: {
      type: VueNotifications.types.error,
      title: "Wow-wow",
      message:
        "Your Order cannot be saved! Please set order quantity! It cannot be 0!"
    },
    showErrDiferSuppliers: {
      type: VueNotifications.types.error,
      title: "Opps!",
      message:
        "Your Order could not be saved, either it contains items from different suppliers or item order quantity is 0 ! Please review your orderlist"
    }
  },
  methods: {
    fetchData() {
      let dbRef = firebase.database().ref("/purchaseOrderItems/");
      dbRef.on("value", response => (this.db = response.val()));
    },
    ls() {
      //let db;
      let items;
      if (localStorage.getItem("items")) {
        items = JSON.parse(localStorage.getItem("items"));
        this.db = items;
      } else {
        items = [];
      }
    },
    reloadPage() {
      window.location.reload();
      this.fetchData();
    },
    save() {
      this.snack = true;
      this.snackColor = "success";
      this.snackText = "Data saved";
      this.calcTotalAmount();
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
      //console.log("Dialog closed");
    },
    hide() {
      this.isHidden = true;
    },
    calcTotalAmount() {
      let items = this.db;
      if (items.length == 0) {
        this.totalOrder = 0;
      }
      let orderQty = [];
      for (let element in items) {
        orderQty.push(items[element].ordered_ea);
      }
      let price = [];
      for (let element in items) {
        price.push(items[element].price_ea);
      }

      //get total *
      let totalPrice = [];
      for (let i = 0; i < orderQty.length; i++) {
        totalPrice.push(orderQty[i] * price[i]);
      }
      let propertyName = "tsum";
      let i = 0;
      for (let element in items) {
        items[element][propertyName] = Number(totalPrice[i].toFixed(2));
        i = i + 1;
      }
      //Add up total
      let totalOrder = [];
      totalOrder = totalPrice.reduce(add, 0);
      function add(accumulator, a) {
        return accumulator + a;
      }
      let totalO = Number(totalOrder.toFixed(2));
      this.totalOrder = totalO;

      this.items = items;
      this.getSupplier();
    },
    deleteItem(item) {
      const index = this.db.indexOf(item);

      this.db.splice(index, 1);
      this.calcTotalAmount();
    },
    getCurrDate() {
      let date_yyyy_mm_dd = new Date().toISOString().split("T")[0];
      let date_hh_mm_mm = new Date()
        .toISOString()
        .split("T")[1]
        .split(".")[0];
      let dateNow = date_yyyy_mm_dd + "__" + date_hh_mm_mm;
      this.currdate = dateNow;
    },
    getSupplier() {
      let items = this.items;
      //place orderQty to local Storage
      this.$localStorage.set("items", JSON.stringify(items));
      var arr = [];
      for (var key in items) {
        arr.push(items[key].supplier);
      }

      function allEqual(arr) {
        return new Set(arr).size == 1;
      }
      if (allEqual(arr) == true) {
        let currSupplier = arr[0];
        this.supplier = currSupplier;
        return this.supplier;
      }
    },
    createPDF() {
      let pdf = new jsPDF("p", "pt", "A4");
      let element = document.getElementById("inspire");
      let width = pdf.internal.pageSize.getWidth();
      //console.log(width);  //264ms
      let height = pdf.internal.pageSize.getHeight();
      //console.log(height); //270
      //let pdfName = this.supplier + this.date;

      html2canvas(element).then(canvas => {
        let date_yyyy_mm_dd = new Date().toISOString().split("T")[0];
        let date_hh_mm_mm = new Date()
          .toISOString()
          .split("T")[1]
          .split(".")[0];
        let cdate = date_yyyy_mm_dd + "__" + date_hh_mm_mm;

        let image = canvas.toDataURL("image/png");

        pdf.addImage(image, "JPEG", 0, 0, width, height);
        pdf.save(cdate + ".pdf");
        let blob = pdf.output("blob");
        let storageRef = firebase.storage().ref();
        let pdfRef = storageRef.child("purchase_order" + cdate);
        pdfRef.put(blob).then(function(snapshot) {
          console.log("Uploaded a blob or file!");
          pdfRef.getDownloadURL().then(function(url) {
            const dbRef = firebase.database();
            dbRef.ref("/purchaseOrderPdfUrls/").push({
              poUrl: url
            });
          });
        });
      });
    },
    clearPo() {
      const dbRef = firebase.database();
      dbRef.ref("/purchaseOrderItems/").set(null);

      localStorage.clear();

      this.totalOrder = null;
      this.db = [];
      return this.fetchData();
      // window.location.reload();
    },
    createPo() {
      let dateNow = this.currdate;
      let finalPoItems = this.items;
      if (this.orderedby.length == 0) {
        return this.showErrMadeByWho();
      }
      if (this.totalOrder === 0) {
        return this.showErrQtyEmpty();
      }

      this.getSupplier();
      if (this.supplier.length == 0) {
        return this.showErrDiferSuppliers();
      } else {
        const dbRef = firebase.database();
        dbRef.ref("/savedPurchaseOrders/").push({
          finalPoItems: finalPoItems,
          supplier: this.supplier,
          orderedBy: this.orderedby,
          orderNo: this.orderNo,
          date: this.currdate,
          total: this.totalOrder,
          status: "Not received"
        });
        this.createPDF();
        this.clearPo();
        localStorage.clear();
        //window.location.reload();
        this.showSuccessSavedOrder();
        this.$router.push("/dashboard");
      }
    }
  }
};
</script>
<style scoped>
.inputfld {
  border: 1px solid red;
  border-radius: 6px;
}
</style>





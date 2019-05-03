<template>
  <div id="app">
  <v-app id="inspire">
      <v-parallax
      dark
      src="food.jpg"
    >
      <v-layout
        align-center
        column
        justify-center
      >
       
    
    <div class="text-xs-center">
      <v-menu
        bottom
        origin="center center"
        transition="scale-transition"
      >
        <v-btn
          large
          slot="activator"
          color="light-green"
          dark
        >
          SUPPLIERS
        </v-btn>
  
        <v-list>
          <v-list-tile
            v-for="(item, i) in suppliers"
            :key="i"
            @click="updateSelected(item)"
          >
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-menu
        bottom
        origin="center center"
        transition="scale-transition"
      >
        <!-- <v-btn
          large
          slot="activator"
          color="green"
          dark
        >
          CATEGORIES
        </v-btn> -->
  
        <v-list>
          <v-list-tile
            v-for="(item, i) in categories"
            :key="i"
            @click="updateSelected(item)"
          >
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-menu
        bottom
        origin="center center"
        transition="scale-transition"
      >
        <!-- <v-btn
          large
          slot="activator"
          color="black"
          dark
        >
          GROUP
        </v-btn> -->
  
        <v-list>
          <v-list-tile
            v-for="(item, i) in group"
            :key="i"
            @click="updateSelected(item)"
          >
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <!-- <p>You have choosen 
              <span class="highlight">{{this.selectedPlace}}</span>
            </p> -->
    </div>
    <div align="center">
            <v-divider
              class="mx-2"
              inset
              horizontal
            ></v-divider> 
      <v-btn large color="red" dark @click="goToPo()">Purchase Orders</v-btn> 
       <v-divider
              class="mx-2"
              inset
              horizontal
            ></v-divider> 
      <v-btn large color="brown" dark @click="goToDeliveres()">Deliveries</v-btn>  
       <v-divider
              class="mx-2"
              inset
              horizontal
            ></v-divider> 
      <v-btn large color="brown" dark @click="goToRequisition()">Dry Store Requisition</v-btn>  
       <v-divider
              class="mx-2"
              inset
              horizontal
            ></v-divider> 
      <v-btn large color="grey" dark @click="goToOrders()">Purchase Order History</v-btn>   
    </div>
    </v-layout>
    </v-parallax>
  </v-app>
</div>
</template>

<script>
export default {
  name: "Dashboard",
  data: () => ({
    selectedPlace: {},
    showPlaces: false,
    suppliers: [
      { title: "BrakesFrozen", route: "brakesfrozen" },
      { title: "BrakesDry", route: "brakesdry" },
      { title: "Reynolds", route: "reynolds" },
      { title: "Kff", route: "kff" },
      { title: "Dickenson", route: "dickenson" },
      { title: "Swithenbank", route: "swithenbank" },
      { title: "SouthbankFreshFish", route: "directsf" },
      { title: "ExpressChef", route: "echef" },
      { title: "Tchibo", route: "tchibo" },
      { title: "ChilternFood", route: "chiltern" },
      { title: "JohnMower", route: "johnmower" }
    ],
    categories: [
      { title: "Vegetables", route: "brakesfrozen" },
      { title: "Dairyproducts", route: "brakesfrozen" },
      { title: "MenuBuffet(frozen)", route: "brakesfrozen" },
      { title: "Stocks", route: "brakesfrozen" },
      { title: "TeaCoffeCerealsSnacksConf", route: "brakesfrozen" },
      { title: "Spices", route: "brakesfrozen" },
      { title: "PastaRiceBaking", route: "brakesfrozen" },
      { title: "Meat", route: "brakesfrozen" },
      { title: "FishSeafood", route: "brakesfrozen" },
      { title: "Cakes", route: "brakesfrozen" }
    ],
    group: [
      { title: "ChilledGoods" },
      { title: "Dry" },
      { title: "Frozen" },
      { title: "BfsItems" }
    ]
  }),
  methods: {
    atClick(e) {
      //this.$refs.yourRef.value
      console.log(this.clickedButton);
      //this.clickedButton = e.target.name;
    },
    updateSelected(selectedItem) {
      this.selectedPlace = selectedItem;
      this.showPlaces = true;
      //console.log(this.selectedPlace.route);
      let toGo = this.selectedPlace.route;
      this.$router.push("/" + toGo);
    },
    goToPo() {
      this.$router.push("/po");
    },
    goToOrders() {
      this.$router.push("/orders");
    },
    goToDeliveres() {
      this.$router.push("/deliveries");
    },
    goToRequisition() {
      this.$router.push("/requisition");
    }
  }
};
</script>

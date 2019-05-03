import Vue from "vue";
import Router from "vue-router";
//import Home from "./views/Home.vue";
import Dashboard from "./views/Dashboard.vue";
import Delivery from "./components/AcceptPo.vue";
import Requisition from "./components/Requisition.vue";
import Login from "@/components/User/Login.vue";

//Suppliers
import BrakesFrozen from "@/components/SUPPLIERS/BrakesFrozen";
import BrakesDry from "@/components/SUPPLIERS/BrakesDry";
import Reynolds from "@/components/SUPPLIERS/Reynolds";
import Kff from "@/components/SUPPLIERS/Kff";
import Dickenson from "@/components/SUPPLIERS/Dickenson";
import Swithenbank from "@/components/SUPPLIERS/Swithenbank";
import SouthbankFreshFish from "@/components/SUPPLIERS/SouthbankFreshFish";
import ExpressChef from "@/components/SUPPLIERS/ExpressChef";
import Tchibo from "@/components/SUPPLIERS/Tchibo";
import ChilternFood from "@/components/SUPPLIERS/ChilternFood";
import JohnMower from "@/components/SUPPLIERS/JohnMower";

//Categories
// import Vegetables from "@/components/CATEGORIES/Vegetables";
// import Dairyproducts from "@/components/CATEGORIES/Dairyproducts";
// import MenuBuffet from "@/components/CATEGORIES/MenuBuffet";
// import Stocks from "@/components/CATEGORIES/Stocks";
// import TeaCoffeCerealsSnacksConf from "@/components/CATEGORIES/TeaCoffeCerealsSnacksConf";
// import Spices from "@/components/CATEGORIES/Spices";
// import PastaRiceBaking from "@/components/CATEGORIES/PastaRiceBaking";
// import Meat from "@/components/CATEGORIES/Meat";
// import FishSeafood from "@/components/CATEGORIES/FishSeafood";
// import Cakes from "@/components/CATEGORIES/Cakes";

//Groups
// import ChilledGoods from "@/components/GROUP/ChilledGoods";
// import Dry from "@/components/GROUP/Dry";
// import Frozen from "@/components/GROUP/Frozen";
// import BfsItems from "@/components/GROUP/BfsItems";

import PurchaseOrder from "@/components/PurchaseOrder.vue";
import Orders from "@/components/Orders.vue";

import * as firebase from "firebase";

Vue.use(Router);

let router = new Router({
  routes: [
    // {
    //   path: "/",
    //   name: "home",
    //   component: Home,
    //   meta: {
    //     requiresGuest: true
    //   }
    // },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: "/po",
      name: "PurchaseOrder",
      component: PurchaseOrder,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/deliveries",
      name: "Delivery",
      component: Delivery,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/requisition",
      name: "Requisition",
      component: Requisition,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/orders",
      name: "Orders",
      component: Orders,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
    //SUPPLIERS
    {
      path: "/brakesfrozen",
      name: "BrakesFrozen",
      component: BrakesFrozen,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/brakesdry",
      name: "BrakesDry",
      component: BrakesDry,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/reynolds",
      name: "Reynolds",
      component: Reynolds,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/kff",
      name: "Kff",
      component: Kff,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/dickenson",
      name: "Dickenson",
      component: Dickenson,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/swithenbank",
      name: "Swithenbank",
      component: Swithenbank,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/directsf",
      name: "SouthbankFreshFish",
      component: SouthbankFreshFish,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/echef",
      name: "ExpressChef",
      component: ExpressChef,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/tchibo",
      name: "Tchibo",
      component: Tchibo,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/chiltern",
      name: "ChilternFood",
      component: ChilternFood,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/johnmower",
      name: "JohnMower",
      component: JohnMower,
      meta: {
        requiresAuth: true
      }
    }
    // //CATEGORIES
    // {
    //   path: "/vegetables",
    //   name: "Vegetables",
    //   component: Vegetables,
    //   meta: {
    //     requiresAuth: false
    //   }
    // },
    // {
    //   path: "/dairy",
    //   name: "Dairyproducts",
    //   component: Dairyproducts,
    //   meta: {
    //     requiresAuth: false
    //   }
    // },
    // {
    //   path: "/frozen",
    //   name: "MenuBuffet",
    //   component: MenuBuffet,
    //   meta: {
    //     requiresAuth: false
    //   }
    // },
    // {
    //   path: "/stock",
    //   name: "Stocks",
    //   component: Stocks,
    //   meta: {
    //     requiresAuth: false
    //   }
    // },
    // {
    //   path: "/coffe",
    //   name: "TeaCoffeCerealsSnacksConf",
    //   component: TeaCoffeCerealsSnacksConf,
    //   meta: {
    //     requiresAuth: false
    //   }
    // },
    // {
    //   path: "/spices",
    //   name: "Spices",
    //   component: Spices,
    //   meta: {
    //     requiresAuth: false
    //   }
    // },
    // {
    //   path: "/pasta",
    //   name: "PastaRiceBaking",
    //   component: PastaRiceBaking,
    //   meta: {
    //     requiresAuth: false
    //   }
    // },
    // {
    //   path: "/meat",
    //   name: "Meat",
    //   component: Meat,
    //   meta: {
    //     requiresAuth: false
    //   }
    // },
    // {
    //   path: "/fish",
    //   name: "FishSeafood",
    //   component: FishSeafood,
    //   meta: {
    //     requiresAuth: false
    //   }
    // },
    // {
    //   path: "/cakes",
    //   name: "Cakes",
    //   component: Cakes,
    //   meta: {
    //     requiresAuth: false
    //   }
    // },
    // //GROUP
    // {
    //   path: "/chilled",
    //   name: "ChilledGoods",
    //   component: ChilledGoods,
    //   meta: {
    //     requiresAuth: false
    //   }
    // },
    // {
    //   path: "/dry",
    //   name: "Dry",
    //   component: Dry,
    //   meta: {
    //     requiresAuth: false
    //   }
    // },
    // {
    //   path: "/frozen",
    //   name: "Frozen",
    //   component: Frozen,
    //   meta: {
    //     requiresAuth: false
    //   }
    // },
    // {
    //   path: "/bfsitems",
    //   name: "BfsItems",
    //   component: BfsItems,
    //   meta: {
    //     requiresAuth: false
    //   }
    // }
  ]
});

// Nav Guard
router.beforeEach((to, from, next) => {
  // Check for requiresAuth guard
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if NO logged user
    if (!firebase.auth().currentUser) {
      // Go to login
      next({
        path: "/",
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // Proceed to route
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    // Check if NO logged user
    if (firebase.auth().currentUser) {
      // Go to login
      next({
        path: "/",
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // Proceed to route
      next();
    }
  } else {
    // Proceed to route
    next();
  }
});

export default router;

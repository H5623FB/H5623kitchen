<template>
  <v-app>
    <v-toolbar  dark class="red">
      <v-toolbar-side-icon @click="sideNav = !sideNav" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        
        <router-link to="/dashboard" tag="span" style="cursor: pointer">Dashboard</router-link>
        </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" :to="item.link">
          <v-icon left>{{item.icon}}</v-icon>
          {{ item.title }}
          </v-btn>
          <v-btn v-if="menuItems" flat @click="onLogout" >
          <v-icon left >exit_to_app</v-icon>
          Logout
          </v-btn>
      </v-toolbar-items >
    </v-toolbar>
    <v-navigation-drawer v-model="sideNav">
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>
              {{item.icon}}
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-content >{{item.title}}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="menuItems" @click="onLogout">
          <v-list-tile-action>
            <v-icon>
              exit_to_app
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-content >Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <main>
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>
import * as firebase from "firebase";
export default {
  data() {
    return {
      sideNav: false
    };
  },
  computed: {
    menuItems() {
      let user = firebase.auth().currentUser;
      //console.log(user);
      //let menuItems = [{ icon: "lock_open", title: "Sign In", link: "/" }];
      if (user !== null) {
        let menuItems = [
          {
            icon: "add_shopping_cart",
            title: "Dashboard",
            link: "/dashboard"
          }
        ];
        return menuItems;
      } else {
        let menuItems = [
          { icon: "lock_open", title: "Sign In", link: "/login" }
        ];
        return menuItems;
      }
      //return menuItems;
    }
  },
  methods: {
    onLogout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("/login");
          //vm.$forceUpdate();
        });
    }
  }
};
</script>

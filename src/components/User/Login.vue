<template>
    <v-container>
             <v-layout>
            <v-flex xs12 sm6 offset-sm3>
                <v-card>
                    <v-card-text>
                        <v-container>
                            <form @submit.prevent="onSignin">
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-text-field 
                                        name="email" 
                                        label="Mail" 
                                        id="email"
                                        v-model="email"
                                        type="email"
                                        required></v-text-field>
                                    </v-flex>
                                </v-layout>
                                  <v-layout row>
                                    <v-flex xs12>
                                        <v-text-field 
                                        name="password" 
                                        label="Password" 
                                        id="password"
                                        v-model="password"
                                        type="password"
                                        required></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <!-- <v-layout row>
                                    <v-flex xs12>
                                        <v-text-field 
                                        name="confirmPassword" 
                                        label="Confirm Password" 
                                        id="confirmPassword"
                                        v-model="confirmPassword"
                                        type="password"
                                        required></v-text-field>
                                    </v-flex>
                                </v-layout> -->
                                <v-layout row>
                                    <v-flex>
                                        <v-btn type="submit">Sign In</v-btn>
                                    </v-flex>
                                </v-layout>
                            </form>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import * as firebase from "firebase";
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    onSignin: function(e) {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          () => {
            alert("Logged in");
            this.$router.push("/dashboard");
          },
          err => {
            alert(err.message);
          }
        );
      e.preventDefault();
    }
  }
};
</script>

<style scoped>
.container {
  height: 300vh;
}
</style>

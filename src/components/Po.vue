<template>
    <div>
        <v-container>
        <v-layout>
            <v-flex xs12 sm6 offset-sm3>
                 <v-btn small @click="seeJson()">Vegetables</v-btn>
                <ul>
                    <li v-for="item in text" :key="item.name">
                        {{ item.code }}
                        {{ item.supplier }} 
                        {{ item.description }}
                        {{ item.priceea }}  
                    </li>
                </ul>     
            </v-flex>
        </v-layout>
        </v-container>
    </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
export default {
    name: "Po",
    data(){
        return{
            db: null,
            text: null
        }
    },
    mounted (){
        axios
            .get('http://localhost:3000/fbase')
            .then(response => (this.db = response))
        },
    methods: {
        seeJson(){
            let items = (this.db.data)
            this.text = items
            console.log(items)    
        }
    }
}

</script>

<style scoped>
.container {
  height: 350vh;
  align-items:flex-start;
  padding:0%
}

</style>


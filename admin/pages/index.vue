<template>
  <div>
    <h1>ADMIN</h1>
    <v-divider></v-divider>
    <dash-board-cards />
    <v-row>
      <v-col>
        <categories />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import dashBoardCards from '../components/dashboard/dashBoardCards.vue'
import categories from '../components/dashboard/categories'
export default {
  middleware: 'auth',
  components: {
    dashBoardCards,
    categories,
  }
}
</script>

<style scoped></style>

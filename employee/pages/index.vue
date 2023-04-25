<template>
  <div>
    <dash-board-cards />
  </div>
</template>

<script>
import dashBoardCards from '../components/dashboard/dashboardCards';
export default {
  head() {
    return {
      title: 'Overview'
    }
  },
  components: {
    dashBoardCards
  },
  middleware: 'auth',
}
</script>
<template>
  <div class="pa-1">
    <v-row align-content="space-between" justify="space-between" class="pl-4">
      <v-col cols=12 md=8>
        <h3>Dự án</h3>
      </v-col>
      <v-spacer></v-spacer>
      <v-col md=2 cols=4 class="pl-4 mt-3">
        <v-row>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <p v-bind="attrs" v-on="on" class="appgrey--text">
                <span v-if="month">{{ $moment(month).format('MMM \'YY') }}</span>
                <span v-else>Filter</span>
                <v-icon color="appgrey">
                  mdi-chevron-down
                </v-icon>
              </p>
            </template>
            <v-date-picker v-model="month" type="month" color="appmainblue" elevation="0" min="2021-01"></v-date-picker>
          </v-menu>
          <v-icon color="appgrey" size=20 v-if="month" @click="month = null" class="mb-4 pl-1">
            mdi-close-circle
          </v-icon>
        </v-row>
      </v-col>
    </v-row>
    <v-data-table :headers=headers class="mt-2 pa-2" :items=filteredItems :sort-by="['date']" :sort-desc=[true]>
      <template v-slot:[`item.total`]="{ item }">
        {{ item.work }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  head() {
    return {
      title: 'Work'
    }
  },
  data() {
    return {
      isChanged: false,
      month: null,
      items: [],
      headers: [
        { text: 'Ngày', value: 'date', class: 'appgrey--text' },
        { text: 'Loại', value: 'category', class: 'appgrey--text' },
        { text: 'Giá', value: 'work', class: 'appgrey--text' },
      ],
    }
  },

  async created() {
    try {
      let data = await this.$axios.$get('employee/works')
      data.forEach(d => {
        d.date = this.$moment(d.date).format('Do MMM YYYY')
      })
      this.items = [...data]
    } catch (err) {
      if (err.response) {
        this.message = err.response.data.error
        this.snackbarColor = 'error'
        this.snackbar = true
      } else {
        console.log(err)
      }
    }
  },
  methods: {
    addToWork(w) {
      w.date = this.$moment(w.date).format('Do MMM YYYY')
      this.items.push(w)
    }
  },

  computed: {
    filteredItems() {
      if (this.month) {
        return this.items.filter(item => {
          return this.$moment(this.month).format('MMMMYY').toLowerCase() == this.$moment(item.date).format('MMMMYY').toLowerCase()
        })
      } else {
        return this.items
      }
    },
  }
}
</script>
<template>
  <div>
    <v-row>
      <v-col v-for="(item, i) in items" :key="i" cols=12 md=3>
        <v-card flat class="mt-3 pa-1" max-width="500">
          <v-row no-gutters>
            <v-col class="mt-2">
              <v-card-text>
                <v-icon class="pa-2"
                  :style="{ color: item.color, 'background-color': item.bg_color, 'border-radius': '23%' }">
                  {{ item.icon }}
                </v-icon>
              </v-card-text>
            </v-col>
            <v-col class="pa-2 mr-10 mb-n5">
              <p class="caption appgrey--text">
                {{ item.title }}
              </p>
              <h2 class="mt-n4">
                {{ item.data }}
              </h2>
              <p class="caption appgrey--text">
                {{ item.add }}
              </p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isChanged: false,
      items: [
        { icon: 'mdi-chart-line', data: '0', title: 'Tổng tiền lương', add: '+0', color: '#73cfa6', bg_color: '#daf2e6' },
        { icon: 'mdi-chart-box-outline', data: '0', title: 'Tổng tiền thưởng', add: '+0', color: '#316cf5', bg_color: '#e0eaff' },
        { icon: 'mdi-file-code-outline', data: '0', title: 'Tổng số dự án', add: '+0', color: '#d62f2f', bg_color: '#ffeaea' },
      ]
    }
  },

  async created() {
    try {
      let data = await this.$axios.$get('employee/home/cards')
      this.setItemsData(0, data.currentMonthSalary, data.salaryGrowth)
      this.setItemsData(1, data.currentMonthAdvance, data.advanceGrowth)
      this.setItemsData(2, data.currentMonthWork, data.workGrowth)
    } catch (err) {
      console.log(err)
    }
  },

  methods: {
    setItemsData(inx, data, add) {
      let sign = add >= 0 ? '+' : null
      this.items[inx].data = data
      if (inx == 2) this.items[inx].add = sign + add + ' Dự án'
      else
        this.items[inx].add = sign + add + ' VNĐ'
    }
  }
}
</script>

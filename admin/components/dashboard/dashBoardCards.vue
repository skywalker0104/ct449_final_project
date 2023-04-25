<template>
  <div>
    <v-row>
      <v-col v-for="(item1, i) in items1" :key="i" cols=2 md=6>
        <v-card outlined class="mt-3" color="mainpurple">
          <v-card-title class="white--text">
            {{ item1.title }}
          </v-card-title>
          <v-divider class="mx-2" :dark=true></v-divider>
          <v-card-text>
            <v-row align="center" justify="start" align-content="start">
              <v-icon color="white" size="40" class="mt-1">{{ item1.icon }}</v-icon>
              <h1 class="px-2 pl-2 mt-2 text-h3 font-weight-medium white--text">
                <div v-if="item1.data">
                  {{ item1.data }}
                </div>
                <div v-else>
                  00
                </div>
              </h1>
              <h1 class="mt-2 text-h6 font-weight-light white--text">{{ item1.subtext }}</h1>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(item2, i) in items2" :key="i" cols=2 md=6>
        <v-card outlined class="mt-3" color="mainpurple">
          <v-card-title class="white--text">
            {{ item2.title }}
          </v-card-title>
          <v-divider class="mx-2" :dark=true></v-divider>
          <v-card-text>
            <v-row align="center" justify="start" align-content="start">
              <v-icon color="white" size="40" class="mt-1">{{ item2.icon }}</v-icon>
              <h1 class="px-2 pl-2 mt-2 text-h3 font-weight-medium white--text">
                <div v-if="item2.data">
                  {{ item2.data }}
                </div>
                <div v-else>
                  00
                </div>
              </h1>
              <h1 class="mt-2 text-h6 font-weight-light white--text">{{ item2.subtext }}</h1>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>

export default {
  data() {
    return {
      totEmps: '00',
      items1: [
        { title: 'Số lượng nhân viên', icon: 'mdi-account-outline', data: null, subtext: 'nhân viên' },
        { title: 'Số lượng dự án', icon: 'mdi-file-code-outline', data: null, subtext: 'dự án' },
      ],
      items2: [{ title: 'Tổng lương', icon: 'mdi-credit-card-outline', data: null, subtext: 'VNĐ' },
      { title: 'Tổng thưởng', icon: 'mdi-credit-card-outline', data: null, subtext: 'VNĐ' },],
    }
  },

  async created() {
    try {
      // get total employees
      let data = await this.$axios.$get('admin/employees')
      this.items1[0].data = data.employees.length < 10 ? '0' + data.employees.length : data.employees.length

      // Get Works by Mont
      data = await this.$axios.$get('admin/work')
      let totWork = 0
      if (data.works.length >= 1) {
        data.works.forEach(d => {
          if (this.$moment(d.date).format('YYYY-MM') == this.$moment().format('YYYY-MM')) {
            totWork += 1
          }
        })
        this.items1[1].data = totWork < 10 ? '0' + totWork : totWork
      }

      // Get salary and Advance
      let totSal = 0
      let totAdv = 0
      let temp = await this.$axios.$get('admin/salary')
      if (temp.salaries.length >= 1) {
        temp.salaries.forEach(s => {
          if (this.$moment(s.month).format('YYYY-MM') == this.$moment().format('YYYY-MM')) {
            if (s.type == 'Lương cứng') {
              totSal += s.salary
            } else {
              totAdv += s.salary
            }
          }
        })
        this.items2[1].data = totAdv < 10 ? '0' + totAdv : totAdv
        this.items2[0].data = totSal < 10 ? '0' + totSal : totSal
      }
    } catch (err) {
      console.log(err)
    }
  },
}
</script>

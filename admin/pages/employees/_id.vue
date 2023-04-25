<template>
  <div>
    <edit-dialog :dialog="dialog" :item="employeeData" @edit-employee="editEmployee"></edit-dialog>
    <v-row class="pa-1 mt-3 pl-3" no-gutters>
      <v-col>
        <v-btn icon :to="'/employees'" nuxt color="subtextgrey">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-col>
      <v-row no-gutters justify="end" align="end" class="px-1">
        <v-btn color="mainpurple" class="mr-5 white--text text-capitalize" @click="dialog = !dialog" depressed>
          <v-icon small class="pr-2">mdi-pencil</v-icon>
          Chỉnh sửa
        </v-btn>
        <v-btn color="error" @click="delEmployee" depressed>
          <v-icon small class="pr-2 text-capitalize">mdi-delete</v-icon>
          Xóa
        </v-btn>
      </v-row>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-row>
      <v-col cols="12" md="6" offset-sm="1" offset-md="0">
        <employee-info :employeeData="employeeData" />
      </v-col>
      <v-col offset-sm="1" offset-md="0">
        <v-card max-width="600" elevation="0">
          <v-row class="pa-4">
            <h3 class="textheadpurple--text">Thống kê</h3>
          </v-row>
          <v-divider></v-divider>
          <v-row justify="center" align="center" align-content="center" class="mt-5 ml-1">
            <v-col offset-sm="1">
              <div class="caption"> Dự án đã hoàn thành </div>
              <h1> {{ getTotalWorkDone }} </h1>
            </v-col>
            <v-col>
              <div class="caption"> Mức lương </div>
              <h1> {{ salary }} </h1>
            </v-col>
          </v-row>
          <v-row class="ml-1">
            <v-col offset-sm="1">
              <div class="caption "> Lương thưởng </div>
              <h1> {{ advance }} </h1>
            </v-col>
            <v-col>
              <div class="caption"> Tổng lương </div>
              <h1> {{ getOustanding }} </h1>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-card>
      <v-row class="pa-5" justify="space-between">
        <h4 class="textheadpurple--text">Các dự án đã làm</h4>
        <add-work @add-work="addToWork"></add-work>
      </v-row>
      <v-row>
        <v-col class="mx-4 mt-n6">
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-col>
        <v-data-table :headers=headers :items=works>
          <template v-slot:item.actions="{ item }">
            <v-icon small color="error" class="ml-3" @click="deleteWork(item)">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:item.total="{ item }">
            {{ item.work }}
          </template>
        </v-data-table>
      </v-col>
    </v-card>
  </div>
</template>

<script>
import moment from 'moment'
import employeeInfo from '../../components/employee/employeeInfo'
import editDialog from '../../components/employee/editDialog'

export default {
  components: {
    editDialog,
    employeeInfo
  },
  data() {
    return {
      dialog: false,
      value: 0,
      employeeData: {},
      month: null,
      currentMonth: null,
      days: 31,
      outstanding: 0,
      salary: 0,
      advance: 0,
      totalWorkDone: 0,

      headers: [
        { text: 'Ngày', value: 'date', class: 'textheadpurple--text', sortable: false },
        { text: 'Loại dự án', value: 'category', class: 'textheadpurple--text', sortable: false },
        { text: 'Tên dự án', value: 'work', class: 'textheadpurple--text', sortable: false },
        { text: ' ', value: 'actions', class: 'textheadpurple--text', sortable: false },
      ],
      works: []
    }
  },

  async created() {
    try {
      let data = await this.$axios.$get('admin/employees/' + this.$route.params.id)
      this.employeeData = data.employee
      this.month = moment().format('YYYY-MM')
      this.currentMonth = this.month
      this.getWorks()
      this.getSalaryAndAdvance()
    } catch (err) {
      console.log(err);
    }
  },

  methods: {
    sumField(key) {
      return this.works.reduce((a, b) => a + (b[key] || 0), 0)
    },

    formattedDate(d) {
      return d ? moment(d).format('DD MMM YYYY') : ''
    },

    async getSalaryAndAdvance() {
      try {
        this.salary = 0
        this.advance = 0
        let salaries = this.employeeData.salaries.filter(s => moment(s.month).format('YYYY-MM') === this.month)
        if (salaries.length >= 1) {
          salaries.forEach((s) => {
            if (s.type === 'Lương cứng') {
              this.salary += s.salary
            } else {
              this.advance += s.salary
            }
          })
        }
      } catch (err) {
        console.log(err)
      }
    },

    async editEmployee(data) {
      try {
        let data = await this.$axios.$post('admin/employees/edit', {
          id: data.id,
          name: data.name,
          date: data.date,
          desg: data.desg,
          email: data.email,
        })
      } catch (err) {
        console.log(err);
      }
    },

    async delEmployee() {
      try {
        let data = await this.$axios.$post('admin/employees/delete', {
          id: this.employeeData._id
        })
        this.$router.push('/employees')
      } catch (err) {
        console.log(err);
      }
    },

    monthChange() {
      try {
        this.getSalaryAndAdvance()
      } catch (err) {
        console.log(err)
      }
    },

    async addToWork(w) {
      try {
        let data = await this.$axios.$post('admin/work/add', {
          date: w.date,
          work: w.work,
          category: w.category,
          employee: this.employeeData
        })
      } catch (err) {
        console.log(err);
      }
    },

    async getWorks() {
      try {
        let data = await this.$axios.$get('admin/work/' + this.employeeData._id)
        if (data.works.length >= 1) {
          data.works.forEach((w) => {
            w.date = w.date ? moment(w.date).format('DD MMM YYYY') : w.date
            this.works.push(w)
            this.totalWorkDone += 1
          })
        }
      } catch (err) {
        console.log(err);
      }
    },

    async deleteWork(item) {
      try {
        let data = await this.$axios.$post('admin/work/delete', {
          id: item._id,
        })
      } catch (err) {
        console.log(err);
      }
    }
  },

  computed: {
    formattedMonth() {
      return this.month ? moment(this.month).format('MMMM').toString() : ''
    },
    compDays() {
      if (this.days) {
        Array.from(this.days).forEach((v) => {
          v.sheetColor = v.employees[0].status
        })
      }
      return this.days
    },

    getTotalWorkDone() {
      return this.totalWorkDone
    },

    getOustanding() {
      this.outstanding = this.salary + this.advance
      return this.outstanding
    },
  },
}
</script>
<template>
  <div>
    <v-dialog max-width="600px" v-model="dialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="mainpurple" class="white--text text-capitalize" v-bind="attrs" v-on="on" @click="dialog = true"
          elevation=0>
          <v-icon class="pr-2 ml-n2">
            mdi-plus-box
          </v-icon>
          Bổ sung
        </v-btn>
      </template>
      <v-card>
        <v-container>
          <v-card-title>
            <h3>Bổ sung lương</h3>
          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field color="mainpurple" label="Ngày" :value="formattedDate" v-bind="attrs" v-on="on"
                    :rules="inputRules"></v-text-field>
                </template>
                <v-date-picker v-model="salDate" color="mainpurple"></v-date-picker>
              </v-menu>
              <v-select :items="employees" label="Nhân viên" v-model="emp_id" item-value="id" :rules="inputRules"
                item-text="name"></v-select>
              <v-text-field color="mainpurple" label="Số tiền" v-model="salary" :rules=numberRules>
              </v-text-field>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field color="mainpurple" label="Tháng" :value="formattedMonth" :rules="inputRules"
                    v-bind="attrs" v-on="on">
                  </v-text-field>
                </template>
                <v-date-picker v-model="month" type="month" color="mainpurple"></v-date-picker>
              </v-menu>
              <v-select :items="selectItems" label="Loại lương" v-model="selectedType" :rules=inputRules></v-select>
              <v-row justify="end">
                <v-btn text class="mainpurple mr-10 mt-3 white--text text-capitalize" @click="submit">Xác nhận</v-btn>
              </v-row>
            </v-form>
          </v-card-text>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      dialog: false,
      item: null,
      salDate: '',
      salary: '',
      emp_id: '',
      month: '',
      selectItems: [
        'Lương cứng',
        'Thưởng'
      ],
      employees: [
      ],
      selectedType: null,
      inputRules: [
        v => !!v || 'Required Field',
      ],
      numberRules: [
        v => !!v || 'Required Field.',
        v => !!Number.isInteger(Number(v)) || 'Enter a valid Number',
        v => Number(v) > 0 || 'Number must be greater than 0.'
      ]
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.item = {
          date: this.salDate,
          employee: this.emp_id,
          salary: this.salary,
          month: this.month,
          type: this.selectedType
        }
        this.$emit('add-salary', this.item)
        this.item = null
        this.dialog = false
        this.salDate = null
        this.emp_id = ''
        this.salary = ''
        this.month = ''
        this.type = null
      }
    }
  },

  async created() {
    try {
      let empData = await this.$axios.$get('admin/employees')
      for (let employee of empData.employees) {
        let temp = {
          id: employee._id,
          name: employee.name
        }
        this.employees.push(temp)
      }
    } catch (err) {
      if (err.response) {
        this.snackbarColor = 'error'
        this.message = err.response.data.error
        this.snackbar = true
      }
    }

  },

  computed: {
    formattedDate() {
      return this.salDate ? moment(this.salDate).format('DD MMM YYYY') : ''
    },
    formattedMonth() {
      return this.month ? moment(this.month).format('MMMM') : ''
    }
  }
}
</script>
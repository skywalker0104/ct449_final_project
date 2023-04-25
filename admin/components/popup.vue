<template>
  <v-dialog max-width="600px" v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="mainpurple" class="white--text text-capitalize" v-bind="attrs" v-on="on" @click="dialog = true">
        <v-icon class="pr-2 ml-n2">
          mdi-plus-box
        </v-icon>
        Nhân viên mới
      </v-btn>
    </template>
    <v-card>
      <v-container>
        <v-card-title>
          <h3 class="textheadpurple--text">Thêm nhân viên</h3>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-text-field color="mainpurple" label="Ngày bắt đầu làm việc" :value="formattedDate" v-bind="attrs"
                  v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="joined" color="mainpurple"></v-date-picker>
            </v-menu>
            <v-text-field color="mainpurple" label="Họ tên" v-model="name"></v-text-field>
            <v-text-field color="mainpurple" label="Vị trí" v-model="designation">
            </v-text-field>
            <v-text-field color="mainpurple" label="Email" v-model="email" :rules="emailRules">
            </v-text-field>
            <v-text-field color="mainpurple" label="Mật khẩu" v-model="password">

            </v-text-field>
            <v-row justify="end">
              <v-btn text class="mainpurple mr-10 mt-3 white--text text-capitalize" @click="submit">Xác nhận</v-btn>
            </v-row>
          </v-form>
        </v-card-text>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      dialog: false,
      item: null,
      joined: null,
      name: '',
      designation: '',
      email: '',
      password: null,
      emailRules: [
        v => !!v || 'Email is required',
        v => v.length >= 4 || 'Email must be more than 4 characters',
        v => {
          let pattern = /^\S+@\S+[\.][0-9a-z]+$/
          return pattern.test(v) || 'Enter a valid email!'
        }
      ],
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.item = {
          date: this.joined,
          name: this.name,
          desg: this.designation,
          email: this.email,
          password: this.password
        }
        this.$emit('add-employee', this.item)
        this.item = null
        this.dialog = false
        this.joined = null
        this.name = ''
        this.designation = ''
        this.password = null
      }
    }
  },
  computed: {
    formattedDate() {
      return this.joined ? moment(this.joined).format('DD MMM YYYY') : ''
    }
  }
}
</script>
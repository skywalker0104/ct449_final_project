<template>
  <div>
    <v-container>
      <v-snackbar v-model="snackbar" :timeout="4000" :color="snackbarColor" top elevation=0 app>
        {{ message }}
      </v-snackbar>
      <h3>Tài khoản</h3>
      <v-row class="mt-2 pa-2" justify="space-around" align-content="space-around">
        <v-col cols=12 md=4 sm=5 class="mb-6">
          <v-card shaped width="200" flat outlined>
            <v-img :src="hostImageUrl + avatar" height='200' width='200' contain>
            </v-img>
          </v-card>
        </v-col>
        <v-col align-self="center" class="mx-auto">
          <v-form ref="form">
            <v-row class="mb-n3">
              <v-col>
                <v-text-field label="Ngày bắt đầu" color="appmainblue" flat v-model="joinedDate" readonly>
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field label="Vị trí" color="appmainblue" v-model="designation" readonly>
                </v-text-field>
              </v-col>
            </v-row>
            <v-text-field label="Email" color="appmainblue" v-model="email" readonly>
              Email
            </v-text-field>
            <v-row>
              <v-col>
                <h3 class="my-1 ">Cập nhật</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field label="Họ và tên" color="appmainblue" flat v-model="name"
                  :rules="[rules.required, rules.nameMax]" @change="isChanged = true">
                </v-text-field>
              </v-col>
            </v-row>
            <v-text-field label="Số điện thoại" color="appmainblue" v-model="phone"
              :rules="[rules.required, rules.number, rules.minPhone, rules.maxPhone]" prefix="+84"
              @change="isChanged = true">
            </v-text-field>
            <v-row>
              <v-col>
                <v-text-field label="Địa chỉ" color="appmainblue" v-model="address"
                  :rules="[rules.required, rules.addMax]" @change="isChanged = true">
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn color="appmainblue" depressed class="white--text mt-2" @click="updateProfile"
                  :disabled="isChanged ? false : true">
                  Xác nhận
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  middleware: 'auth',
  head() {
    return {
      title: 'Profile'
    }
  },
  data() {
    return {
      hostImageUrl: 'http://localhost:5000',
      isChanged: false,
      snackbar: false,
      snackbarColor: '#73cfa6',
      message: null,
      file: null,
      avatar: this.$auth.$state.user.employee.avatar ? this.$auth.$state.user.employee.avatar.url : '/public/images/avatars/default.png',
      joinedDate: this.$moment(this.$auth.user.employee.date).format('MMM Do YYYY'),
      designation: this.$auth.user.employee.desg,
      name: this.$auth.$state.user.employee.name,
      email: this.$auth.$state.user.employee.email,
      phone: this.$auth.$state.user.employee.phone ? this.$auth.$state.user.employee.phone : '',
      address: this.$auth.$state.user.employee.address ? this.$auth.$state.user.employee.address : '',

      rules: {
        required: v => !!v || 'Required Field',
        nameMax: v => (v || '').length <= 20 || 'Max 20 characters',
        email: v => {
          let pattern = /\S+@\S+\.\S+/
          return pattern.test(v) || 'Enter a valid email!'
        },
        emailMax: v => (v || '').length <= 50 || 'Max 50 characters',
        number: v => !!Number.isInteger(Number(v)) && Number(v) > 0 || 'Enter a valid Phone Number',
        maxPhone: v => v.toString().length <= 11 || 'Max 11 Characters',
        minPhone: v => v.toString().length >= 9 || 'Min 9 Characters',
        addMax: v => (v || '').length <= 30 || 'Max 30 characters',
      }
    }
  },
  methods: {
    ...mapActions({
      setTimeInterval: 'timer/setTimeInterval'
    }),
    async updateProfile() {
      try {
        if (this.$refs.form.validate()) {
          let data = await this.$axios.$post('employee/profile/update', {
            name: this.name,
            phone: this.phone,
            address: this.address,
          })
          this.message = data.message
          this.snackbarColor = '#73cfa6'
          this.snackbar = true
        }
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
  },
  computed: {
    ...mapState({
      seconds: state => state.timer.seconds,
      minutes: state => state.timer.minutes,
      clickedFlag: state => state.timer.clicked
    })
  },

}
</script>

<style >
.v-text-field .v-input__control .v-input__slot::before {
  border-style: none;
}
</style>
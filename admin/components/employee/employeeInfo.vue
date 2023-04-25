<template>
  <div>
    <v-card max-width="600" elevation="0">
      <v-row class="pa-4" justify="space-between">
        <h3 class="textheadpurple--text">Thông tin nhân viên</h3>
        <v-dialog max-width="600px" v-model="dialogCopy">
          <template v-slot:activator="{ on, attrs }">
            <v-btn depressed class="error--text text-capitalize subtitle-1 mb-n4" v-bind="attrs" v-on="on"
              @click="dialogCopy = true">
              Đổi mật khẩu
            </v-btn>
          </template>
          <v-card>
            <v-container>
              <v-card-title>
                Đổi mật khẩu
              </v-card-title>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field v-model="password" color="mainpurple" label="Mậu khẩu" :rules="[rules.required]"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'"
                    @click:append="show = !show">
                  </v-text-field>
                  <v-text-field v-model="confPassword" color="mainpurple" label="Xác nhận mật khẩu"
                    :rules="[rules.required, rules.matchPassword,]" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show ? 'text' : 'password'" @click:append="show = !show">
                  </v-text-field>
                </v-form>
                <v-btn @click="changePassword" color="mainpurple" depressed class="white--text">Thay đổi</v-btn>
              </v-card-text>
            </v-container>
          </v-card>
        </v-dialog>
      </v-row>
      <v-divider></v-divider>
      <v-row class="pa-7 pb-10 mt-n3" justify="center" align="center" align-content="center">
        <v-col class="mr-5 pt-5" cols="12" lg="4" align-self="center" offset="5" offset-sm="7" offset-md="0">
          <v-avatar size="160" rounded>
            <v-img contain :src="hostImageUrl">
            </v-img>
          </v-avatar>
        </v-col>
        <v-col class="mb-n7" offset="1" offset-sm=2 offset-md="0">
          <v-row class="mt-n3">
            <v-col cols="5">
              <h4 class="subtextgrey--text subtitle-1 text-capitalize">Ngày bắt đầu: </h4>
            </v-col>
            <v-col cols="6">
              <h4 class="textheadpurple--text">{{ $moment(employeeData.date).format('DD MMM YYYY') }}</h4>
            </v-col>
          </v-row>
          <v-row class="mt-n5">
            <v-col cols="5">
              <h4 class="subtextgrey--text subtitle-1 text-capitalize">Họ tên: </h4>
            </v-col>
            <v-col cols="6">
              <h4 class="textheadpurple--text text-capitalize">{{ employeeData.name }}</h4>
            </v-col>
          </v-row>
          <v-row class="mt-n5">
            <v-col cols="5">
              <h4 class="subtextgrey--text subtitle-1 text-capitalize">Email: </h4>
            </v-col>
            <v-col cols="6">
              <h4 class="textheadpurple--text ">{{ employeeData.email }}</h4>
            </v-col>
          </v-row>
          <v-row class="mt-n5">
            <v-col cols="5">
              <h4 class="subtextgrey--text subtitle-1 text-capitalize">Vị trí: </h4>
            </v-col>
            <v-col cols="6">
              <h4 class="textheadpurple--text text-capitalize">{{ employeeData.desg }}</h4>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ['employeeData'],
  data() {
    return {
      hostImageUrl: 'http://localhost:5000/public/images/avatars/default.png',
      show: false,
      password: null,
      confPassword: null,
      dialogCopy: this.dialog,
      chipColor: null,
      rules: {
        required: v => !!v || 'Required Field',
        matchPassword: () => (this.password === this.confPassword) || 'Passwords do not match',
      }
    }
  },
  methods: {
    async changePassword() {
      try {
        if (this.$refs.form.validate()) {
          let data = await this.$axios.$post('admin/employees/changepassword', {
            id: this.employeeData._id,
            password: this.password,
            confPassword: this.confPassword
          })
          this.dialogCopy = false
        }
      } catch (err) {
        console.log(err)
      }
    }
  },
  computed: {
    computedChipColor() {
      if (this.employeeData.status === 'Disabled') {
        return 'red'
      } else if (this.employeeData.status === 'Active') {
        return 'success'
      } else {
        return null
      }
    },
    whiteText() {
      if (this.employeeData.status === 'Disabled' || this.employeeData.status === 'Active') {
        return 'white--text'
      } else {
        return null
      }
    }
  },
}
</script>
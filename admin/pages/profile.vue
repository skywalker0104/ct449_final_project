<template>
  <div>
    <v-container>
      <h2>Thông tin cá nhân</h2>
      <v-row class="mt-4 px-4 pt-3" justify="start" align-content="start">
        <v-col cols=12 md=4 sm=5 class="mb-6">
          <v-card shaped width="200" flat outlined>
            <v-img :src="hostImageUrl" height='200' width='200' contain>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
      <v-form ref="form">
        <v-row class="px-4 pt-3" justify="center" align-content="center">
          <v-col>
            <v-text-field label="Tên" v-model="name" color="mainpurple">
            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field label="Email" v-model="email" color="mainpurple">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row justify="end" align-content="end">
          <v-col>
            <v-btn color="mainpurple" depressed class="white--text text-capitalize ml-4" @click="updateProfile">
              Lưu
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hostImageUrl: 'http://localhost:5000/public/images/company_logos/default.jpg',
      file: null,
      name: this.$auth.$state.user.name ? this.$auth.$state.user.name : '',
      email: this.$auth.$state.user.email ? this.$auth.$state.user.email : '',
    }
  },
  methods: {
    async updateProfile() {
      try {
        if (this.$refs.form.validate()) {
          let data = await this.$axios.$post('admin/profile/update', {
            name: this.name,
            email: this.email,
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
  }
}
</script>
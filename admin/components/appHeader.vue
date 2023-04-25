<template>
  <div v-if="$auth.loggedIn">
    <v-toolbar class="px-2" width="100%">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <h3 class="pl-2">{{ $auth.$state.user.company }}</h3>

      <v-spacer></v-spacer>
      <div v-if="$auth.loggedIn">
        <v-btn @click="logoutBtn" depressed color="error">Đăng xuất</v-btn>
      </div>
    </v-toolbar>
    <v-navigation-drawer v-model="drawer" color="mainpurple" app temporary dark>
      <v-list class="mt-2">
        <v-list-item v-for="(item, i) in navItems" :key="i" class="pl-8 mt-2 tile" :to="item.route"
          active-class="active--nav" nuxt>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content class="pl-1">
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      navItems: [
        { title: 'Trang chủ', icon: 'mdi-home-variant-outline', route: '/' },
        { title: 'Nhân viên', icon: 'mdi-account-group-outline', route: '/employees' },
        { title: 'Lương', icon: 'mdi-wallet-outline', route: '/salary' },
        { title: 'Thông tin các nhân', icon: 'mdi-account', route: '/profile' }
      ]
    }
  },
  methods: {
    async logoutBtn() {
      try {
        this.$auth.logout()
        this.router.push('/login')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped>
.active--nav {
  color: white;
  background-color: #6659FF;
}

.tile:active {
  color: #ffffff !important;
  background: #6659FF;
}

.tile:hover {
  color: #ffffff;
  background: #6659FF;
}
</style>
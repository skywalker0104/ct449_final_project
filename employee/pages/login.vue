<template>
    <div class="mt-16">
        <v-row justify="center">
            <v-card height="500" width="500" elevation="0">
                <v-row justify="center" class="mt-8 mb-8">
                    <h1>GK Stack</h1>
                </v-row>
                <v-row justify="center" class="mt-2">
                    <v-card-title class="text-h5">ĐĂNG NHẬP</v-card-title>
                </v-row>
                <div class="pa-6 mt-2">
                    <v-form ref="form">
                        <v-text-field v-model="email" color="mainpurple" label="Email"
                            :rules="[rules.required_email, rules.email]">
                            Email
                        </v-text-field>
                        <v-text-field v-model="password" color="mainpurple" label="Mật khẩu"
                            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'"
                            @click:append="show = !show" :rules="[rules.required_password]">
                            Mật khẩu
                        </v-text-field>
                    </v-form>
                    <v-row justify="space-between"><br></v-row>
                    <v-row justify="space-between" align-content="space-between">
                        <v-btn @click="submitInfo" color="mainpurple" class="white--text ml-3">Đăng nhập</v-btn>
                    </v-row>
                </div>
            </v-card>
        </v-row>
    </div>
</template>

<script>
export default {
    head() {
        return {
            title: 'Đăng nhập'
        }
    },
    data() {
        return {
            email: '',
            password: '',
            show: false,
            rules: {
                required_email: v => !!v || 'Chưa nhập Email',
                required_password: v => !!v || 'Chưa nhập mật khẩu',
                email: v => {
                    let pattern = /\S+@\S+\.\S+/
                    return pattern.test(v) || 'Chưa nhập đúng định dạng email!'
                }
            }
        }
    },
    methods: {
        async submitInfo() {
            try {
                if (this.$refs.form.validate()) {
                    await this.$auth.loginWith('local', { data: { email: this.email, password: this.password } })
                }
            } catch (err) {
                console.log(err)
            }
        }
    }
}
</script>
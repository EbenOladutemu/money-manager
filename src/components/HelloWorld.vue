<template>
  <div>
    <!-- Create the login form herde -->
    <form>
      <input
        type="text"
        id="username-input"
        :value="loginForm.username"
        @input="changeUsername"
      />
      <input
        type="password"
        id="password-input"
        :value="loginForm.password"
        @input="changePassword"
      />
      <button
        id="login-button"
        @submit="$emit('submitForm')"
        class="eyo fjn djn"
        type="submit"
      >
        Submit
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  data: function () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      disabled: true
    }
  },
  methods: {
    changeUsername(e) {
      this.loginForm.username = e.target.value
      console.log(document.getElementById('username-input').value)
    },
    changePassword(e) {
      this.loginForm.password = e.target.value
    },
    submitForm() {
      console.log(this.loginForm.username, 'HTest', this.loginForm.password)
    }
  }
}
</script>

import { defineStore } from 'pinia'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth'
import { ref } from 'vue'
import { useYearHelper } from '@/composables/year-helper'
import Swal from 'sweetalert2'
import router from '@/router'
import { useSweetAlert } from '@/composables/sweet-alert-helper'

export const useLoginStore = defineStore(
  'login',
  () => {
    const { currentMonth, currentYear } = useYearHelper()
    const token = ref()
    const user = ref()

    function initFirebase() {
      // TODO: Add SDKs for Firebase products that you want to use
      // https://firebase.google.com/docs/web/setup#available-libraries

      // Your web app's Firebase configuration
      // For Firebase JS SDK v7.20.0 and later, measurementId is optional
      const firebaseConfig = {
        apiKey: 'AIzaSyBg1FI9pRHmH4xLogFPQluGkvsRfobyYdE',
        authDomain: 'elereke-doughnut.firebaseapp.com',
        databaseURL:
          'https://elereke-doughnut-default-rtdb.europe-west1.firebasedatabase.app',
        projectId: 'elereke-doughnut',
        storageBucket: 'elereke-doughnut.appspot.com',
        messagingSenderId: '344871625800',
        appId: '1:344871625800:web:f3e8d89bda937ac019e47d',
        measurementId: 'G-6ML1XJBKKC'
      }

      // Initialize Firebase
      const app = initializeApp(firebaseConfig)
      const analytics = getAnalytics(app)
    }

    const provider = new GoogleAuthProvider()

    function loginWithGoogle() {
      const auth = getAuth()
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential: any =
            GoogleAuthProvider.credentialFromResult(result)
          token.value = credential.accessToken
          // The signed-in user info.
          user.value = result.user
          // IdP data available using getAdditionalUserInfo(result)
          // ...
          console.log(result, credential)
          useSweetAlert().alert('You are in!', '', 'success')
          router.push({ name: `${currentMonth.value}-${currentYear}` })
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          // The email of the user's account used.
          const email = error.customData.email
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error)
          // ...
          console.log(error)
          useSweetAlert().alert('Error', error, 'error')
        })
    }

    function logOut() {
      const auth = getAuth()
      signOut(auth)
        .then(() => {
          useSweetAlert().alert(
            'Signed out',
            'Signed out successfully',
            'success'
          )
          $reset()
          router.push('/login')
          location.reload()
        })
        .catch((error: any) => {
          useSweetAlert().alert('Error', error, 'error')
        })
    }

    function $reset() {
      token.value = ''
      user.value = ''
    }

    return {
      initFirebase,
      loginWithGoogle,
      logOut,
      token,
      user,
      $reset
    }
  },
  {
    persist: true
  }
)

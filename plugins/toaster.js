import Vue from 'vue'
import Toaster from 'v-toaster'

export default () => {
    Vue.use(Toaster, { timeout: 3000 })
}

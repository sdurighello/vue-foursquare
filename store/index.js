export const state = () => ({
    cartTotal: 0,
    cart: {},
    sale: false,
    selectedPaymentMethod: null,
    paymentSubmitted: false,
    authorizingPayment: false,
    paymentResult: null,
    bankHasBeenSelected: false,
    selectedBank: null,
    authorizingBank: false,
    bankAuthorizationResult: null,
    products: [
        {
            name: 'Khaki Suede Polish Work Boots',
            price: 149.99,
            category: 'women',
            sale: true,
            article: 'shoe',
            img: 'shoe1.png'
        }
    ]
})

const filter = (array, key, value) => array.filter(item => item[key] === value)

export const getters = {
    women: state => filter(state.products, 'category', 'women'),
    men: state => filter(state.products, 'category', 'men'),
    sale: state => filter(state.products, 'sale', true)
}

export const mutations = {
    switchSale: (state) => {
        state.sale = !state.sale
    },
    clearCartCount: (state) => {
        state.cartTotal = 0
    },
    clearCartContents: (state) => {
        state.cart = {}
    },
    addItem: (state, item) => {
        state.cartTotal++
        if (item.name in state.cart) {
            state.cart[item.name].count++
        } else {
            const stateItem = Object.assign({}, item)
            stateItem.count = 1
            state.cart[item.name] = stateItem
        }
    },
    addSelectedPaymentMethod: (state, item) => {
        state.selectedPaymentMethod = item
    },
    setPaymentSubmitted: (state, value) => {
        state.paymentSubmitted = value
    },
    setAuthorizingPayment: (state, value) => {
        state.authorizingPayment = value
    },
    setPaymentResult: (state, value) => {
        state.paymentResult = value
    },
    setBankHasBeenSelected: (state, value) => {
        state.bankHasBeenSelected = value
    },
    setSelectedBank: (state, value) => {
        state.selectedBank = value
    },
    setAuthorizingBank: (state, value) => {
        state.authorizingBank = value
    },
    setBankAuthorizationResult: (state, value) => {
        state.bankAuthorizationResult = value
    }
}

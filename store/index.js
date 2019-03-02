export const state = () => ({
    favourites: []
})

export const getters = {
    getFavourites: state => state.favourites
}

export const mutations = {
    addFavourite: (state, venue) => {
        state.favourites.push(venue)
    },
    removeFavourite: (state, venue) => {
        state.favourites.splice(state.favourites.indexOf(venue), 1)
    }
}

export const actions = {
    addFavourite: ({ commit }, venue) => {
        commit('addFavourite', venue)
    },
    removeFavourite: ({ commit }, venue) => {
        commit('removeFavourite', venue)
    }
}

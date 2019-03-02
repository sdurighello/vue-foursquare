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
    },
    updateComment: (state, details) => {
        const index = state.favourites.indexOf(details.venue)
        state.favourites[index].comment = details.comment
    }
}

export const actions = {
    // Async stuff here
    addFavourite: ({ commit }, venue) => {
        commit('addFavourite', venue)
    },
    removeFavourite: ({ commit }, venue) => {
        commit('removeFavourite', venue)
    },
    updateComment: ({ commit }, details) => {
        commit('updateComment', details)
    }
}

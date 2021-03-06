// import details:  nuxt.js/packages/vue-app/template/store.js

import { getApi } from '@/services/api'

export const state = () => ({
    favourites: [],
    venues: [],
    selectedVenue: null
})

export const getters = {
    getFavourites: state => state.favourites,
    getVenues: state => state.venues,
    getVenueById: state => id => state.venues.find(v => v.id === id),
    getFavouriteById: state => id => state.favourites.find(v => v.id === id),
    getSelectedVenue: state => state.selectedVenue
}

export const mutations = {
    selectVenue: (state, payload) => {
        // payload: { venue, details }
        state.selectedVenue = payload
    },
    resetSelectedVenue: (state) => {
        state.selectedVenue = null
    },
    addFavourite: (state, venue) => {
        const changedVenue = Object.assign({}, venue, { favourite: true, comment: '' })
        state.favourites.push(changedVenue)
    },
    removeFavourite: (state, venue) => {
        state.favourites.splice(state.favourites.indexOf(venue), 1)
    },
    updateFavourite: (state, venue) => {
        state.favourites = state.favourites.map((v) => {
            if (v.id === venue.id) {
                return Object.assign({}, v, venue)
            }
            return v
        })
    },
    populateVenues: (state, venues) => {
        state.venues = venues
    },
    updateVenue: (state, venue) => {
        state.venues = state.venues.map((v) => {
            if (v.id === venue.id) {
                return Object.assign({}, v, venue)
            }
            return v
        })
    }
}

// const getVenueDetailsById = async (venueId) => {
//     // const details = ['photos', 'tips', 'hours', 'menu', 'links']
//     // On free account only 1 photo and 1 tip available
//     const details = ['photos']
//     const promisesArray = details.map(detail => getApi(`venues/${venueId}/${detail}`))
//     const responseArray = await Promise.all(promisesArray)
//     const result = {}
//     details.forEach((d, i) => (result[d] = responseArray[i].data.response))
//     result.photos = result.photos.photos.items.map(item => `${item.prefix}300x300${item.suffix}`)
//     return result
// }

export const actions = {
    selectVenue: ({ commit }, venue) => {
        // const details = await getVenueDetailsById(venue.id)
        // const payload = { venue, details }
        commit('selectVenue', venue)
    },
    resetSelectedVenue: ({ commit }) => {
        commit('resetSelectedVenue')
    },
    addFavourite: ({ commit }, { venue, vm }) => {
        commit('addFavourite', venue)
        commit('updateVenue', { id: venue.id, favourite: true })
        vm.$notify({
            title: 'Added to favourites',
            message: venue.name,
            duration: 3000
        })
    },
    removeFavourite: ({ commit }, { venue, vm }) => {
        commit('removeFavourite', venue)
        commit('updateVenue', { id: venue.id, favourite: false })
        vm.$notify({
            title: 'Removed from favourites',
            message: venue.name,
            duration: 3000
        })
    },
    updateComment: ({ commit, getters }, { venue, comment, vm }) => {
        commit('updateFavourite', { id: venue.id, comment: comment })
        // Update the selected with the new comment
        const changedVenue = getters.getFavouriteById(venue.id)
        commit('selectVenue', changedVenue)
        vm.$notify({
            title: 'Comment successfully updated',
            message: '',
            duration: 3000
        })
    },
    fetchVenues: async ({ commit }, params) => {
        const placesRes = await getApi('venues/search', params)
        console.log(placesRes)
        const venues = placesRes.data.response.venues
        commit('populateVenues', venues)
    }
}

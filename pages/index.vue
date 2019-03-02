<template lang="pug">
body
    .row
        .col-md-12
            el-tabs(
                v-model="selectedTab",
                @tab-click="switchTabs"
            )
                el-tab-pane(
                    label="Find new venues",
                    name="filters"
                )
                    .row
                        .col-md-4
                            el-card(:style="{ 'margin-right': '5px' }")
                                el-form
                                    el-form-item
                                        p
                                            |Use
                                            el-button(
                                                type="text",
                                                @click="locationChoice = 'location'",
                                            )    your location
                                            |  or enter
                                            el-button(
                                                type="text",
                                                @click="locationChoice = 'city'",
                                            )  a city
                                        el-input(
                                            v-if="locationChoice === 'city'"
                                            placeholder="Enter city",
                                            v-model="city",
                                        )
                                        p(v-if="locationChoice === 'location' && coordinates.length > 0")
                                            i(class="el-icon-location") Latitude: {{coordinates[0]}}, Longitude: {{coordinates[1]}}
                                        p(v-if="locationChoice === 'location' && coordinates.length === 0")
                                            | No coordinates found
                                    el-form-item
                                        p Radius in km
                                        el-slider(
                                            v-model="radius",
                                            :min="1",
                                            :max="10",
                                            :step="1",
                                        )
                                    el-form-item
                                        p Select a place category
                                        el-select(
                                            :style="{ display: 'block' }",
                                            v-model="category",
                                            placeholder="Categories",
                                        )
                                    el-form-item
                                        p Keyword
                                        el-input(
                                            placeholder="Enter a keyword to match",
                                            v-model="keyword",
                                        )
                                    el-form-item
                                        p
                                        el-button(
                                            @click="search()",
                                            icon="el-icon-search"
                                        ) Search
                        .col-md-8
                            .row
                                .col-md-4(
                                    v-for="venue in computedVenues",
                                    :key="venue.id"
                                )
                                    el-card(
                                        :body-style="{ padding: '0px' }",
                                        :style="{ height: '200px', marginBottom: '20px', cursor: 'pointer' }",
                                        @click.native="selectVenue(venue)"
                                    )
                                        div(:style="{ padding: '14px' }")
                                            p {{venue.name}}
                                            el-button.float-right(
                                                v-if="!venue.favourite",
                                                @click.stop="addToFavourites(venue)",
                                                type="success",
                                                size="mini",
                                                :round="true"
                                            ) Add to favourites
                                            el-button.float-right(
                                                v-if="venue.favourite",
                                                @click.stop="removeFromFavourites(venue)",
                                                type="danger",
                                                size="mini",
                                                :round="true"
                                            ) Remove from favourites
                el-tab-pane(
                    label="My favourite venues",
                    name="favourites"
                )
                    .row
                        .col-md-4
                            el-card(
                                v-for="venue in favourites",
                                :key="venue.id"
                                :body-style="{ padding: '0px' }",
                                :style="{ height: '200px', marginBottom: '20px', cursor: 'pointer' }",
                                :class="{ border: selectedVenue && selectedVenue.id === venue.id }",
                                :shadow="selectedVenue && selectedVenue.id === venue.id ? 'never' : 'always'",
                                @click.native="selectVenue(venue)"
                            )
                                div(:style="{ padding: '14px' }")
                                    p {{venue.name}}
                                    el-button.float-right(
                                        v-if="!venue.favourite",
                                        @click.stop="addToFavourites(venue)",
                                        type="success",
                                        size="mini",
                                        :round="true"
                                    ) Add to favourites
                                    el-button.float-right(
                                        v-if="venue.favourite",
                                        @click.stop="removeFromFavourites(venue)",
                                        type="danger",
                                        size="mini",
                                        :round="true"
                                    ) Remove from favourites
                        .col-md-8
                            el-card(v-if="selectedVenue && selectedVenue.id")
                                p {{selectedVenue.name}}
                                p {{selectedVenue.location.formattedAddress[0]}}, {{selectedVenue.location.formattedAddress[1]}}, {{selectedVenue.location.formattedAddress[2]}}
                                p {{selectedVenue.location.distance}} meters
                                p {{selectedVenue.categories[0].name}}
                                p {{selectedVenue.verified}}
                                el-input(
                                    type="textarea",
                                    :rows="10",
                                    placeholder="Enter a note to self ...",
                                    v-model="selectedVenueComment"
                                )
                                el-button.button.float-right(
                                    @click.stop="updateComment",
                                    type="success",
                                    size="mini",
                                    :round="true"
                                ) Update
                                el-button.button.float-right(
                                    @click.stop="cancelUpdateComment",
                                    type="danger",
                                    size="mini",
                                    :round="true"
                                ) Cancel
</template>

<script>
import { getApi } from '@/services/api'

export default {
    components: {
    },
    data() {
        return {
            menu: 'filters',
            city: '',
            radius: 5,
            category: null,
            locationChoice: 'location',
            keyword: '',
            selectedTab: 'filters',
            coordinates: '',
            venues: [],
            selectedVenue: null,
            selectedVenueComment: ''
        }
    },
    computed: {
        favourites() {
            return this.$store.getters.getFavourites
        },
        computedVenues() {
            return this.venues.map((venue) => {
                const found = this.favourites.find(fav => fav.id === venue.id)
                venue.favourite = !!found
                return venue
            })
        }
    },
    async created() {
        this.coordinates = await this.getUserPosition()
        console.log('ciao', this.coordinates)
    },
    methods: {
        switchTabs(tab) {
            this.selectedTab = tab.name
        },
        async getUserPosition() {
            try {
                if (navigator.geolocation) {
                    return await this.getCurrentPosition()
                }
                console.log('location not supported by this browser')
            } catch (err) {
                console.log(err)
            }
        },
        getCurrentPosition() {
            return new Promise(function (resolve, reject) {
                return navigator.geolocation.getCurrentPosition(function (position) {
                    return resolve([position.coords.latitude, position.coords.longitude])
                }, function (err) {
                    return reject(err)
                })
            })
        },
        async search() {
            try {
                const params = {}
                if (this.radius) { params.radius = this.radius }
                if (this.keyword) { params.keyword = this.keyword }
                if (this.locationChoice === 'location' && this.coordinates) {
                    params.ll = this.coordinates.join(',')
                }
                if (this.locationChoice === 'city') { params.near = this.city }
                console.log(params)
                const placesRes = await getApi('venues/search', params)
                console.log(placesRes)
                this.venues = placesRes.data.response.venues
            } catch (err) {
                console.log(err)
            }
        },
        addToFavourites(venue) {
            venue.favourite = true
            this.$store.dispatch('addFavourite', venue)
        },
        removeFromFavourites(venue) {
            this.$store.dispatch('removeFavourite', venue)
            this.resetSelectedVenue()
        },
        selectVenue(venue) {
            console.log('selected', venue)
            this.selectedVenue = venue
            this.selectedVenueComment = venue.comment
        },
        resetSelectedVenue() {
            this.selectedVenue = null
            this.selectedVenueComment = ''
        },
        updateComment() {
            this.$store.dispatch('updateComment', { venue: this.selectedVenue, comment: this.selectedVenueComment })
        },
        cancelUpdateComment() {
            this.selectedVenueComment = this.selectedVenue.comment
        }
    }
}
</script>

<style lang="scss" scoped>
.button {
    margin: 5px;
}
.buttons {
    margin: 50px;
    padding: 10px;
}
.form {
    padding: 20px;
}
.border {
    border: '6px red solid';
}
</style>

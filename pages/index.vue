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
                                        p Maximum radius from location: {{this.radius}} km
                                        el-slider(
                                            v-model="radius",
                                            :min="1",
                                            :max="50",
                                            :step="1",
                                        )
                                    el-form-item
                                        p Select a place category
                                        el-select(
                                            :style="{ display: 'block' }",
                                            v-model="selectedCategory",
                                            placeholder="Categories",
                                        )
                                            el-option(
                                                v-for="category in categories",
                                                :key="category.id",
                                                :value="category.id",
                                                :label="category.name"
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
                                    v-for="venue in venues",
                                    :key="venue.id"
                                )
                                    venue-card(
                                        :venue="venue",
                                    )
                el-tab-pane(
                    label="My favourite venues",
                    name="favourites"
                )
                    .row
                        .col-md-4(
                            v-for="venue in favourites",
                            :key="venue.id"
                        )
                            venue-card(
                                :venue="venue",
                                :selectable="true",
                                @selectVenue="setComment"
                            )
                        .col-md-8
                            el-card(
                                v-if="selectedVenue && selectedVenue.id",
                            )
                                //- img(
                                //-     v-if="selectedVenueDetails.photos && selectedVenueDetails.photos.length > 0",
                                //-     src="selectedVenueDetails.photos[0]"
                                //- )
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
import venueCard from '@/components/venue-card'

export default {
    components: {
        venueCard
    },
    data() {
        return {
            menu: 'filters',
            city: '',
            radius: 20,
            locationChoice: 'location',
            keyword: '',
            selectedTab: 'filters',
            coordinates: '',
            selectedVenueComment: '',
            selectedCategory: null,
            categories: []
        }
    },
    computed: {
        favourites() {
            return this.$store.getters.getFavourites
        },
        venues() {
            return this.$store.getters.getVenues
        },
        selectedVenue() {
            return this.$store.getters.getSelectedVenue
        }
    },
    async created() {
        this.coordinates = await this.getUserPosition()
        await this.setCategories()
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
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    position => resolve([position.coords.latitude, position.coords.longitude]), err => reject(err))
            })
        },
        async setCategories() {
            try {
                const categoriesRes = await getApi('venues/categories')
                console.log('categories', categoriesRes)
                this.categories = categoriesRes.data.response.categories.map(({ id, name }) => ({ id, name }))
            } catch (err) {
                console.log(err)
            }
        },
        async search() {
            try {
                const params = {}
                if (this.radius) { params.radius = this.radius }
                if (this.keyword) { params.keyword = this.keyword }
                if (this.selectedCategory) { params.categoryId = this.selectedCategory }
                if (this.locationChoice === 'location' && this.coordinates) {
                    params.ll = this.coordinates.join(',')
                }
                if (this.locationChoice === 'city') { params.near = this.city }
                console.log(params)
                await this.$store.dispatch('fetchVenues', params)
            } catch (err) {
                console.log(err)
            }
        },
        updateComment() {
            this.$store.dispatch('updateComment', { venue: this.selectedVenue, comment: this.selectedVenueComment })
        },
        cancelUpdateComment() {
            this.selectedVenueComment = this.selectedVenue.comment
        },
        setComment(venue) {
            this.selectedVenueComment = venue.comment
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
.details {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-color: black;
    background-image: url(https://fastly.4sqi.net/img/general/500x500/nyTc6JbYQ4wtk4f5DukJz36zXtUYOYht94cZjawYhtY.jpg);
}
</style>

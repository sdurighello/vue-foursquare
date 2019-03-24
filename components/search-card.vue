<template lang="pug">
el-card
    el-form
        el-form-item
            p
                b
                    |Enter &nbsp;
                    el-button(
                        type="text",
                        @click="locationChoice = 'city'",
                    ) a city
                    | or use &nbsp;
                    el-button(
                        type="text",
                        @click="setMyLocation",
                    ) your location &nbsp;
            el-input(
                v-if="locationChoice === 'city'",
                v-model="city",
                placeholder="Enter city"
            )
            p(v-loading="isGettingPosition")
                span(v-if="locationChoice === 'location' && coordinates")
                    i(class="el-icon-location") Latitude: {{coordinates[0]}}, Longitude: {{coordinates[1]}}
                span(v-if="locationChoice === 'location' && !coordinates")
                    | No coordinates found
        el-form-item
            p
                b Maximum radius from location: {{this.radius}} km
            el-slider(
                v-model="radius",
                :min="1",
                :max="50",
                :step="1",
            )
        el-form-item
            p
                b Select a place category
            el-select(
                v-model="selectedCategory",
                placeholder="Categories",
                :style="{ display: 'block' }",
                :clearable="true"
            )
                el-option(
                    v-for="category in categories",
                    :key="category.id",
                    :value="category.id",
                    :label="category.name"
                )
        el-form-item
            p
                b Keyword
            el-input(
                v-model="keyword",
                placeholder="Enter a keyword to match"
            )
        el-form-item
            p
            el-button(
                @click="search()",
                icon="el-icon-search"
            ) Search
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
            city: '',
            radius: 20,
            locationChoice: 'city',
            keyword: '',
            coordinates: null,
            selectedCategory: null,
            categories: [],
            isSearching: false,
            isGettingPosition: false
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
    watch: {
        isSearching(newVal) {
            this.$emit('updateIsSearching', newVal)
        }
    },
    async created() {
        await this.setCategories()
    },
    methods: {
        async setMyLocation() {
            this.locationChoice = 'location'
            await this.getUserPosition()
        },
        async getUserPosition() {
            this.isGettingPosition = true
            try {
                if (navigator.geolocation) {
                    this.coordinates = await this.getCurrentPosition()
                } else {
                    this.$notify({
                        title: 'location not supported by this browser',
                        message: '',
                        duration: 3000
                    })
                }
            } catch (err) {
                console.log(err)
                switch (err.code) {
                    case 0: {
                        this.$notify({
                            title: 'Error getting location',
                            message: 'Unknown error',
                            duration: 3000
                        })
                        break
                    }
                    case 1: {
                        this.$notify({
                            title: 'Error getting location',
                            message: 'Permission denied. Please check your browser settings and allow location services',
                            duration: 3000
                        })
                        break
                    }
                    case 2: {
                        this.$notify({
                            title: 'Error getting location',
                            message: 'Position unavailable. Error response from location provider. Please retry later',
                            duration: 3000
                        })
                        break
                    }
                    case 3: {
                        this.$notify({
                            title: 'Error getting location',
                            message: 'Timed out. The request took too long. Please retry later.',
                            duration: 3000
                        })
                        break
                    }
                    default: {
                        this.$notify({
                            title: 'Error getting location',
                            message: err,
                            duration: 3000
                        })
                        break
                    }
                }
            } finally {
                if (!this.coordinates) {
                    this.locationChoice = 'city'
                }
                this.isGettingPosition = false
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
                this.$notify({
                    title: 'Error getting categories',
                    message: err,
                    duration: 3000
                })
            }
        },
        async search() {
            try {
                if (!this.coordinates && !this.city) {
                    return this.$notify({
                        title: 'Cannot search yet. Location is still unknown...',
                        message: 'Retry later or enter a city manually',
                        duration: 3000
                    })
                }
                this.isSearching = true
                const params = {}
                if (this.radius) { params.radius = this.radius }
                if (this.keyword) { params.query = this.keyword }
                if (this.selectedCategory) { params.categoryId = this.selectedCategory }
                if (this.locationChoice === 'location' && this.coordinates) {
                    params.ll = this.coordinates.join(',')
                }
                if (this.locationChoice === 'city') { params.near = this.city }
                console.log(params)
                await this.$store.dispatch('fetchVenues', params)
                this.isSearching = false
            } catch (err) {
                this.isSearching = false
                console.log(err)
                this.$notify({
                    title: 'Error searching for venues',
                    message: err,
                    duration: 3000
                })
            }
        }
    }
}
</script>

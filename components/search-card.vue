<template lang="pug">
el-card
    el-form
        el-form-item
            p
                b
                    |Use &nbsp;
                    el-button(
                        type="text",
                        @click="locationChoice = 'location'",
                    ) your location &nbsp;
                    | or enter &nbsp;
                    el-button(
                        type="text",
                        @click="locationChoice = 'city'",
                    ) a city
            el-input(
                v-if="locationChoice === 'city'",
                v-model="city",
                placeholder="Enter city"
            )
            p(v-if="locationChoice === 'location' && coordinates.length > 0")
                i(class="el-icon-location") Latitude: {{coordinates[0]}}, Longitude: {{coordinates[1]}}
            p(v-if="locationChoice === 'location' && coordinates.length === 0")
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
            locationChoice: 'location',
            keyword: '',
            coordinates: '',
            selectedCategory: null,
            categories: [],
            isSearching: false
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
        this.coordinates = await this.getUserPosition()
        await this.setCategories()
    },
    methods: {
        async getUserPosition() {
            try {
                if (navigator.geolocation) {
                    return await this.getCurrentPosition()
                }
                console.log('location not supported by this browser')
            } catch (err) {
                console.log(err)
                this.$notify({
                    title: 'Error gettign location',
                    message: err,
                    duration: 3000
                })
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
                this.isSearching = true
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

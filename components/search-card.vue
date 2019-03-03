<template lang="pug">
el-card
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

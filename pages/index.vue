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
                            div(:style="{ 'margin-right': '5px' }")
                                search-card
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
                        .col-md-4
                            venue-card(
                                v-for="venue in favourites",
                                :key="venue.id"
                                :venue="venue",
                                :selectable="true",
                            )
                        .col-md-8
                            venue-details
</template>

<script>
import VenueCard from '@/components/venue-card'
import SearchCard from '@/components/search-card'
import VenueDetails from '@/components/venue-details'

export default {
    components: {
        VenueCard,
        SearchCard,
        VenueDetails
    },
    data() {
        return {
            selectedTab: 'filters'
        }
    },
    computed: {
        favourites() {
            return this.$store.getters.getFavourites
        },
        venues() {
            return this.$store.getters.getVenues
        }
    },
    methods: {
        switchTabs(tab) {
            this.selectedTab = tab.name
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

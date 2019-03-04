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
                            div(:style="{ 'margin': '0 5px 10px 0' }")
                                search-card(
                                    @updateIsSearching="updateIsSearching"
                                )
                        .col-md-8(v-loading="isSearching")
                            .row(v-if="venues.length > 0")
                                .col-md-4(
                                    v-for="venue in venues",
                                    :key="venue.id"
                                )
                                    venue-card(
                                        :venue="venue",
                                    )
                            .row(v-if="venues.length === 0")
                                .col-md-12.text-center
                                    el-alert(
                                        title="No results to show",
                                        type="warning",
                                        :closable="false"
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
            selectedTab: 'filters',
            isSearching: false
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
        },
        updateIsSearching(value) {
            this.isSearching = value
        }
    }
}
</script>

<template lang="pug">
    el-card(
        :body-style="{ padding: '0px' }",
        :style="{ height: '200px', 'margin-bottom': '20px' }",
        :class="{ 'cursor-pointer': selectable, border: isSelected }",
        :shadow="isSelected ? 'never' : 'always'",
        @click.native="selectVenue()"
    )
        div(:style="{ padding: '14px' }")
            p {{venue.name}}
            el-button.float-right(
                v-if="!venue.favourite",
                @click.stop="addToFavourites()",
                type="success",
                size="mini",
                :round="true"
            ) Add to favourites
            el-button.float-right(
                v-if="venue.favourite",
                @click.stop="removeFromFavourites()",
                type="danger",
                size="mini",
                :round="true"
            ) Remove from favourites
</template>

<script>
export default {
    components: {
    },
    props: {
        venue: {
            type: Object,
            required: true
        },
        selectable: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
        }
    },
    computed: {
        // cardVenue() {
        //     const found = this.favourites.find(fav => fav.id === this.venue.id)
        //     return Object.assign({}, this.venue, { favourite: !!found })
        // },
        selectedVenue() {
            return this.$store.getters.getSelectedVenue
        },
        isSelected() {
            return this.selectedVenue && this.selectedVenue.id === this.venue.id
        },
        favourites() {
            return this.$store.getters.getFavourites
        }
    },
    methods: {
        addToFavourites() {
            this.$store.dispatch('addFavourite', this.venue)
        },
        removeFromFavourites() {
            this.$store.dispatch('removeFavourite', this.venue)
        },
        selectVenue() {
            // Clean the comments box at new selections
            this.$emit('selectVenue', this.venue)
            this.$store.dispatch('selectVenue', this.venue)
        }
    }
}
</script>

<style lang="scss" scoped>
.cursor-pointer {
    cursor: 'pointer';
}
.border {
    border: '6px red solid';
}
</style>

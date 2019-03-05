<template lang="pug">
    el-card(
        :body-style="{ padding: '0px' }",
        :style="{ height: '200px', 'margin-bottom': '20px' }",
        :class="{ 'cursor-pointer': selectable && !isSelected, border: isSelected }",
        :shadow="isSelected ? 'never' : 'always'",
        @click.native="selectVenue()"
    )
        .details
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
            return this.selectedVenue && this.selectedVenue.id === this.venue.id && this.selectable
        },
        favourites() {
            return this.$store.getters.getFavourites
        }
    },
    methods: {
        addToFavourites() {
            this.$store.dispatch('addFavourite', { venue: this.venue, vm: this })
        },
        removeFromFavourites() {
            // Reset selectedVenue if it was this favourite
            if (this.selectedVenue && this.selectedVenue.id === this.venue.id) {
                this.$store.dispatch('resetSelectedVenue')
            }
            this.$store.dispatch('removeFavourite', { venue: this.venue, vm: this })
        },
        selectVenue() {
            if (this.selectable) {
                this.$store.dispatch('selectVenue', this.venue)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.cursor-pointer {
    cursor: pointer;
}
.border {
    border: '6px red solid';
}
.details {
    min-height: 100px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-color: black;
    background-image: url(https://via.placeholder.com/500x250);
}
</style>

<template lang="pug">
    el-card(
        v-if="selectedVenue && selectedVenue.id",
    )
        //- img(
        //-     v-if="selectedVenueDetails.photos && selectedVenueDetails.photos.length > 0",
        //-     src="selectedVenueDetails.photos[0]"
        //- )
        h3 {{selectedVenue.name}}
        p
            i(class="el-icon-location") &nbsp;
            span {{selectedVenue.location.formattedAddress[0]}}, {{selectedVenue.location.formattedAddress[1]}}, {{selectedVenue.location.formattedAddress[2]}}
        p(v-if="selectedVenue.location.distance") {{selectedVenue.location.distance}} meters from your location
        p Category: {{selectedVenue.categories[0].name}}
        p(v-if="selectedVenue.verified") Verified!
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
            size="mini",
            :round="true"
        ) Cancel
</template>

<script>
export default {
    data() {
        return {
            selectedVenueComment: ''
        }
    },
    computed: {
        selectedVenue() {
            return this.$store.getters.getSelectedVenue
        }
    },
    watch: {
        selectedVenue(newVal) {
            if (newVal) {
                this.setComment(newVal.comment)
            } else {
                this.setComment('')
            }
        }
    },
    methods: {
        updateComment() {
            this.$store.dispatch('updateComment', { venue: this.selectedVenue, comment: this.selectedVenueComment })
        },
        cancelUpdateComment() {
            this.selectedVenueComment = this.selectedVenue.comment
        },
        setComment(comment) {
            this.selectedVenueComment = comment
        }
    }
}
</script>

<style lang="scss" scoped>
.button {
    margin: 5px;
}
</style>

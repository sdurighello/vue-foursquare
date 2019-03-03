<template lang="pug">
    el-card(
        v-if="selectedVenue && selectedVenue.id",
    )
        //- img(
        //-     v-if="selectedVenueDetails.photos && selectedVenueDetails.photos.length > 0",
        //-     src="selectedVenueDetails.photos[0]"
        //- )
        h6 {{selectedVenue.name}}
        p {{selectedVenue.location.formattedAddress[0]}}, {{selectedVenue.location.formattedAddress[1]}}, {{selectedVenue.location.formattedAddress[2]}}
        p {{selectedVenue.location.distance}} meters from your location
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
            type="danger",
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
            this.setComment(newVal.comment)
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

<template lang="pug">
div
    .row
        .col-md-4
        .col-md-8
            el-card(:style="{ 'margin-right': '5px' }")
                .row
                    .col-md-4
                        .text-center
                            |Choose
                            el-button(
                                type="text",
                                @click="locationChoice = 'location'",
                            )    your location
                            |  or
                            el-button(
                                type="text",
                                @click="locationChoice = 'city'",
                            )  a city
                        el-input(
                            placeholder="Enter city",
                            v-model="city",
                        )
                    .col-md-4
                        .text-center Radius
                        el-slider(
                            v-model="radius",
                            :min="1",
                            :max="10",
                            :step="1",
                        )
                    .col-md-4
                        .text-center Select a place category
                        el-select(
                            :style="{ display: 'block' }",
                            v-model="category",
                            placeholder="Categories",
                        )
</template>

<script>
export default {
    components: {
    },
    data() {
        return {
            menu: 'filters',
            city: '',
            radius: 10,
            category: null,
            locationChoice: 'location'
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
</style>

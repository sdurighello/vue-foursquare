<template lang="pug">
    .jumbotron.jumbotron-fluid
        .container
            h1(
                :style="{ color: 'white' }"
            ) Find your favourite places in town
</template>

<style lang="scss", scoped>
    .jumbotron {
        background-image: url("/jumbotron.jpg");
        background-size: cover;
        min-height: 300px;
        background-position: center center;
        background-repeat:no-repeat;
    }
</style>

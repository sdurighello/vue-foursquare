<template lang="pug">
    div
        app-header
        nuxt
        app-footer
</template>

<script>
import appHeader from './../components/app-header'
import appFooter from './../components/app-footer'

export default {
    components: {
        appHeader,
        appFooter
    }
}
</script>

<style>
html {
    font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
    position: relative;
    min-height: 100%;
}

body {
    margin: 0 0 50px;
    /* bottom = footer height */
}

footer {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 50px;
    width: 100%;
    overflow: hidden;

    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    background: black;
    color: white;
    text-align: center;
    letter-spacing: 0.03em;
    margin-top: 10px;
}
</style>

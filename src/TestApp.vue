<template>
    <BrowserRouter>
        <div>
            <XLink to="/">Home</XLink>
            <XLink to="about">About</XLink>
        </div>
        <Routes>
            <Route path="/">
                <template v-slot:element>
                    <div>Home</div>
                </template>
            </Route>
            <Route path="about">
                <template v-slot:element>
                    <div>About</div>
                </template>
                <Route path="me">
                    <template v-slot:element>
                        <div>Me</div>
                    </template>
                </Route>
            </Route>
        </Routes>
    </BrowserRouter>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { BrowserRouter, Routes, Route, Link } from '../lib'

export default defineComponent({
    components: {
        BrowserRouter,
        Routes,
        Route,
        XLink: Link,
    },
})
</script>

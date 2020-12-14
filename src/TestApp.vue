<template>
    <MemoryRouter :initialEntries="['/home']">
        <Routes>
            <Route path="/home">
                <template v-slot:element>
                    <div>Home</div>
                </template>
            </Route>
        </Routes>
    </MemoryRouter>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { MemoryRouter, Routes, Route } from '../lib'

export default defineComponent({
    components: {
        MemoryRouter,
        Routes,
        Route,
    },
})
</script>

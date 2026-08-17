<script setup>
import { ref } from 'vue'

import Header from './components/layout/header.vue'
import Sidebar from './components/layout/sidebar.vue'
import Footer from './components/layout/footer.vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
    isSidebarOpen.value = false
}
</script>

<template>
    <div class="flex min-h-screen flex-col">

        <!-- Header -->
        <Header :is-sidebar-open="isSidebarOpen" @toggle-sidebar="toggleSidebar" />

        <!-- Main Application Area -->
        <div class="flex flex-1">

            <!-- Sidebar -->
            <Sidebar :is-open="isSidebarOpen" @close-sidebar="closeSidebar" />

            <!-- Page Content -->
            <main class="min-w-0 flex-1">
                <RouterView />
            </main>

        </div>

        <!-- Footer -->
        <Footer />

    </div>
</template>
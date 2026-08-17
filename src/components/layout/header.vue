<script setup>
import { Moon, Sun, Menu, X } from 'lucide-vue-next'
import { ref } from 'vue'
import logo from '../../assets/images/css_genLogo.png'

const props = defineProps({
    isSidebarOpen: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits([
    'toggle-sidebar'
])

const isDark = ref(false)

const toggleTheme = () => {
    isDark.value = !isDark.value

    document.documentElement.classList.toggle(
        'dark',
        isDark.value
    )
}
</script>

<template>
    <header
        class="sticky top-0 z-50 h-16 border-b border-gray-200/80 bg-white/90 backdrop-blur-md dark:border-gray-800/80 dark:bg-gray-950/90">
        <div class="flex h-full items-center justify-between px-5 sm:px-7">

            <!-- Left Side -->
            <div class="flex items-center gap-3">

                <!-- Mobile Sidebar Toggle -->
                <button type="button" @click="emit('toggle-sidebar')" :aria-label="props.isSidebarOpen
                        ? 'Close sidebar'
                        : 'Open sidebar'
                    "
                    class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100">
                    <X v-if="props.isSidebarOpen" :size="20" />

                    <Menu v-else :size="20" />
                </button>

                <!-- Logo -->
                <div class="flex items-center gap-3">

                    <img :src="logo" alt="CSS Generator" class="h-11 w-11 scale-125 object-contain" />

                    <span class="font-sans text-base font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                        CSS Generator
                    </span>

                </div>

            </div>

            <!-- Theme Toggle -->
            <button type="button" @click="toggleTheme" :aria-label="isDark
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
                "
                class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100">
                <Moon v-if="isDark" :size="19" />

                <Sun v-else :size="19" />
            </button>

        </div>
    </header>
</template>
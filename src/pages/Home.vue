<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import logo from '../assets/images/css_genLogo.png'

const previewIndex = ref(0)

const previews = [
    {
        name: 'Border Radius',
        description: 'Rounded corners',
        css: 'border-radius: 24px;',
        style: {
            borderRadius: '24px',
            boxShadow: 'none',
            transform: 'rotate(0deg) scale(1)',
            background: 'linear-gradient(135deg, #e5e7eb, #f9fafb)'
        }
    },
    {
        name: 'Box Shadow',
        description: 'Soft elevation',
        css: 'box-shadow: 0 20px 40px rgba(0,0,0,.15);',
        style: {
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            transform: 'rotate(0deg) scale(1)',
            background: 'linear-gradient(135deg, #e5e7eb, #f9fafb)'
        }
    },
    {
        name: 'Transform',
        description: 'Rotate and scale',
        css: 'transform: rotate(-6deg) scale(1.05);',
        style: {
            borderRadius: '12px',
            boxShadow: 'none',
            transform: 'rotate(-6deg) scale(1.05)',
            background: 'linear-gradient(135deg, #e5e7eb, #f9fafb)'
        }
    },
    {
        name: 'Gradient',
        description: 'Color transitions',
        css: 'background: linear-gradient(...);',
        style: {
            borderRadius: '20px',
            boxShadow: 'none',
            transform: 'rotate(0deg) scale(1)',
            background: 'linear-gradient(135deg, #d1d5db, #f3f4f6)'
        }
    }
]

let previewTimer

onMounted(() => {
    previewTimer = setInterval(() => {
        previewIndex.value =
            (previewIndex.value + 1) % previews.length
    }, 3000)
})

onUnmounted(() => {
    clearInterval(previewTimer)
})
</script>

<template>
    <section class="
            min-h-full
            bg-white
            px-6 py-12
            sm:px-10 sm:py-16
            dark:bg-gray-950
        ">
        <div class="mx-auto w-full max-w-5xl">

            <!-- Hero -->
            <div class="
                    grid
                    items-center
                    gap-12
                    md:grid-cols-2
                    md:gap-16
                ">
                <div class="max-w-2xl">
                    <p class="
                            mb-3
                            text-sm
                            font-medium
                            text-gray-500
                            dark:text-gray-400
                        ">
                        CSS Generator
                    </p>

                    <h1 class="
                            font-sans
                            text-3xl
                            font-semibold
                            tracking-tight
                            text-gray-900
                            sm:text-4xl
                            dark:text-gray-100
                        ">
                        Build CSS visually.
                    </h1>

                    <p class="
                            mt-4
                            text-base
                            leading-7
                            text-gray-600
                            dark:text-gray-400
                        ">
                        A collection of simple tools for creating,
                        experimenting with, and understanding CSS without
                        having to write every property from scratch.
                    </p>
                </div>

                <!-- Live Preview -->
                <div class="
                        flex
                        min-h-[280px]
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-gray-200
                        bg-gray-50
                        p-6
                        dark:border-gray-800
                        dark:bg-gray-900/50
                    ">
                    <div class="w-full max-w-sm">

                        <div class="
                                mb-4
                                flex
                                items-center
                                justify-between
                            ">
                            <div>
                                <p class="
                                        text-xs
                                        font-medium
                                        text-gray-400
                                        dark:text-gray-500
                                    ">
                                    LIVE PREVIEW
                                </p>

                                <Transition mode="out-in" enter-active-class="transition duration-300"
                                    enter-from-class="opacity-0 translate-y-1"
                                    enter-to-class="opacity-100 translate-y-0"
                                    leave-active-class="transition duration-200" leave-from-class="opacity-100"
                                    leave-to-class="opacity-0 -translate-y-1">
                                    <p :key="previewIndex" class="
                                            mt-1
                                            text-sm
                                            font-semibold
                                            text-gray-900
                                            dark:text-gray-100
                                        ">
                                        {{ previews[previewIndex].name }}
                                    </p>
                                </Transition>
                            </div>

                            <span class="
                                    h-2
                                    w-2
                                    animate-pulse
                                    rounded-full
                                    bg-gray-400
                                " />
                        </div>

                        <div class="
                                flex
                                h-36
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                dark:border-gray-700
                                dark:bg-gray-950
                            ">
                            <div class="
                                    flex
                                    h-24
                                    w-24
                                    items-center
                                    justify-center
                                    transition-all
                                    duration-700
                                    ease-out
                                " :style="previews[previewIndex].style">
                                <img :src="logo" alt="CSS Generator" class="h-14 w-14 object-contain" />
                            </div>
                        </div>

                        <Transition mode="out-in" enter-active-class="transition duration-300"
                            enter-from-class="opacity-0" enter-to-class="opacity-100"
                            leave-active-class="transition duration-200" leave-from-class="opacity-100"
                            leave-to-class="opacity-0">
                            <div :key="previewIndex" class="
                                    mt-4
                                    rounded-lg
                                    border
                                    border-gray-200
                                    bg-white
                                    px-3
                                    py-2
                                    dark:border-gray-800
                                    dark:bg-gray-950
                                ">
                                <code class="
                                        text-xs
                                        text-gray-600
                                        dark:text-gray-400
                                    ">
                                    {{ previews[previewIndex].css }}
                                </code>
                            </div>
                        </Transition>

                    </div>
                </div>
            </div>

            <!-- What is CSS -->
            <div class="mt-20">
                <h2 class="
                        font-sans
                        text-xl
                        font-semibold
                        tracking-tight
                        text-gray-900
                        dark:text-gray-100
                    ">
                    What is CSS?
                </h2>

                <p class="
                        mt-3
                        max-w-3xl
                        text-sm
                        leading-7
                        text-gray-600
                        dark:text-gray-400
                    ">
                    CSS, or Cascading Style Sheets, is the language used to
                    control how HTML elements look and are arranged on a web
                    page. It defines things such as colors, spacing, sizing,
                    typography, layouts, animations, and visual effects.
                </p>
            </div>

            <!-- Features -->
            <div class="mt-12">
                <h2 class="
                        font-sans
                        text-xl
                        font-semibold
                        tracking-tight
                        text-gray-900
                        dark:text-gray-100
                    ">
                    What can you create?
                </h2>

                <div class="
                        mt-4
                        grid
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-3
                    ">
                    <div class="
                            rounded-xl
                            border
                            border-gray-200
                            bg-gray-50
                            p-5
                            dark:border-gray-800
                            dark:bg-gray-900/50
                        ">
                        <h3 class="
                                text-sm
                                font-semibold
                                text-gray-900
                                dark:text-gray-100
                            ">
                            Layouts
                        </h3>

                        <p class="
                                mt-2
                                text-sm
                                leading-6
                                text-gray-500
                                dark:text-gray-400
                            ">
                            Build Grid, Flexbox, columns, and other layout
                            structures.
                        </p>
                    </div>

                    <div class="
                            rounded-xl
                            border
                            border-gray-200
                            bg-gray-50
                            p-5
                            dark:border-gray-800
                            dark:bg-gray-900/50
                        ">
                        <h3 class="
                                text-sm
                                font-semibold
                                text-gray-900
                                dark:text-gray-100
                            ">
                            Visual Effects
                        </h3>

                        <p class="
                                mt-2
                                text-sm
                                leading-6
                                text-gray-500
                                dark:text-gray-400
                            ">
                            Experiment with shadows, colors, borders,
                            backgrounds, and filters.
                        </p>
                    </div>

                    <div class="
                            rounded-xl
                            border
                            border-gray-200
                            bg-gray-50
                            p-5
                            dark:border-gray-800
                            dark:bg-gray-900/50
                        ">
                        <h3 class="
                                text-sm
                                font-semibold
                                text-gray-900
                                dark:text-gray-100
                            ">
                            Animations
                        </h3>

                        <p class="
                                mt-2
                                text-sm
                                leading-6
                                text-gray-500
                                dark:text-gray-400
                            ">
                            Create transforms, animations, and interactive
                            visual effects.
                        </p>
                    </div>
                </div>
            </div>

            <!-- How to use -->
            <div class="mt-12">
                <h2 class="
                        font-sans
                        text-xl
                        font-semibold
                        tracking-tight
                        text-gray-900
                        dark:text-gray-100
                    ">
                    How to use the generator
                </h2>

                <p class="
                        mt-3
                        max-w-3xl
                        text-sm
                        leading-7
                        text-gray-600
                        dark:text-gray-400
                    ">
                    Choose a generator from the sidebar, adjust its options,
                    preview the result, and copy the generated CSS when you're
                    ready to use it in your project.
                </p>
            </div>

            <!-- Getting started -->
            <div class="mt-12">
                <h2 class="
                        font-sans
                        text-xl
                        font-semibold
                        tracking-tight
                        text-gray-900
                        dark:text-gray-100
                    ">
                    Get started
                </h2>

                <p class="
                        mt-3
                        max-w-3xl
                        text-sm
                        leading-7
                        text-gray-600
                        dark:text-gray-400
                    ">
                    Select a tool from the sidebar to start generating CSS.
                    Each generator provides controls for customizing the
                    property and a live preview of the result.
                </p>
            </div>

        </div>
    </section>
</template>
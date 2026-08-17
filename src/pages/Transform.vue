<script setup>
import { computed, ref } from 'vue'
import {
    Check,
    Code2,
    Copy,
    RotateCcw,
    SlidersHorizontal,
    Sparkles,
} from 'lucide-vue-next'

const copied = ref(false)

const settings = ref({
    translateX: 0,
    translateY: 0,
    translateZ: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    originX: 50,
    originY: 50,
})

const defaultSettings = {
    translateX: 0,
    translateY: 0,
    translateZ: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    originX: 50,
    originY: 50,
}

const transformValue = computed(() => {
    const s = settings.value

    const values = [
        `translateX(${s.translateX}px)`,
        `translateY(${s.translateY}px)`,
        `translateZ(${s.translateZ}px)`,
        `rotateX(${s.rotateX}deg)`,
        `rotateY(${s.rotateY}deg)`,
        `rotateZ(${s.rotateZ}deg)`,
        `scaleX(${s.scaleX})`,
        `scaleY(${s.scaleY})`,
        `skewX(${s.skewX}deg)`,
        `skewY(${s.skewY}deg)`,
    ]

    return values.join(' ')
})

const generatedCss = computed(() => {
    const s = settings.value

    return `.transform-element {
    transform:
        ${transformValue.value};
    transform-origin:
        ${s.originX}% ${s.originY}%;
}`
})

const previewStyle = computed(() => ({
    transform: transformValue.value,
    transformOrigin: `${settings.value.originX}% ${settings.value.originY}%`,
}))

const reset = () => {
    settings.value = { ...defaultSettings }
    copied.value = false
}

const copyCss = async () => {
    try {
        await navigator.clipboard.writeText(generatedCss.value)

        copied.value = true

        window.setTimeout(() => {
            copied.value = false
        }, 1500)
    } catch {
        copied.value = false
    }
}
</script>

<template>
    <main
        class="min-h-screen bg-[#f8fafc] text-[#10233f] transition-colors dark:bg-gray-950 dark:text-gray-100"
    >
        <!-- Header -->
        <section
            class="border-b border-slate-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        >
            <div class="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
                <div
                    class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div>
                        <div
                            class="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#167fa8] dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-400"
                        >
                            <Sparkles class="h-3.5 w-3.5" />
                            CSS Builder
                        </div>

                        <h1
                            class="text-3xl font-bold tracking-tight text-[#10233f] dark:text-gray-100 sm:text-4xl"
                        >
                            Transform Generator
                        </h1>

                        <p
                            class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-gray-400"
                        >
                            Create CSS transforms visually with live preview,
                            translation, rotation, scaling, skewing and transform
                            origin controls.
                        </p>
                    </div>

                    <button
                        type="button"
                        @click="reset"
                        class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        <RotateCcw class="h-4 w-4" />
                        Reset
                    </button>
                </div>
            </div>
        </section>

        <!-- Workspace -->
        <section class="mx-auto max-w-[1400px] px-6 py-6 lg:px-8">
            <div class="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
                <!-- Controls -->
                <aside
                    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                    <div
                        class="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-gray-800"
                    >
                        <div
                            class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400"
                        >
                            <SlidersHorizontal class="h-5 w-5" />
                        </div>

                        <div>
                            <h2
                                class="text-sm font-semibold text-[#10233f] dark:text-gray-100"
                            >
                                Transform Settings
                            </h2>

                            <p
                                class="text-xs text-slate-500 dark:text-gray-400"
                            >
                                Customize your transform
                            </p>
                        </div>
                    </div>

                    <div class="space-y-7 p-5">
                        <!-- Translation -->
                        <div>
                            <label
                                class="mb-4 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                            >
                                Translation
                            </label>

                            <div class="space-y-5">
                                <div>
                                    <label
                                        class="mb-2 flex justify-between text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        <span>Translate X</span>
                                        <span
                                            class="font-mono text-[#167fa8] dark:text-cyan-400"
                                        >
                                            {{ settings.translateX }}px
                                        </span>
                                    </label>

                                    <input
                                        v-model.number="settings.translateX"
                                        type="range"
                                        min="-200"
                                        max="200"
                                        class="w-full accent-cyan-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        class="mb-2 flex justify-between text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        <span>Translate Y</span>
                                        <span
                                            class="font-mono text-[#167fa8] dark:text-cyan-400"
                                        >
                                            {{ settings.translateY }}px
                                        </span>
                                    </label>

                                    <input
                                        v-model.number="settings.translateY"
                                        type="range"
                                        min="-200"
                                        max="200"
                                        class="w-full accent-cyan-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        class="mb-2 flex justify-between text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        <span>Translate Z</span>
                                        <span
                                            class="font-mono text-[#167fa8] dark:text-cyan-400"
                                        >
                                            {{ settings.translateZ }}px
                                        </span>
                                    </label>

                                    <input
                                        v-model.number="settings.translateZ"
                                        type="range"
                                        min="-200"
                                        max="200"
                                        class="w-full accent-cyan-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Rotation -->
                        <div>
                            <label
                                class="mb-4 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                            >
                                Rotation
                            </label>

                            <div class="space-y-5">
                                <div>
                                    <label
                                        class="mb-2 flex justify-between text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        <span>Rotate X</span>
                                        <span
                                            class="font-mono text-[#167fa8] dark:text-cyan-400"
                                        >
                                            {{ settings.rotateX }}°
                                        </span>
                                    </label>

                                    <input
                                        v-model.number="settings.rotateX"
                                        type="range"
                                        min="-180"
                                        max="180"
                                        class="w-full accent-cyan-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        class="mb-2 flex justify-between text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        <span>Rotate Y</span>
                                        <span
                                            class="font-mono text-[#167fa8] dark:text-cyan-400"
                                        >
                                            {{ settings.rotateY }}°
                                        </span>
                                    </label>

                                    <input
                                        v-model.number="settings.rotateY"
                                        type="range"
                                        min="-180"
                                        max="180"
                                        class="w-full accent-cyan-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        class="mb-2 flex justify-between text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        <span>Rotate Z</span>
                                        <span
                                            class="font-mono text-[#167fa8] dark:text-cyan-400"
                                        >
                                            {{ settings.rotateZ }}°
                                        </span>
                                    </label>

                                    <input
                                        v-model.number="settings.rotateZ"
                                        type="range"
                                        min="-360"
                                        max="360"
                                        class="w-full accent-cyan-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Scale -->
                        <div>
                            <label
                                class="mb-4 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                            >
                                Scale
                            </label>

                            <div class="space-y-5">
                                <div>
                                    <label
                                        class="mb-2 flex justify-between text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        <span>Scale X</span>
                                        <span
                                            class="font-mono text-[#167fa8] dark:text-cyan-400"
                                        >
                                            {{ settings.scaleX }}
                                        </span>
                                    </label>

                                    <input
                                        v-model.number="settings.scaleX"
                                        type="range"
                                        min="0.2"
                                        max="3"
                                        step="0.1"
                                        class="w-full accent-cyan-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        class="mb-2 flex justify-between text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        <span>Scale Y</span>
                                        <span
                                            class="font-mono text-[#167fa8] dark:text-cyan-400"
                                        >
                                            {{ settings.scaleY }}
                                        </span>
                                    </label>

                                    <input
                                        v-model.number="settings.scaleY"
                                        type="range"
                                        min="0.2"
                                        max="3"
                                        step="0.1"
                                        class="w-full accent-cyan-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Skew -->
                        <div>
                            <label
                                class="mb-4 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                            >
                                Skew
                            </label>

                            <div class="space-y-5">
                                <div>
                                    <label
                                        class="mb-2 flex justify-between text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        <span>Skew X</span>
                                        <span
                                            class="font-mono text-[#167fa8] dark:text-cyan-400"
                                        >
                                            {{ settings.skewX }}°
                                        </span>
                                    </label>

                                    <input
                                        v-model.number="settings.skewX"
                                        type="range"
                                        min="-90"
                                        max="90"
                                        class="w-full accent-cyan-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        class="mb-2 flex justify-between text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        <span>Skew Y</span>
                                        <span
                                            class="font-mono text-[#167fa8] dark:text-cyan-400"
                                        >
                                            {{ settings.skewY }}°
                                        </span>
                                    </label>

                                    <input
                                        v-model.number="settings.skewY"
                                        type="range"
                                        min="-90"
                                        max="90"
                                        class="w-full accent-cyan-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Origin -->
                        <div>
                            <label
                                class="mb-4 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                            >
                                Transform Origin
                            </label>

                            <div class="space-y-5">
                                <div>
                                    <label
                                        class="mb-2 flex justify-between text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        <span>Horizontal</span>
                                        <span
                                            class="font-mono text-[#167fa8] dark:text-cyan-400"
                                        >
                                            {{ settings.originX }}%
                                        </span>
                                    </label>

                                    <input
                                        v-model.number="settings.originX"
                                        type="range"
                                        min="0"
                                        max="100"
                                        class="w-full accent-cyan-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        class="mb-2 flex justify-between text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        <span>Vertical</span>
                                        <span
                                            class="font-mono text-[#167fa8] dark:text-cyan-400"
                                        >
                                            {{ settings.originY }}%
                                        </span>
                                    </label>

                                    <input
                                        v-model.number="settings.originY"
                                        type="range"
                                        min="0"
                                        max="100"
                                        class="w-full accent-cyan-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- Main -->
                <div class="min-w-0 space-y-6">
                    <!-- Preview -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400"
                                >
                                    <Move3d class="h-5 w-5" />
                                </div>

                                <div>
                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-gray-100"
                                    >
                                        Transform Preview
                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        Changes are applied instantly
                                    </p>
                                </div>
                            </div>

                            <span
                                class="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                            >
                                <span
                                    class="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"
                                ></span>
                                Live
                            </span>
                        </div>

                        <div
                            class="border-b border-slate-200 bg-[#f8fafc] p-6 dark:border-gray-800 dark:bg-gray-950 sm:p-10"
                        >
                            <div
                                class="flex min-h-[430px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white p-10 dark:border-gray-700 dark:bg-gray-900"
                            >
                                <div
                                    class="relative flex h-48 w-48 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-center text-lg font-semibold text-[#17447f] shadow-sm transition-none dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-300"
                                    :style="previewStyle"
                                >
                                    CSSCraft
                                </div>
                            </div>
                        </div>

                        <div
                            class="grid grid-cols-2 divide-x divide-slate-200 dark:divide-gray-800 sm:grid-cols-4"
                        >
                            <div class="p-4">
                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    Translate
                                </p>

                                <p
                                    class="mt-1 text-xs font-semibold text-[#10233f] dark:text-gray-200"
                                >
                                    {{ settings.translateX }}px,
                                    {{ settings.translateY }}px
                                </p>
                            </div>

                            <div class="p-4">
                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    Rotation
                                </p>

                                <p
                                    class="mt-1 text-xs font-semibold text-[#10233f] dark:text-gray-200"
                                >
                                    {{ settings.rotateZ }}°
                                </p>
                            </div>

                            <div class="p-4">
                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    Scale
                                </p>

                                <p
                                    class="mt-1 text-xs font-semibold text-[#10233f] dark:text-gray-200"
                                >
                                    {{ settings.scaleX }} ×
                                    {{ settings.scaleY }}
                                </p>
                            </div>

                            <div class="p-4">
                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    Origin
                                </p>

                                <p
                                    class="mt-1 text-xs font-semibold text-[#10233f] dark:text-gray-200"
                                >
                                    {{ settings.originX }}% /
                                    {{ settings.originY }}%
                                </p>
                            </div>
                        </div>
                    </section>

                    <!-- Generated CSS -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-300"
                                >
                                    <Code2 class="h-4 w-4" />
                                </div>

                                <div>
                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-gray-100"
                                    >
                                        Generated CSS
                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        Ready-to-use transform CSS.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                @click="copyCss"
                                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400"
                            >
                                <Check
                                    v-if="copied"
                                    class="h-3.5 w-3.5 text-emerald-500"
                                />

                                <Copy
                                    v-else
                                    class="h-3.5 w-3.5"
                                />

                                {{ copied ? 'Copied' : 'Copy CSS' }}
                            </button>
                        </div>

                        <pre
                            class="overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"
                        ><code>{{ generatedCss }}</code></pre>
                    </section>

                    <!-- Transform Value -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="border-b border-slate-200 px-5 py-4 dark:border-gray-800"
                        >
                            <h2
                                class="text-sm font-semibold text-[#10233f] dark:text-gray-100"
                            >
                                Transform Value
                            </h2>

                            <p
                                class="mt-1 text-xs text-slate-500 dark:text-gray-400"
                            >
                                The generated transform property.
                            </p>
                        </div>

                        <div class="p-5">
                            <code
                                class="block overflow-auto rounded-xl bg-[#101827] p-4 text-xs leading-6 text-cyan-300"
                            >
                                transform: {{ transformValue }};
                            </code>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    </main>
</template>
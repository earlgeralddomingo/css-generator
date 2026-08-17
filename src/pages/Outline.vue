<script setup>
import { computed, ref } from 'vue'
import {
    Check,
    Code2,
    Copy,
    Download,
    FileCode2,
    RotateCcw,
    SlidersHorizontal,
    Sparkles,
    Square,
} from 'lucide-vue-next'

const copied = ref('')
const activeTab = ref('controls')

const settings = ref({
    width: 4,
    style: 'solid',
    color: '#17447f',
    offset: 4,
})

const defaultSettings = {
    width: 4,
    style: 'solid',
    color: '#17447f',
    offset: 4,
}

const outlineValue = computed(() => {
    return `${settings.value.width}px ${settings.value.style} ${settings.value.color}`
})

const previewStyle = computed(() => ({
    outline: outlineValue.value,
    outlineOffset: `${settings.value.offset}px`,
}))

const generatedCss = computed(() => {
    return `.outline-preview {
    outline: ${outlineValue.value};
    outline-offset: ${settings.value.offset}px;
}`
})

const generatedHtml = computed(() => {
    return `<div class="outline-preview">
</div>`
})

const completeCode = computed(() => {
    return `${generatedHtml.value}

<style>
.outline-preview {
    width: 280px;
    height: 180px;
    background: #17447f;
    outline: ${outlineValue.value};
    outline-offset: ${settings.value.offset}px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: sans-serif;
}
</style>`
})

const reset = () => {
    settings.value = { ...defaultSettings }
    activeTab.value = 'controls'
    copied.value = ''
}

const copyText = async (value, type) => {
    try {
        await navigator.clipboard.writeText(value)

        copied.value = type

        window.setTimeout(() => {
            if (copied.value === type) {
                copied.value = ''
            }
        }, 1500)
    } catch {
        copied.value = ''
    }
}

const exportHtml = () => {
    const blob = new Blob([completeCode.value], {
        type: 'text/html;charset=utf-8',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'outline-generator.html'

    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
}
</script>

<template>
    <main
        class="min-h-screen bg-[#f8fafc] text-[#10233f] transition-colors duration-200 dark:bg-gray-950 dark:text-gray-100">

        <!-- Header -->
        <section
            class="border-b border-slate-200 bg-white transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900">

            <div class="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">

                <div
                    class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <div
                            class="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#167fa8] dark:border-cyan-900/70 dark:bg-cyan-950/40 dark:text-cyan-400">

                            <Sparkles class="h-3.5 w-3.5" />

                            CSS Builder
                        </div>

                        <h1
                            class="text-3xl font-bold tracking-tight text-[#10233f] sm:text-4xl dark:text-gray-100">

                            Outline Generator
                        </h1>

                        <p
                            class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-gray-400">

                            Customize your CSS outline visually and generate clean
                            CSS instantly.

                        </p>

                    </div>

                    <div class="flex flex-wrap gap-3">

                        <button
                            type="button"
                            @click="reset"
                            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">

                            <RotateCcw class="h-4 w-4" />

                            Reset
                        </button>

                        <button
                            type="button"
                            @click="exportHtml"
                            class="inline-flex items-center gap-2 rounded-xl bg-[#17447f] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#123968]">

                            <Download class="h-4 w-4" />

                            Export HTML
                        </button>

                    </div>
                </div>
            </div>
        </section>

        <!-- Workspace -->
        <section class="mx-auto max-w-[1400px] px-6 py-6 lg:px-8">

            <div class="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">

                <!-- Sidebar -->
                <aside
                    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900">

                    <!-- Tabs -->
                    <div
                        class="grid grid-cols-2 border-b border-slate-200 dark:border-gray-800">

                        <button
                            type="button"
                            @click="activeTab = 'controls'"
                            :class="[
                                'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                                activeTab === 'controls'
                                    ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8] dark:bg-cyan-950/30 dark:text-cyan-400'
                                    : 'text-slate-500 hover:bg-slate-50 dark:text-gray-400 dark:hover:bg-gray-800'
                            ]">

                            <SlidersHorizontal class="h-3.5 w-3.5" />

                            Controls
                        </button>

                        <button
                            type="button"
                            @click="activeTab = 'css'"
                            :class="[
                                'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                                activeTab === 'css'
                                    ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8] dark:bg-cyan-950/30 dark:text-cyan-400'
                                    : 'text-slate-500 hover:bg-slate-50 dark:text-gray-400 dark:hover:bg-gray-800'
                            ]">

                            <Code2 class="h-3.5 w-3.5" />

                            CSS
                        </button>

                    </div>

                    <!-- Controls -->
                    <div
                        v-if="activeTab === 'controls'"
                        class="p-5">

                        <div class="mb-6 flex items-center gap-3">

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">

                                <SlidersHorizontal class="h-5 w-5" />

                            </div>

                            <div>

                                <h2
                                    class="text-sm font-semibold text-[#10233f] dark:text-gray-100">

                                    Outline Settings
                                </h2>

                                <p class="text-xs text-slate-500 dark:text-gray-400">

                                    Configure your outline
                                </p>

                            </div>

                        </div>

                        <!-- Width -->
                        <div>

                            <label
                                class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                <span>Width</span>

                                <span class="font-mono text-[#167fa8] dark:text-cyan-400">

                                    {{ settings.width }}px

                                </span>

                            </label>

                            <input
                                v-model.number="settings.width"
                                type="range"
                                min="0"
                                max="20"
                                class="w-full accent-cyan-500" />

                        </div>

                        <!-- Style -->
                        <div class="mt-6">

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Style
                            </label>

                            <select
                                v-model="settings.style"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-900/40">

                                <option value="solid">solid</option>
                                <option value="dashed">dashed</option>
                                <option value="dotted">dotted</option>
                                <option value="double">double</option>
                                <option value="groove">groove</option>
                                <option value="ridge">ridge</option>
                                <option value="inset">inset</option>
                                <option value="outset">outset</option>

                            </select>

                        </div>

                        <!-- Color -->
                        <div class="mt-6">

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Color
                            </label>

                            <div class="flex gap-2">

                                <input
                                    v-model="settings.color"
                                    type="color"
                                    class="h-11 w-14 cursor-pointer rounded-xl border border-slate-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800" />

                                <input
                                    v-model="settings.color"
                                    type="text"
                                    class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm text-slate-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-900/40" />

                            </div>

                        </div>

                        <!-- Offset -->
                        <div class="mt-6">

                            <label
                                class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                <span>Offset</span>

                                <span class="font-mono text-[#167fa8] dark:text-cyan-400">

                                    {{ settings.offset }}px

                                </span>

                            </label>

                            <input
                                v-model.number="settings.offset"
                                type="range"
                                min="-20"
                                max="30"
                                class="w-full accent-cyan-500" />

                        </div>

                        <!-- Current Value -->
                        <div
                            class="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-800/70">

                            <p
                                class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">

                                Outline
                            </p>

                            <p
                                class="mt-2 break-all font-mono text-xs leading-5 text-[#10233f] dark:text-gray-200">

                                {{ outlineValue }}

                            </p>

                            <p
                                class="mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">

                                Offset
                            </p>

                            <p
                                class="mt-1 font-mono text-xs text-[#10233f] dark:text-gray-200">

                                {{ settings.offset }}px

                            </p>

                        </div>

                    </div>

                    <!-- CSS -->
                    <div v-else class="p-5">

                        <div class="mb-5 flex items-center gap-3">

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">

                                <Code2 class="h-5 w-5" />

                            </div>

                            <div>

                                <h2
                                    class="text-sm font-semibold text-[#10233f] dark:text-gray-100">

                                    Generated CSS
                                </h2>

                                <p class="text-xs text-slate-500 dark:text-gray-400">

                                    Based on your outline settings
                                </p>

                            </div>

                        </div>

                        <pre
                            class="overflow-auto rounded-xl bg-[#101827] p-4 text-xs leading-6 text-slate-200"><code>{{ generatedCss }}</code></pre>

                        <button
                            type="button"
                            @click="copyText(generatedCss, 'css')"
                            class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#17447f] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#123968]">

                            <Check
                                v-if="copied === 'css'"
                                class="h-4 w-4" />

                            <Copy
                                v-else
                                class="h-4 w-4" />

                            {{ copied === 'css' ? 'Copied' : 'Copy CSS' }}

                        </button>

                    </div>

                </aside>

                <!-- Main -->
                <div class="min-w-0 space-y-6">

                    <!-- Preview -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900">

                        <div
                            class="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">

                                    <Square class="h-5 w-5" />

                                </div>

                                <div>

                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-gray-100">

                                        Outline Editor
                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400">

                                        {{ outlineValue }} · offset
                                        {{ settings.offset }}px

                                    </p>

                                </div>

                            </div>

                            <div class="flex items-center gap-2">

                                <span
                                    class="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400">

                                    Outline
                                </span>

                                <span
                                    class="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">

                                    <span
                                        class="h-1.5 w-1.5 rounded-full bg-emerald-500">
                                    </span>

                                    Live
                                </span>

                            </div>

                        </div>

                        <!-- Preview Body -->
                        <div
                            class="border-b border-slate-200 bg-[#f8fafc] p-6 sm:p-10 dark:border-gray-800 dark:bg-gray-950">

                            <div
                                class="mb-5 rounded-xl border border-cyan-200 bg-cyan-50/70 px-4 py-3 dark:border-cyan-900/70 dark:bg-cyan-950/30">

                                <div class="flex items-start gap-3">

                                    <SlidersHorizontal
                                        class="mt-0.5 h-4 w-4 shrink-0 text-[#167fa8] dark:text-cyan-400" />

                                    <div>

                                        <p
                                            class="text-xs font-semibold text-[#167fa8] dark:text-cyan-400">

                                            Visual Outline Editor
                                        </p>

                                        <p
                                            class="mt-1 text-xs leading-5 text-[#2b6b86] dark:text-cyan-200/70">

                                            Adjust the width, style, color, and offset
                                            to see your outline update instantly.

                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div
                                class="rounded-xl border border-dashed border-slate-300 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">

                                <div
                                    class="flex min-h-[430px] items-center justify-center overflow-auto rounded-lg border border-slate-200 bg-white p-12 dark:border-gray-700 dark:bg-gray-800"
                                    style="background-image: radial-gradient(#d7dde5 1px, transparent 1px); background-size: 20px 20px;">

                                    <div
                                        class="flex h-[180px] w-[280px] items-center justify-center rounded-2xl bg-[#17447f] text-white shadow-xl transition-all duration-150"
                                        :style="previewStyle">

                                        <div class="text-center">

                                            <p class="text-lg font-bold">
                                                CSSCraft
                                            </p>

                                            <p class="mt-1 text-xs text-white/70">
                                                Outline Preview
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <!-- Properties -->
                        <div
                            class="grid grid-cols-2 divide-x divide-slate-200 dark:divide-gray-800 sm:grid-cols-4">

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">

                                    Width
                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200">

                                    {{ settings.width }}px
                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">

                                    Style
                                </p>

                                <p
                                    class="mt-1 truncate font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200">

                                    {{ settings.style }}
                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">

                                    Color
                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200">

                                    {{ settings.color }}
                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">

                                    Offset
                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200">

                                    {{ settings.offset }}px
                                </p>

                            </div>

                        </div>

                    </section>

                    <!-- Generated CSS -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-300">

                                    <Code2 class="h-4 w-4" />

                                </div>

                                <div>

                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-gray-100">

                                        Generated CSS
                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400">

                                        CSS generated from your outline settings.

                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                @click="copyText(generatedCss, 'generated-css')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400">

                                <Check
                                    v-if="copied === 'generated-css'"
                                    class="h-3.5 w-3.5 text-emerald-500" />

                                <Copy
                                    v-else
                                    class="h-3.5 w-3.5" />

                                {{ copied === 'generated-css'
                                    ? 'Copied'
                                    : 'Copy CSS' }}

                            </button>

                        </div>

                        <pre
                            class="overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"><code>{{ generatedCss }}</code></pre>

                    </section>

                    <!-- Generated HTML -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-300">

                                    <FileCode2 class="h-4 w-4" />

                                </div>

                                <div>

                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-gray-100">

                                        Generated HTML
                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400">

                                        HTML structure for the preview.

                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                @click="copyText(generatedHtml, 'html')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400">

                                <Check
                                    v-if="copied === 'html'"
                                    class="h-3.5 w-3.5 text-emerald-500" />

                                <Copy
                                    v-else
                                    class="h-3.5 w-3.5" />

                                {{ copied === 'html'
                                    ? 'Copied'
                                    : 'Copy HTML' }}

                            </button>

                        </div>

                        <pre
                            class="overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"><code>{{ generatedHtml }}</code></pre>

                    </section>

                    <!-- Complete Code -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400">

                                    <FileCode2 class="h-4 w-4" />

                                </div>

                                <div>

                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-gray-100">

                                        Complete Code
                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400">

                                        Ready-to-use HTML and CSS.

                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                @click="copyText(completeCode, 'complete')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#17447f] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#123968]">

                                <Check
                                    v-if="copied === 'complete'"
                                    class="h-3.5 w-3.5" />

                                <Copy
                                    v-else
                                    class="h-3.5 w-3.5" />

                                {{ copied === 'complete'
                                    ? 'Copied'
                                    : 'Copy Complete Code' }}

                            </button>

                        </div>

                        <pre
                            class="max-h-[500px] overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"><code>{{ completeCode }}</code></pre>

                    </section>

                </div>
            </div>
        </section>
    </main>
</template>
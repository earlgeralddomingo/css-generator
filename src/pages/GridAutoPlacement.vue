<script setup>
import { computed, ref } from 'vue'
import {
    Check,
    Code2,
    Copy,
    Download,
    FileCode2,
    Import,
    LayoutGrid,
    Palette,
    RotateCcw,
    SlidersHorizontal,
    Sparkles,
} from 'lucide-vue-next'

const copied = ref('')
const activeTab = ref('layout')

const htmlCode = ref(`<div class="grid-item">1</div>
<div class="grid-item">2</div>
<div class="grid-item">3</div>
<div class="grid-item">4</div>
<div class="grid-item">5</div>
<div class="grid-item">6</div>
<div class="grid-item">7</div>
<div class="grid-item">8</div>`)

const customCss = ref(`.grid-item {
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: #17447f;
    color: white;
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
}`)

const settings = ref({
    flow: 'row',
    rowSize: 100,
    columnSize: 100,
    gap: 16,
})

const defaultSettings = {
    flow: 'row',
    rowSize: 100,
    columnSize: 100,
    gap: 16,
}

const defaultHtml = `<div class="grid-item">1</div>
<div class="grid-item">2</div>
<div class="grid-item">3</div>
<div class="grid-item">4</div>
<div class="grid-item">5</div>
<div class="grid-item">6</div>
<div class="grid-item">7</div>
<div class="grid-item">8</div>`

const defaultCss = `.grid-item {
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: #17447f;
    color: white;
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
}`

const previewStyle = computed(() => ({
    display: 'grid',
    gridAutoFlow: settings.value.flow,
    gridAutoRows: `${settings.value.rowSize}px`,
    gridAutoColumns: `${settings.value.columnSize}px`,
    gap: `${settings.value.gap}px`,
}))

const generatedCss = computed(() => {
    return `.grid-container {
    display: grid;
    grid-auto-flow: ${settings.value.flow};
    grid-auto-rows: ${settings.value.rowSize}px;
    grid-auto-columns: ${settings.value.columnSize}px;
    gap: ${settings.value.gap}px;
}

${customCss.value}`
})

const generatedHtml = computed(() => {
    const lines = htmlCode.value
        .split('\n')
        .map((line) => `    ${line}`)
        .join('\n')

    return `<div class="grid-container">
${lines}
</div>`
})

const completeCode = computed(() => {
    return `${generatedHtml.value}

<style>
${generatedCss.value}
</style>`
})

const previewItems = computed(() => {
    return htmlCode.value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
})

const exportHtml = () => {
    const blob = new Blob([completeCode.value], {
        type: 'text/html',
    })

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'grid-auto-placement.html'
    link.click()

    URL.revokeObjectURL(url)
}

const reset = () => {
    settings.value = {
        ...defaultSettings,
    }

    htmlCode.value = defaultHtml
    customCss.value = defaultCss
    activeTab.value = 'layout'
}

const copyText = async (text, type) => {
    try {
        await navigator.clipboard.writeText(text)

        copied.value = type

        setTimeout(() => {
            if (copied.value === type) {
                copied.value = ''
            }
        }, 1500)
    } catch {
        copied.value = ''
    }
}
</script>

<template>
    <main class="min-h-screen bg-[#f8fafc] text-[#10233f] transition-colors dark:bg-gray-950 dark:text-gray-100">

        <!-- Page Header -->
        <section class="border-b border-slate-200 bg-white transition-colors dark:border-gray-800 dark:bg-gray-900">

            <div class="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">

                <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <div
                            class="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#167fa8] dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-400">

                            <Sparkles class="h-3.5 w-3.5" />

                            CSS Builder
                        </div>

                        <h1
                            class="text-3xl font-bold tracking-tight text-[#10233f] sm:text-4xl dark:text-gray-100">

                            Grid Auto Placement Generator
                        </h1>

                        <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-gray-400">
                            Visually control automatic CSS Grid item placement and generate clean HTML and CSS.
                        </p>

                    </div>

                    <div class="flex flex-wrap items-center gap-3">

                        <button
                            type="button"
                            @click="reset"
                            class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800">

                            <RotateCcw class="h-4 w-4" />

                            Reset
                        </button>

                        <button
                            type="button"
                            @click="exportHtml"
                            class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17447f] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#123968]">

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

                <!-- Left Builder Panel -->
                <aside
                    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">

                    <!-- Builder Tabs -->
                    <div class="grid grid-cols-4 border-b border-slate-200 dark:border-gray-800">

                        <button
                            type="button"
                            @click="activeTab = 'layout'"
                            :class="[
                                'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                                activeTab === 'layout'
                                    ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8] dark:bg-cyan-950/30 dark:text-cyan-400'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                            ]">

                            <LayoutGrid class="h-3.5 w-3.5" />

                            Layout
                        </button>

                        <button
                            type="button"
                            @click="activeTab = 'style'"
                            :class="[
                                'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                                activeTab === 'style'
                                    ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8] dark:bg-cyan-950/30 dark:text-cyan-400'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                            ]">

                            <Palette class="h-3.5 w-3.5" />

                            Style
                        </button>

                        <button
                            type="button"
                            @click="activeTab = 'css'"
                            :class="[
                                'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                                activeTab === 'css'
                                    ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8] dark:bg-cyan-950/30 dark:text-cyan-400'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                            ]">

                            <Code2 class="h-3.5 w-3.5" />

                            CSS
                        </button>

                        <button
                            type="button"
                            @click="activeTab = 'import'"
                            :class="[
                                'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                                activeTab === 'import'
                                    ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8] dark:bg-cyan-950/30 dark:text-cyan-400'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                            ]">

                            <Import class="h-3.5 w-3.5" />

                            Import
                        </button>

                    </div>

                    <!-- Layout Tab -->
                    <div v-if="activeTab === 'layout'" class="p-5">

                        <div class="mb-6 flex items-center gap-3">

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">

                                <SlidersHorizontal class="h-5 w-5" />

                            </div>

                            <div>

                                <h2 class="text-sm font-semibold text-[#10233f] dark:text-gray-100">
                                    Grid Settings
                                </h2>

                                <p class="text-xs text-slate-500 dark:text-gray-400">
                                    Configure auto placement
                                </p>

                            </div>

                        </div>

                        <div class="space-y-5">

                            <!-- Auto Flow -->
                            <div>

                                <label
                                    class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                    Grid Auto Flow
                                </label>

                                <select
                                    v-model="settings.flow"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-950">

                                    <option value="row">row</option>
                                    <option value="column">column</option>
                                    <option value="dense">dense</option>
                                    <option value="row dense">row dense</option>
                                    <option value="column dense">column dense</option>

                                </select>

                            </div>

                            <!-- Auto Rows -->
                            <div>

                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                    <span>Auto Rows</span>

                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                        {{ settings.rowSize }}px
                                    </span>

                                </label>

                                <input
                                    v-model.number="settings.rowSize"
                                    type="range"
                                    min="40"
                                    max="250"
                                    class="w-full accent-cyan-500" />

                            </div>

                            <!-- Auto Columns -->
                            <div>

                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                    <span>Auto Columns</span>

                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                        {{ settings.columnSize }}px
                                    </span>

                                </label>

                                <input
                                    v-model.number="settings.columnSize"
                                    type="range"
                                    min="40"
                                    max="250"
                                    class="w-full accent-cyan-500" />

                            </div>

                            <!-- Gap -->
                            <div>

                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                    <span>Gap</span>

                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                        {{ settings.gap }}px
                                    </span>

                                </label>

                                <input
                                    v-model.number="settings.gap"
                                    type="range"
                                    min="0"
                                    max="60"
                                    class="w-full accent-cyan-500" />

                            </div>

                        </div>
                    </div>

                    <!-- Style Tab -->
                    <div v-else-if="activeTab === 'style'" class="p-5">

                        <div class="mb-5 flex items-center gap-3">

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">

                                <Palette class="h-5 w-5" />

                            </div>

                            <div>

                                <h2 class="text-sm font-semibold text-[#10233f] dark:text-gray-100">
                                    Item Styling
                                </h2>

                                <p class="text-xs text-slate-500 dark:text-gray-400">
                                    Customize Grid items
                                </p>

                            </div>

                        </div>

                        <div class="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700">

                            <div
                                class="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">

                                <p class="text-xs font-semibold text-slate-700 dark:text-gray-200">
                                    Custom CSS
                                </p>

                                <p class="mt-1 text-[11px] text-slate-500 dark:text-gray-400">
                                    Styles are applied to the preview items.
                                </p>

                            </div>

                            <textarea
                                v-model="customCss"
                                spellcheck="false"
                                class="min-h-[430px] w-full resize-y bg-[#101827] p-4 font-mono text-xs leading-6 text-slate-200 outline-none"></textarea>

                        </div>

                        <button
                            type="button"
                            @click="copyText(customCss, 'custom')"
                            class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400">

                            <Check
                                v-if="copied === 'custom'"
                                class="h-4 w-4 text-emerald-500" />

                            <Copy v-else class="h-4 w-4" />

                            {{ copied === 'custom' ? 'Copied' : 'Copy Custom CSS' }}

                        </button>

                    </div>

                    <!-- CSS Tab -->
                    <div v-else-if="activeTab === 'css'" class="p-5">

                        <div class="mb-5 flex items-center gap-3">

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">

                                <Code2 class="h-5 w-5" />

                            </div>

                            <div>

                                <h2 class="text-sm font-semibold text-[#10233f] dark:text-gray-100">
                                    Generated CSS
                                </h2>

                                <p class="text-xs text-slate-500 dark:text-gray-400">
                                    Based on your Grid settings
                                </p>

                            </div>

                        </div>

                        <div class="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700">

                            <pre
                                class="max-h-[500px] overflow-auto bg-[#101827] p-4 text-xs leading-6 text-slate-200"><code>{{ generatedCss }}</code></pre>

                        </div>

                        <button
                            type="button"
                            @click="copyText(generatedCss, 'css')"
                            class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#17447f] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#123968]">

                            <Check v-if="copied === 'css'" class="h-4 w-4" />

                            <Copy v-else class="h-4 w-4" />

                            {{ copied === 'css' ? 'Copied' : 'Copy CSS' }}

                        </button>

                    </div>

                    <!-- Import / HTML Tab -->
                    <div v-else class="p-5">

                        <div class="mb-5 flex items-center gap-3">

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">

                                <FileCode2 class="h-5 w-5" />

                            </div>

                            <div>

                                <h2 class="text-sm font-semibold text-[#10233f] dark:text-gray-100">
                                    HTML Structure
                                </h2>

                                <p class="text-xs text-slate-500 dark:text-gray-400">
                                    Customize your Grid items
                                </p>

                            </div>

                        </div>

                        <textarea
                            v-model="htmlCode"
                            spellcheck="false"
                            class="min-h-[430px] w-full resize-y rounded-xl border border-slate-200 bg-[#101827] p-4 font-mono text-xs leading-6 text-slate-200 outline-none focus:border-cyan-400 dark:border-gray-700"></textarea>

                        <button
                            type="button"
                            @click="copyText(generatedHtml, 'html')"
                            class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400">

                            <Check
                                v-if="copied === 'html'"
                                class="h-4 w-4 text-emerald-500" />

                            <Copy v-else class="h-4 w-4" />

                            {{ copied === 'html' ? 'Copied' : 'Copy HTML' }}

                        </button>

                    </div>

                </aside>

                <!-- Right Preview -->
                <div class="min-w-0 space-y-6">

                    <!-- Preview Card -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">

                        <!-- Preview Header -->
                        <div
                            class="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">

                                    <LayoutGrid class="h-5 w-5" />

                                </div>

                                <div>

                                    <h2 class="text-sm font-semibold text-[#10233f] dark:text-gray-100">
                                        Grid Editor
                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-gray-400">
                                        auto-{{ settings.flow }}
                                        · {{ settings.gap }}px gap
                                    </p>

                                </div>

                            </div>

                            <div class="flex items-center gap-2">

                                <span
                                    class="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400">

                                    {{ previewItems.length }} items

                                </span>

                                <span
                                    class="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">

                                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>

                                    Live

                                </span>

                            </div>

                        </div>

                        <!-- Preview Body -->
                        <div
                            class="border-b border-slate-200 bg-[#f8fafc] p-6 sm:p-10 dark:border-gray-800 dark:bg-gray-950">

                            <div
                                class="mb-5 rounded-xl border border-cyan-200 bg-cyan-50/70 px-4 py-3 dark:border-cyan-900/60 dark:bg-cyan-950/30">

                                <div class="flex items-start gap-3">

                                    <SlidersHorizontal
                                        class="mt-0.5 h-4 w-4 shrink-0 text-[#167fa8] dark:text-cyan-400" />

                                    <div>

                                        <p class="text-xs font-semibold text-[#167fa8] dark:text-cyan-400">
                                            Visual Grid auto-placement editor
                                        </p>

                                        <p class="mt-1 text-xs leading-5 text-[#2b6b86] dark:text-cyan-200/70">
                                            Change the placement controls to see Grid items automatically reposition
                                            themselves.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <!-- Canvas -->
                            <div
                                class="rounded-xl border border-dashed border-slate-300 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">

                                <div
                                    class="min-h-[430px] w-full rounded-lg border border-slate-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
                                    style="background-image: radial-gradient(#d7dde5 1px, transparent 1px); background-size: 20px 20px;">

                                    <div
                                        class="min-h-[380px] w-full overflow-auto rounded-lg border border-slate-200 bg-white/90 p-6 dark:border-gray-700 dark:bg-gray-950/90">

                                        <div
                                            class="grid-container mx-auto min-h-[330px] w-full max-w-5xl"
                                            :style="previewStyle">

                                            <div
                                                v-for="(item, index) in previewItems"
                                                :key="index"
                                                class="grid-item"
                                                v-html="item">
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <!-- Properties -->
                        <div
                            class="grid grid-cols-2 divide-x divide-slate-200 dark:divide-gray-800 sm:grid-cols-4">

                            <div class="p-4">

                                <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">
                                    Auto Flow
                                </p>

                                <p class="mt-1 truncate font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200">
                                    {{ settings.flow }}
                                </p>

                            </div>

                            <div class="p-4">

                                <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">
                                    Auto Rows
                                </p>

                                <p class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200">
                                    {{ settings.rowSize }}px
                                </p>

                            </div>

                            <div class="p-4">

                                <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">
                                    Auto Columns
                                </p>

                                <p class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200">
                                    {{ settings.columnSize }}px
                                </p>

                            </div>

                            <div class="p-4">

                                <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">
                                    Gap
                                </p>

                                <p class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200">
                                    {{ settings.gap }}px
                                </p>

                            </div>

                        </div>

                    </section>

                    <!-- Generated HTML -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">

                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-300">

                                    <Code2 class="h-4 w-4" />

                                </div>

                                <div>

                                    <h2 class="text-sm font-semibold text-[#10233f] dark:text-gray-100">
                                        Generated HTML
                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-gray-400">
                                        HTML structure generated from your editor.
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                @click="copyText(generatedHtml, 'html-code')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400">

                                <Check
                                    v-if="copied === 'html-code'"
                                    class="h-3.5 w-3.5 text-emerald-500" />

                                <Copy v-else class="h-3.5 w-3.5" />

                                {{ copied === 'html-code' ? 'Copied' : 'Copy HTML' }}

                            </button>

                        </div>

                        <pre
                            class="max-h-[400px] overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"><code>{{ generatedHtml }}</code></pre>

                    </section>

                    <!-- Generated CSS -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">

                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-300">

                                    <Code2 class="h-4 w-4" />

                                </div>

                                <div>

                                    <h2 class="text-sm font-semibold text-[#10233f] dark:text-gray-100">
                                        Generated CSS
                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-gray-400">
                                        CSS generated from your Grid settings.
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

                                <Copy v-else class="h-3.5 w-3.5" />

                                {{ copied === 'generated-css' ? 'Copied' : 'Copy CSS' }}

                            </button>

                        </div>

                        <pre
                            class="max-h-[400px] overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"><code>{{ generatedCss }}</code></pre>

                    </section>

                    <!-- Complete Code -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">

                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400">

                                    <FileCode2 class="h-4 w-4" />

                                </div>

                                <div>

                                    <h2 class="text-sm font-semibold text-[#10233f] dark:text-gray-100">
                                        Complete Code
                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-gray-400">
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

                                <Copy v-else class="h-3.5 w-3.5" />

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

<style scoped>
.grid-item {
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: #17447f;
    color: white;
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
}
</style>
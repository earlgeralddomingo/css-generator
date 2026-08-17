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

const htmlCode = ref(`<div class="flex-item">1</div>
<div class="flex-item">2</div>
<div class="flex-item">3</div>`)

const customCss = ref(`.flex-item {
    padding: 20px;
    background: #17447f;
    color: white;
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
}`)

const settings = ref({
    direction: 'row',
    wrap: 'nowrap',
    justify: 'center',
    align: 'center',
    alignContent: 'normal',
    gap: 16,
    rowGap: 16,
    columnGap: 16,
})

const defaultSettings = {
    direction: 'row',
    wrap: 'nowrap',
    justify: 'center',
    align: 'center',
    alignContent: 'normal',
    gap: 16,
    rowGap: 16,
    columnGap: 16,
}

const defaultHtml = `<div class="flex-item">1</div>
<div class="flex-item">2</div>
<div class="flex-item">3</div>`

const defaultCss = `.flex-item {
    padding: 20px;
    background: #17447f;
    color: white;
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
}`

const previewStyle = computed(() => ({
    display: 'flex',
    flexDirection: settings.value.direction,
    flexWrap: settings.value.wrap,
    justifyContent: settings.value.justify,
    alignItems: settings.value.align,
    alignContent: settings.value.alignContent,
    gap: `${settings.value.gap}px`,
    rowGap: `${settings.value.rowGap}px`,
    columnGap: `${settings.value.columnGap}px`,
}))

const generatedCss = computed(() => {
    return `.flex-container {
    display: flex;
    flex-direction: ${settings.value.direction};
    flex-wrap: ${settings.value.wrap};
    justify-content: ${settings.value.justify};
    align-items: ${settings.value.align};
    align-content: ${settings.value.alignContent};
    gap: ${settings.value.gap}px;
    row-gap: ${settings.value.rowGap}px;
    column-gap: ${settings.value.columnGap}px;
}`
})

const generatedHtml = computed(() => {
    const lines = htmlCode.value
        .split('\n')
        .map((line) => `    ${line}`)
        .join('\n')

    return `<div class="flex-container">
${lines}
</div>`
})

const completeCode = computed(() => {
    return `${generatedHtml.value}

<style>
${generatedCss.value}

${customCss.value}
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
        type: 'text/html;charset=utf-8',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'flexbox-layout.html'

    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
}

const reset = () => {
    settings.value = {
        ...defaultSettings,
    }

    htmlCode.value = defaultHtml
    customCss.value = defaultCss
    activeTab.value = 'layout'
    copied.value = ''
}

const copyText = async (text, type) => {
    try {
        await navigator.clipboard.writeText(text)

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
</script>

<template>
    <main
        class="min-h-screen bg-[#f8fafc] text-[#10233f] transition-colors duration-200 dark:bg-[#0b1120] dark:text-slate-100">

        <!-- Header -->
        <section
            class="border-b border-slate-200 bg-white transition-colors duration-200 dark:border-slate-800 dark:bg-[#111827]">

            <div class="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">

                <div
                    class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <div
                            class="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#167fa8] dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-400">

                            <Sparkles class="h-3.5 w-3.5" />

                            CSS Builder

                        </div>

                        <h1
                            class="text-3xl font-bold tracking-tight text-[#10233f] sm:text-4xl dark:text-slate-100">

                            Flexbox Generator

                        </h1>

                        <p
                            class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">

                            Visually create flexible CSS layouts and generate clean
                            HTML and CSS.

                        </p>

                    </div>

                    <div class="flex flex-wrap items-center gap-3">

                        <button
                            type="button"
                            @click="reset"
                            class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#172033] dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-[#1d293d]">

                            <RotateCcw class="h-4 w-4" />

                            Reset

                        </button>

                        <button
                            type="button"
                            @click="exportHtml"
                            class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17447f] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#123968] dark:bg-cyan-700 dark:hover:bg-cyan-600">

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
                    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-[#111827]">

                    <!-- Tabs -->
                    <div
                        class="grid grid-cols-4 border-b border-slate-200 dark:border-slate-800">

                        <button
                            type="button"
                            @click="activeTab = 'layout'"
                            :class="[
                                'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                                activeTab === 'layout'
                                    ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8] dark:bg-cyan-950/30 dark:text-cyan-400'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
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
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
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
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
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
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                            ]">

                            <Import class="h-3.5 w-3.5" />

                            HTML

                        </button>

                    </div>

                    <!-- Layout -->
                    <div
                        v-if="activeTab === 'layout'"
                        class="p-5">

                        <div class="mb-6 flex items-center gap-3">

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">

                                <SlidersHorizontal class="h-5 w-5" />

                            </div>

                            <div>

                                <h2
                                    class="text-sm font-semibold text-[#10233f] dark:text-slate-100">

                                    Flexbox Settings

                                </h2>

                                <p class="text-xs text-slate-500 dark:text-slate-400">
                                    Configure your layout
                                </p>

                            </div>

                        </div>

                        <div class="space-y-5">

                            <!-- Direction -->
                            <div>

                                <label
                                    class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                                    Flex Direction

                                </label>

                                <select
                                    v-model="settings.direction"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-[#172033] dark:text-slate-200 dark:focus:border-cyan-600 dark:focus:ring-cyan-950">

                                    <option value="row">row</option>
                                    <option value="row-reverse">row-reverse</option>
                                    <option value="column">column</option>
                                    <option value="column-reverse">column-reverse</option>

                                </select>

                            </div>

                            <!-- Wrap -->
                            <div>

                                <label
                                    class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                                    Flex Wrap

                                </label>

                                <select
                                    v-model="settings.wrap"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-[#172033] dark:text-slate-200 dark:focus:border-cyan-600 dark:focus:ring-cyan-950">

                                    <option value="nowrap">nowrap</option>
                                    <option value="wrap">wrap</option>
                                    <option value="wrap-reverse">wrap-reverse</option>

                                </select>

                            </div>

                            <!-- Justify -->
                            <div>

                                <label
                                    class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                                    Justify Content

                                </label>

                                <select
                                    v-model="settings.justify"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-[#172033] dark:text-slate-200 dark:focus:border-cyan-600 dark:focus:ring-cyan-950">

                                    <option value="flex-start">flex-start</option>
                                    <option value="center">center</option>
                                    <option value="flex-end">flex-end</option>
                                    <option value="space-between">space-between</option>
                                    <option value="space-around">space-around</option>
                                    <option value="space-evenly">space-evenly</option>

                                </select>

                            </div>

                            <!-- Align -->
                            <div>

                                <label
                                    class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                                    Align Items

                                </label>

                                <select
                                    v-model="settings.align"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-[#172033] dark:text-slate-200 dark:focus:border-cyan-600 dark:focus:ring-cyan-950">

                                    <option value="stretch">stretch</option>
                                    <option value="flex-start">flex-start</option>
                                    <option value="center">center</option>
                                    <option value="flex-end">flex-end</option>
                                    <option value="baseline">baseline</option>

                                </select>

                            </div>

                            <!-- Align Content -->
                            <div>

                                <label
                                    class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                                    Align Content

                                </label>

                                <select
                                    v-model="settings.alignContent"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-[#172033] dark:text-slate-200 dark:focus:border-cyan-600 dark:focus:ring-cyan-950">

                                    <option value="normal">normal</option>
                                    <option value="flex-start">flex-start</option>
                                    <option value="center">center</option>
                                    <option value="flex-end">flex-end</option>
                                    <option value="space-between">space-between</option>
                                    <option value="space-around">space-around</option>
                                    <option value="stretch">stretch</option>

                                </select>

                            </div>

                            <!-- Gap -->
                            <div>

                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                                    <span>Gap</span>

                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                        {{ settings.gap }}px
                                    </span>

                                </label>

                                <input
                                    v-model.number="settings.gap"
                                    type="range"
                                    min="0"
                                    max="100"
                                    class="w-full accent-cyan-500" />

                            </div>

                            <!-- Row Gap -->
                            <div>

                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                                    <span>Row Gap</span>

                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                        {{ settings.rowGap }}px
                                    </span>

                                </label>

                                <input
                                    v-model.number="settings.rowGap"
                                    type="range"
                                    min="0"
                                    max="100"
                                    class="w-full accent-cyan-500" />

                            </div>

                            <!-- Column Gap -->
                            <div>

                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                                    <span>Column Gap</span>

                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                        {{ settings.columnGap }}px
                                    </span>

                                </label>

                                <input
                                    v-model.number="settings.columnGap"
                                    type="range"
                                    min="0"
                                    max="100"
                                    class="w-full accent-cyan-500" />

                            </div>

                        </div>
                    </div>

                    <!-- Style -->
                    <div
                        v-else-if="activeTab === 'style'"
                        class="p-5">

                        <div class="mb-5 flex items-center gap-3">

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">

                                <Palette class="h-5 w-5" />

                            </div>

                            <div>

                                <h2
                                    class="text-sm font-semibold text-[#10233f] dark:text-slate-100">

                                    Item Styling

                                </h2>

                                <p class="text-xs text-slate-500 dark:text-slate-400">
                                    Customize Flexbox items
                                </p>

                            </div>

                        </div>

                        <div
                            class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">

                            <div
                                class="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-[#172033]">

                                <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                    Custom CSS
                                </p>

                                <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                    Styles are applied to the preview items.
                                </p>

                            </div>

                            <textarea
                                v-model="customCss"
                                spellcheck="false"
                                class="min-h-[430px] w-full resize-y bg-[#101827] p-4 font-mono text-xs leading-6 text-slate-200 outline-none dark:bg-[#0b1220]"></textarea>

                        </div>

                        <button
                            type="button"
                            @click="copyText(customCss, 'custom')"
                            class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-slate-700 dark:bg-[#172033] dark:text-slate-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400">

                            <Check
                                v-if="copied === 'custom'"
                                class="h-4 w-4 text-emerald-500" />

                            <Copy
                                v-else
                                class="h-4 w-4" />

                            {{ copied === 'custom' ? 'Copied' : 'Copy Custom CSS' }}

                        </button>

                    </div>

                    <!-- CSS -->
                    <div
                        v-else-if="activeTab === 'css'"
                        class="p-5">

                        <div class="mb-5 flex items-center gap-3">

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">

                                <Code2 class="h-5 w-5" />

                            </div>

                            <div>

                                <h2
                                    class="text-sm font-semibold text-[#10233f] dark:text-slate-100">

                                    Generated CSS

                                </h2>

                                <p class="text-xs text-slate-500 dark:text-slate-400">
                                    Based on your layout
                                </p>

                            </div>

                        </div>

                        <div
                            class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">

                            <pre
                                class="max-h-[500px] overflow-auto bg-[#101827] p-4 text-xs leading-6 text-slate-200 dark:bg-[#0b1220]"><code>{{ generatedCss }}</code></pre>

                        </div>

                        <button
                            type="button"
                            @click="copyText(generatedCss, 'css')"
                            class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#17447f] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#123968] dark:bg-cyan-700 dark:hover:bg-cyan-600">

                            <Check
                                v-if="copied === 'css'"
                                class="h-4 w-4" />

                            <Copy
                                v-else
                                class="h-4 w-4" />

                            {{ copied === 'css' ? 'Copied' : 'Copy CSS' }}

                        </button>

                    </div>

                    <!-- HTML -->
                    <div
                        v-else
                        class="p-5">

                        <div class="mb-5 flex items-center gap-3">

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">

                                <FileCode2 class="h-5 w-5" />

                            </div>

                            <div>

                                <h2
                                    class="text-sm font-semibold text-[#10233f] dark:text-slate-100">

                                    HTML Structure

                                </h2>

                                <p class="text-xs text-slate-500 dark:text-slate-400">
                                    Customize your Flexbox items
                                </p>

                            </div>

                        </div>

                        <textarea
                            v-model="htmlCode"
                            spellcheck="false"
                            class="min-h-[430px] w-full resize-y rounded-xl border border-slate-200 bg-[#101827] p-4 font-mono text-xs leading-6 text-slate-200 outline-none focus:border-cyan-400 dark:border-slate-700 dark:bg-[#0b1220]"></textarea>

                        <button
                            type="button"
                            @click="copyText(generatedHtml, 'html')"
                            class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-slate-700 dark:bg-[#172033] dark:text-slate-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400">

                            <Check
                                v-if="copied === 'html'"
                                class="h-4 w-4 text-emerald-500" />

                            <Copy
                                v-else
                                class="h-4 w-4" />

                            {{ copied === 'html' ? 'Copied' : 'Copy HTML' }}

                        </button>

                    </div>

                </aside>

                <!-- Preview -->
                <div class="min-w-0 space-y-6">

                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-[#111827]">

                        <!-- Preview Header -->
                        <div
                            class="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">

                                    <LayoutGrid class="h-5 w-5" />

                                </div>

                                <div>

                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-slate-100">

                                        Flexbox Editor

                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-slate-400">
                                        {{ settings.direction }} · {{ settings.wrap }}
                                    </p>

                                </div>

                            </div>

                            <div class="flex items-center gap-2">

                                <span
                                    class="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400">

                                    {{ previewItems.length }} items

                                </span>

                                <span
                                    class="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">

                                    <span
                                        class="h-1.5 w-1.5 rounded-full bg-emerald-500">
                                    </span>

                                    Live

                                </span>

                            </div>

                        </div>

                        <!-- Preview Body -->
                        <div
                            class="border-b border-slate-200 bg-[#f8fafc] p-6 sm:p-10 dark:border-slate-800 dark:bg-[#0f172a]">

                            <div
                                class="mb-5 rounded-xl border border-cyan-200 bg-cyan-50/70 px-4 py-3 dark:border-cyan-900/60 dark:bg-cyan-950/30">

                                <div class="flex items-start gap-3">

                                    <SlidersHorizontal
                                        class="mt-0.5 h-4 w-4 shrink-0 text-[#167fa8] dark:text-cyan-400" />

                                    <div>

                                        <p
                                            class="text-xs font-semibold text-[#167fa8] dark:text-cyan-400">

                                            Visual Flexbox editor

                                        </p>

                                        <p
                                            class="mt-1 text-xs leading-5 text-[#2b6b86] dark:text-slate-400">

                                            Change the layout controls to see your
                                            Flexbox structure update instantly.

                                        </p>

                                    </div>

                                </div>

                            </div>

                            <!-- Canvas -->
                            <div
                                class="rounded-xl border border-dashed border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-[#111827]">

                                <div
                                    class="min-h-[430px] w-full rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#0b1220]"
                                    style="background-image: radial-gradient(#d7dde5 1px, transparent 1px); background-size: 20px 20px;">

                                    <div
                                        class="min-h-[380px] w-full overflow-auto rounded-lg border border-slate-200 bg-white/90 p-6 dark:border-slate-700 dark:bg-[#151f31]">

                                        <div
                                            class="min-h-[330px] w-full"
                                            :style="previewStyle">

                                            <div
                                                v-for="(item, index) in previewItems"
                                                :key="index"
                                                class="flex min-h-[72px] min-w-[72px] items-center justify-center px-5 py-4 text-sm font-semibold shadow-sm"
                                                :class="[
                                                    'flex-item',
                                                    'rounded-lg',
                                                ]"
                                                v-html="item">
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <!-- Properties -->
                        <div
                            class="grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-800 sm:grid-cols-4">

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">

                                    Direction

                                </p>

                                <p
                                    class="mt-1 truncate font-mono text-xs font-semibold text-[#10233f] dark:text-slate-200">

                                    {{ settings.direction }}

                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">

                                    Wrap

                                </p>

                                <p
                                    class="mt-1 truncate font-mono text-xs font-semibold text-[#10233f] dark:text-slate-200">

                                    {{ settings.wrap }}

                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">

                                    Justify

                                </p>

                                <p
                                    class="mt-1 truncate font-mono text-xs font-semibold text-[#10233f] dark:text-slate-200">

                                    {{ settings.justify }}

                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">

                                    Align

                                </p>

                                <p
                                    class="mt-1 truncate font-mono text-xs font-semibold text-[#10233f] dark:text-slate-200">

                                    {{ settings.align }}

                                </p>

                            </div>

                        </div>

                    </section>

                    <!-- Generated HTML -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111827]">

                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">

                                    <Code2 class="h-4 w-4" />

                                </div>

                                <div>

                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-slate-100">

                                        Generated HTML

                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-slate-400">

                                        HTML structure generated from your editor.

                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                @click="copyText(generatedHtml, 'html-code')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-slate-700 dark:text-slate-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400">

                                <Check
                                    v-if="copied === 'html-code'"
                                    class="h-3.5 w-3.5 text-emerald-500" />

                                <Copy
                                    v-else
                                    class="h-3.5 w-3.5" />

                                {{ copied === 'html-code' ? 'Copied' : 'Copy HTML' }}

                            </button>

                        </div>

                        <pre
                            class="max-h-[400px] overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200 dark:bg-[#0b1220]"><code>{{ generatedHtml }}</code></pre>

                    </section>

                    <!-- Generated CSS -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111827]">

                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">

                                    <Code2 class="h-4 w-4" />

                                </div>

                                <div>

                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-slate-100">

                                        Generated CSS

                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-slate-400">

                                        CSS generated from your Flexbox settings.

                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                @click="copyText(generatedCss, 'generated-css')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-slate-700 dark:text-slate-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400">

                                <Check
                                    v-if="copied === 'generated-css'"
                                    class="h-3.5 w-3.5 text-emerald-500" />

                                <Copy
                                    v-else
                                    class="h-3.5 w-3.5" />

                                {{ copied === 'generated-css' ? 'Copied' : 'Copy CSS' }}

                            </button>

                        </div>

                        <pre
                            class="max-h-[400px] overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200 dark:bg-[#0b1220]"><code>{{ generatedCss }}</code></pre>

                    </section>

                    <!-- Complete Code -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111827]">

                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400">

                                    <FileCode2 class="h-4 w-4" />

                                </div>

                                <div>

                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-slate-100">

                                        Complete Code

                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-slate-400">

                                        Ready-to-use HTML and CSS.

                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                @click="copyText(completeCode, 'complete')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#17447f] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#123968] dark:bg-cyan-700 dark:hover:bg-cyan-600">

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
                            class="max-h-[500px] overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200 dark:bg-[#0b1220]"><code>{{ completeCode }}</code></pre>

                    </section>

                </div>

            </div>

        </section>

    </main>
</template>

<style scoped>
.flex-item {
    padding: 20px;
    background: #17447f;
    color: white;
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
}
</style>
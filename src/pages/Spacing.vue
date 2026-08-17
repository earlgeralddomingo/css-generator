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
    marginTop: 24,
    marginRight: 24,
    marginBottom: 24,
    marginLeft: 24,
    paddingTop: 24,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    gap: 16,
    width: 320,
    height: 180,
    borderRadius: 16,
    previewText: 'CSSCraft Spacing',
})

const defaultSettings = {
    marginTop: 24,
    marginRight: 24,
    marginBottom: 24,
    marginLeft: 24,
    paddingTop: 24,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    gap: 16,
    width: 320,
    height: 180,
    borderRadius: 16,
    previewText: 'CSSCraft Spacing',
}

const generatedCss = computed(() => {
    const s = settings.value

    return `.spacing-box {
    width: ${s.width}px;
    height: ${s.height}px;
    margin: ${s.marginTop}px ${s.marginRight}px ${s.marginBottom}px ${s.marginLeft}px;
    padding: ${s.paddingTop}px ${s.paddingRight}px ${s.paddingBottom}px ${s.paddingLeft}px;
    gap: ${s.gap}px;
    border-radius: ${s.borderRadius}px;
}`
})

const generatedHtml = computed(() => {
    return `<div class="spacing-box">
    ${settings.value.previewText}
</div>`
})

const previewStyle = computed(() => {
    const s = settings.value

    return {
        width: `${s.width}px`,
        height: `${s.height}px`,
        marginTop: `${s.marginTop}px`,
        marginRight: `${s.marginRight}px`,
        marginBottom: `${s.marginBottom}px`,
        marginLeft: `${s.marginLeft}px`,
        paddingTop: `${s.paddingTop}px`,
        paddingRight: `${s.paddingRight}px`,
        paddingBottom: `${s.paddingBottom}px`,
        paddingLeft: `${s.paddingLeft}px`,
        gap: `${s.gap}px`,
        borderRadius: `${s.borderRadius}px`,
    }
})

const completeCode = computed(() => {
    const s = settings.value

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSSCraft Spacing</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            padding: 40px;
            background: #f8fafc;
            color: #10233f;
            font-family: Arial, sans-serif;
        }

        .spacing-box {
            width: ${s.width}px;
            height: ${s.height}px;
            margin: ${s.marginTop}px ${s.marginRight}px ${s.marginBottom}px ${s.marginLeft}px;
            padding: ${s.paddingTop}px ${s.paddingRight}px ${s.paddingBottom}px ${s.paddingLeft}px;
            gap: ${s.gap}px;
            border-radius: ${s.borderRadius}px;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
    </style>
</head>

<body>

    <div class="spacing-box">
        ${s.previewText}
    </div>

</body>
</html>`
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
    link.download = 'spacing-generator.html'

    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
}
</script>

<template>
    <main
        class="min-h-screen bg-[#f8fafc] text-[#10233f] transition-colors dark:bg-gray-950 dark:text-gray-100">

        <!-- Header -->
        <section
            class="border-b border-slate-200 bg-white transition-colors dark:border-gray-800 dark:bg-gray-900">

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
                            class="text-3xl font-bold tracking-tight text-[#10233f] dark:text-gray-100 sm:text-4xl">

                            Spacing Generator

                        </h1>

                        <p
                            class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-gray-400">

                            Customize margin, padding, gap, dimensions and
                            border radius while generating clean CSS instantly.

                        </p>

                    </div>

                    <div class="flex flex-wrap gap-3">

                        <button
                            type="button"
                            @click="reset"
                            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">

                            <RotateCcw class="h-4 w-4" />

                            Reset

                        </button>

                        <button
                            type="button"
                            @click="exportHtml"
                            class="inline-flex items-center gap-2 rounded-xl bg-[#17447f] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#123968] dark:bg-cyan-700 dark:hover:bg-cyan-600">

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
                    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">

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

                                <Square class="h-5 w-5" />

                            </div>

                            <div>

                                <h2
                                    class="text-sm font-semibold text-[#10233f] dark:text-gray-100">

                                    Spacing Settings

                                </h2>

                                <p
                                    class="text-xs text-slate-500 dark:text-gray-400">

                                    Customize your spacing

                                </p>

                            </div>

                        </div>

                        <!-- Preview Text -->
                        <div>

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Preview Text

                            </label>

                            <textarea
                                v-model="settings.previewText"
                                rows="3"
                                class="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus:border-cyan-600 dark:focus:ring-cyan-900/30"
                                placeholder="Enter preview text..." />

                        </div>

                        <!-- Dimensions -->
                        <div class="mt-6">

                            <p
                                class="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Dimensions

                            </p>

                            <!-- Width -->
                            <label
                                class="mb-2 flex justify-between text-[11px] font-medium text-slate-500 dark:text-gray-400">

                                <span>Width</span>

                                <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                    {{ settings.width }}px
                                </span>

                            </label>

                            <input
                                v-model.number="settings.width"
                                type="range"
                                min="80"
                                max="700"
                                class="w-full accent-cyan-500" />

                            <!-- Height -->
                            <label
                                class="mb-2 mt-5 flex justify-between text-[11px] font-medium text-slate-500 dark:text-gray-400">

                                <span>Height</span>

                                <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                    {{ settings.height }}px
                                </span>

                            </label>

                            <input
                                v-model.number="settings.height"
                                type="range"
                                min="60"
                                max="500"
                                class="w-full accent-cyan-500" />

                        </div>

                        <!-- Margin -->
                        <div class="mt-7">

                            <p
                                class="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Margin

                            </p>

                            <div class="grid grid-cols-2 gap-3">

                                <div>
                                    <label
                                        class="mb-1.5 block text-[10px] font-medium text-slate-500 dark:text-gray-400">
                                        Top
                                    </label>

                                    <input
                                        v-model.number="settings.marginTop"
                                        type="number"
                                        min="0"
                                        max="100"
                                        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-600" />
                                </div>

                                <div>
                                    <label
                                        class="mb-1.5 block text-[10px] font-medium text-slate-500 dark:text-gray-400">
                                        Right
                                    </label>

                                    <input
                                        v-model.number="settings.marginRight"
                                        type="number"
                                        min="0"
                                        max="100"
                                        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-600" />
                                </div>

                                <div>
                                    <label
                                        class="mb-1.5 block text-[10px] font-medium text-slate-500 dark:text-gray-400">
                                        Bottom
                                    </label>

                                    <input
                                        v-model.number="settings.marginBottom"
                                        type="number"
                                        min="0"
                                        max="100"
                                        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-600" />
                                </div>

                                <div>
                                    <label
                                        class="mb-1.5 block text-[10px] font-medium text-slate-500 dark:text-gray-400">
                                        Left
                                    </label>

                                    <input
                                        v-model.number="settings.marginLeft"
                                        type="number"
                                        min="0"
                                        max="100"
                                        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-600" />
                                </div>

                            </div>

                        </div>

                        <!-- Padding -->
                        <div class="mt-7">

                            <p
                                class="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Padding

                            </p>

                            <div class="grid grid-cols-2 gap-3">

                                <div>
                                    <label
                                        class="mb-1.5 block text-[10px] font-medium text-slate-500 dark:text-gray-400">
                                        Top
                                    </label>

                                    <input
                                        v-model.number="settings.paddingTop"
                                        type="number"
                                        min="0"
                                        max="100"
                                        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-600" />
                                </div>

                                <div>
                                    <label
                                        class="mb-1.5 block text-[10px] font-medium text-slate-500 dark:text-gray-400">
                                        Right
                                    </label>

                                    <input
                                        v-model.number="settings.paddingRight"
                                        type="number"
                                        min="0"
                                        max="100"
                                        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-600" />
                                </div>

                                <div>
                                    <label
                                        class="mb-1.5 block text-[10px] font-medium text-slate-500 dark:text-gray-400">
                                        Bottom
                                    </label>

                                    <input
                                        v-model.number="settings.paddingBottom"
                                        type="number"
                                        min="0"
                                        max="100"
                                        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-600" />
                                </div>

                                <div>
                                    <label
                                        class="mb-1.5 block text-[10px] font-medium text-slate-500 dark:text-gray-400">
                                        Left
                                    </label>

                                    <input
                                        v-model.number="settings.paddingLeft"
                                        type="number"
                                        min="0"
                                        max="100"
                                        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-600" />
                                </div>

                            </div>

                        </div>

                        <!-- Gap -->
                        <div class="mt-7">

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
                                max="100"
                                class="w-full accent-cyan-500" />

                        </div>

                        <!-- Border Radius -->
                        <div class="mt-7">

                            <label
                                class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                <span>Border Radius</span>

                                <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                    {{ settings.borderRadius }}px
                                </span>

                            </label>

                            <input
                                v-model.number="settings.borderRadius"
                                type="range"
                                min="0"
                                max="80"
                                class="w-full accent-cyan-500" />

                        </div>

                        <!-- Current -->
                        <div
                            class="mt-7 rounded-xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-900/60 dark:bg-cyan-950/30">

                            <p
                                class="text-[10px] font-semibold uppercase tracking-wider text-[#167fa8] dark:text-cyan-400">

                                Current Spacing

                            </p>

                            <p
                                class="mt-2 text-xs leading-5 text-[#2b6b86] dark:text-cyan-300/80">

                                {{ settings.width }} × {{ settings.height }}px ·
                                {{ settings.gap }}px gap ·
                                {{ settings.borderRadius }}px radius

                            </p>

                        </div>

                    </div>

                    <!-- CSS -->
                    <div
                        v-else
                        class="p-5">

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

                                <p
                                    class="text-xs text-slate-500 dark:text-gray-400">

                                    Based on your spacing settings

                                </p>

                            </div>

                        </div>

                        <pre
                            class="overflow-auto rounded-xl bg-[#101827] p-4 text-xs leading-6 text-slate-200"><code>{{ generatedCss }}</code></pre>

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

                </aside>

                <!-- Main -->
                <div class="min-w-0 space-y-6">

                    <!-- Preview -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">

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

                                        Spacing Editor

                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400">

                                        Live spacing preview

                                    </p>

                                </div>

                            </div>

                            <div class="flex items-center gap-2">

                                <span
                                    class="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400">

                                    Spacing

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
                            class="border-b border-slate-200 bg-[#f8fafc] p-6 dark:border-gray-800 dark:bg-gray-950 sm:p-10">

                            <div
                                class="mb-5 rounded-xl border border-cyan-200 bg-cyan-50/70 px-4 py-3 dark:border-cyan-900/60 dark:bg-cyan-950/30">

                                <div class="flex items-start gap-3">

                                    <SlidersHorizontal
                                        class="mt-0.5 h-4 w-4 shrink-0 text-[#167fa8] dark:text-cyan-400" />

                                    <div>

                                        <p
                                            class="text-xs font-semibold text-[#167fa8] dark:text-cyan-400">

                                            Visual Spacing Editor

                                        </p>

                                        <p
                                            class="mt-1 text-xs leading-5 text-[#2b6b86] dark:text-cyan-300/80">

                                            Adjust margin, padding, gap and
                                            dimensions to see the result update
                                            instantly.

                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div
                                class="overflow-auto rounded-xl border border-dashed border-slate-300 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">

                                <div
                                    class="flex min-h-[430px] min-w-[650px] items-center justify-center overflow-auto rounded-lg border border-slate-200 bg-slate-50 dark:border-gray-700 dark:bg-gray-950">

                                    <div
                                        class="relative flex items-center justify-center border-2 border-dashed border-cyan-300 bg-cyan-50/40 transition-all duration-200 dark:border-cyan-700 dark:bg-cyan-950/20"
                                        :style="previewStyle">

                                        <div
                                            class="flex h-full w-full items-center justify-center border border-cyan-400 bg-white text-center text-sm font-medium text-[#17447f] shadow-sm dark:border-cyan-600 dark:bg-gray-800 dark:text-cyan-300">

                                            {{ settings.previewText }}

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
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">

                                    Size

                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200">

                                    {{ settings.width }} × {{ settings.height }}

                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">

                                    Margin

                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200">

                                    {{ settings.marginTop }}px

                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">

                                    Padding

                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200">

                                    {{ settings.paddingTop }}px

                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">

                                    Status

                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">

                                    Active

                                </p>

                            </div>

                        </div>

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

                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-gray-100">

                                        Generated CSS

                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400">

                                        CSS generated from your spacing settings.

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
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">

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

                                        HTML structure for your spacing element.

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
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">

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
                            class="max-h-[500px] overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"><code>{{ completeCode }}</code></pre>

                    </section>

                </div>

            </div>

        </section>

    </main>
</template>
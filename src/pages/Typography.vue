<script setup>
import { computed, ref } from 'vue'
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Check,
    Code2,
    Copy,
    Download,
    FileCode2,
    RotateCcw,
    SlidersHorizontal,
    Sparkles,
    Type,
} from 'lucide-vue-next'

const copied = ref('')
const activeTab = ref('controls')

const settings = ref({
    text: 'CSSCraft Typography',
    fontFamily: 'Inter',
    fontSize: 48,
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: 0,
    textAlign: 'left',
    textTransform: 'none',
    textDecoration: 'none',
    fontStyle: 'normal',
    color: '#17447f',
})

const defaultSettings = {
    text: 'CSSCraft Typography',
    fontFamily: 'Inter',
    fontSize: 48,
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: 0,
    textAlign: 'left',
    textTransform: 'none',
    textDecoration: 'none',
    fontStyle: 'normal',
    color: '#17447f',
}

const fonts = [
    'Inter',
    'Arial',
    'Helvetica',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    'Georgia',
    'Times New Roman',
    'Garamond',
    'Courier New',
    'Lucida Console',
    'Impact',
    'Comic Sans MS',
    'Palatino Linotype',
    'Segoe UI',
    'Roboto',
    'Poppins',
    'Montserrat',
    'Open Sans',
    'Lato',
    'Nunito',
    'Raleway',
    'Oswald',
    'Merriweather',
    'Playfair Display',
]

const fontStacks = {
    Inter: "'Inter', sans-serif",
    Arial: "Arial, sans-serif",
    Helvetica: "Helvetica, Arial, sans-serif",
    Verdana: "Verdana, sans-serif",
    Tahoma: "Tahoma, sans-serif",
    'Trebuchet MS': "'Trebuchet MS', sans-serif",
    Georgia: "Georgia, serif",
    'Times New Roman': "'Times New Roman', serif",
    Garamond: "Garamond, serif",
    'Courier New': "'Courier New', monospace",
    'Lucida Console': "'Lucida Console', monospace",
    Impact: "Impact, sans-serif",
    'Comic Sans MS': "'Comic Sans MS', cursive",
    'Palatino Linotype': "'Palatino Linotype', serif",
    'Segoe UI': "'Segoe UI', sans-serif",
    Roboto: "'Roboto', sans-serif",
    Poppins: "'Poppins', sans-serif",
    Montserrat: "'Montserrat', sans-serif",
    'Open Sans': "'Open Sans', sans-serif",
    Lato: "'Lato', sans-serif",
    Nunito: "'Nunito', sans-serif",
    Raleway: "'Raleway', sans-serif",
    Oswald: "'Oswald', sans-serif",
    Merriweather: "'Merriweather', serif",
    'Playfair Display': "'Playfair Display', serif",
}

const previewStyle = computed(() => ({
    fontFamily: fontStacks[settings.value.fontFamily],
    fontSize: `${settings.value.fontSize}px`,
    fontWeight: settings.value.fontWeight,
    lineHeight: settings.value.lineHeight,
    letterSpacing: `${settings.value.letterSpacing}px`,
    textAlign: settings.value.textAlign,
    textTransform: settings.value.textTransform,
    textDecoration: settings.value.textDecoration,
    fontStyle: settings.value.fontStyle,
    color: settings.value.color,
}))

const generatedCss = computed(() => {
    const s = settings.value

    return `.typography-text {
    font-family: ${fontStacks[s.fontFamily]};
    font-size: ${s.fontSize}px;
    font-weight: ${s.fontWeight};
    line-height: ${s.lineHeight};
    letter-spacing: ${s.letterSpacing}px;
    text-align: ${s.textAlign};
    text-transform: ${s.textTransform};
    text-decoration: ${s.textDecoration};
    font-style: ${s.fontStyle};
    color: ${s.color};
}`
})

const generatedHtml = computed(() => {
    return `<p class="typography-text">
    ${settings.value.text}
</p>`
})

const completeCode = computed(() => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSSCraft Typography</title>
</head>
<body>

${generatedHtml.value}

<style>
.typography-text {
    font-family: ${fontStacks[settings.value.fontFamily]};
    font-size: ${settings.value.fontSize}px;
    font-weight: ${settings.value.fontWeight};
    line-height: ${settings.value.lineHeight};
    letter-spacing: ${settings.value.letterSpacing}px;
    text-align: ${settings.value.textAlign};
    text-transform: ${settings.value.textTransform};
    text-decoration: ${settings.value.textDecoration};
    font-style: ${settings.value.fontStyle};
    color: ${settings.value.color};
    margin: 0;
}
</style>

</body>
</html>`
})

const fontLabel = computed(() => settings.value.fontFamily)

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
    link.download = 'typography-generator.html'

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

                <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <div
                            class="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#167fa8] dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-400">

                            <Sparkles class="h-3.5 w-3.5" />

                            CSS Builder

                        </div>

                        <h1
                            class="text-3xl font-bold tracking-tight text-[#10233f] sm:text-4xl dark:text-gray-100">

                            Typography Generator

                        </h1>

                        <p
                            class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-gray-400">

                            Customize fonts, sizing, spacing, alignment and text
                            styles while generating clean CSS instantly.

                        </p>

                    </div>

                    <div class="flex flex-wrap gap-3">

                        <button
                            type="button"
                            @click="reset"
                            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800">

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
                    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">

                    <!-- Tabs -->
                    <div class="grid grid-cols-2 border-b border-slate-200 dark:border-gray-800">

                        <button
                            type="button"
                            @click="activeTab = 'controls'"
                            :class="[
                                'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                                activeTab === 'controls'
                                    ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8] dark:bg-cyan-950/30 dark:text-cyan-400'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
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
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                            ]">

                            <Code2 class="h-3.5 w-3.5" />

                            CSS

                        </button>

                    </div>

                    <!-- Controls -->
                    <div v-if="activeTab === 'controls'" class="p-5">

                        <div class="mb-6 flex items-center gap-3">

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400">

                                <Type class="h-5 w-5" />

                            </div>

                            <div>

                                <h2 class="text-sm font-semibold text-[#10233f] dark:text-gray-100">
                                    Typography Settings
                                </h2>

                                <p class="text-xs text-slate-500 dark:text-gray-400">
                                    Customize your text
                                </p>

                            </div>

                        </div>

                        <!-- Text -->
                        <div>

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Preview Text

                            </label>

                            <textarea
                                v-model="settings.text"
                                rows="3"
                                class="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus:border-cyan-500 dark:focus:ring-cyan-950"
                                placeholder="Enter your text..." />

                        </div>

                        <!-- Font -->
                        <div class="mt-5">

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Font Family

                            </label>

                            <select
                                v-model="settings.fontFamily"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-950">

                                <option
                                    v-for="font in fonts"
                                    :key="font"
                                    :value="font">

                                    {{ font }}

                                </option>

                            </select>

                        </div>

                        <!-- Font Size -->
                        <div class="mt-6">

                            <label
                                class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                <span>Font Size</span>

                                <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                    {{ settings.fontSize }}px
                                </span>

                            </label>

                            <input
                                v-model.number="settings.fontSize"
                                type="range"
                                min="10"
                                max="120"
                                class="w-full accent-cyan-500" />

                        </div>

                        <!-- Weight -->
                        <div class="mt-6">

                            <label
                                class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                <span>Font Weight</span>

                                <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                    {{ settings.fontWeight }}
                                </span>

                            </label>

                            <select
                                v-model.number="settings.fontWeight"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-950">

                                <option :value="100">100 — Thin</option>
                                <option :value="200">200 — Extra Light</option>
                                <option :value="300">300 — Light</option>
                                <option :value="400">400 — Regular</option>
                                <option :value="500">500 — Medium</option>
                                <option :value="600">600 — Semi Bold</option>
                                <option :value="700">700 — Bold</option>
                                <option :value="800">800 — Extra Bold</option>
                                <option :value="900">900 — Black</option>

                            </select>

                        </div>

                        <!-- Line Height -->
                        <div class="mt-6">

                            <label
                                class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                <span>Line Height</span>

                                <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                    {{ settings.lineHeight }}
                                </span>

                            </label>

                            <input
                                v-model.number="settings.lineHeight"
                                type="range"
                                min="0.8"
                                max="2.5"
                                step="0.1"
                                class="w-full accent-cyan-500" />

                        </div>

                        <!-- Letter Spacing -->
                        <div class="mt-6">

                            <label
                                class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                <span>Letter Spacing</span>

                                <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                    {{ settings.letterSpacing }}px
                                </span>

                            </label>

                            <input
                                v-model.number="settings.letterSpacing"
                                type="range"
                                min="-5"
                                max="20"
                                step="0.5"
                                class="w-full accent-cyan-500" />

                        </div>

                        <!-- Alignment -->
                        <div class="mt-6">

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Text Alignment

                            </label>

                            <div class="grid grid-cols-3 gap-2">

                                <button
                                    type="button"
                                    @click="settings.textAlign = 'left'"
                                    :class="[
                                        'flex items-center justify-center rounded-lg border p-2.5 transition',
                                        settings.textAlign === 'left'
                                            ? 'border-cyan-400 bg-cyan-50 text-[#167fa8] dark:border-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400'
                                            : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                                    ]">

                                    <AlignLeft class="h-4 w-4" />

                                </button>

                                <button
                                    type="button"
                                    @click="settings.textAlign = 'center'"
                                    :class="[
                                        'flex items-center justify-center rounded-lg border p-2.5 transition',
                                        settings.textAlign === 'center'
                                            ? 'border-cyan-400 bg-cyan-50 text-[#167fa8] dark:border-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400'
                                            : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                                    ]">

                                    <AlignCenter class="h-4 w-4" />

                                </button>

                                <button
                                    type="button"
                                    @click="settings.textAlign = 'right'"
                                    :class="[
                                        'flex items-center justify-center rounded-lg border p-2.5 transition',
                                        settings.textAlign === 'right'
                                            ? 'border-cyan-400 bg-cyan-50 text-[#167fa8] dark:border-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400'
                                            : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                                    ]">

                                    <AlignRight class="h-4 w-4" />

                                </button>

                            </div>

                        </div>

                        <!-- Transform -->
                        <div class="mt-6">

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Text Transform

                            </label>

                            <select
                                v-model="settings.textTransform"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-950">

                                <option value="none">None</option>
                                <option value="uppercase">UPPERCASE</option>
                                <option value="lowercase">lowercase</option>
                                <option value="capitalize">Capitalize</option>

                            </select>

                        </div>

                        <!-- Decoration -->
                        <div class="mt-6">

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Text Decoration

                            </label>

                            <select
                                v-model="settings.textDecoration"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-950">

                                <option value="none">None</option>
                                <option value="underline">Underline</option>
                                <option value="line-through">Line Through</option>
                                <option value="overline">Overline</option>

                            </select>

                        </div>

                        <!-- Style -->
                        <div class="mt-6">

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Font Style

                            </label>

                            <div class="grid grid-cols-2 gap-2">

                                <button
                                    type="button"
                                    @click="settings.fontStyle = 'normal'"
                                    :class="[
                                        'rounded-lg border px-3 py-2.5 text-xs font-medium transition',
                                        settings.fontStyle === 'normal'
                                            ? 'border-cyan-400 bg-cyan-50 text-[#167fa8] dark:border-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400'
                                            : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                                    ]">

                                    Normal

                                </button>

                                <button
                                    type="button"
                                    @click="settings.fontStyle = 'italic'"
                                    :class="[
                                        'rounded-lg border px-3 py-2.5 text-xs font-medium italic transition',
                                        settings.fontStyle === 'italic'
                                            ? 'border-cyan-400 bg-cyan-50 text-[#167fa8] dark:border-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400'
                                            : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                                    ]">

                                    Italic

                                </button>

                            </div>

                        </div>

                        <!-- Color -->
                        <div class="mt-6">

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Text Color

                            </label>

                            <div class="flex gap-2">

                                <input
                                    v-model="settings.color"
                                    type="color"
                                    class="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800" />

                                <input
                                    v-model="settings.color"
                                    type="text"
                                    class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-mono text-slate-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-950" />

                            </div>

                        </div>

                        <!-- Current Settings -->
                        <div
                            class="mt-6 rounded-xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-900/60 dark:bg-cyan-950/30">

                            <p class="text-[10px] font-semibold uppercase tracking-wider text-[#167fa8] dark:text-cyan-400">
                                Typography
                            </p>

                            <p class="mt-1 text-xs leading-5 text-[#2b6b86] dark:text-cyan-200/70">
                                {{ fontLabel }} · {{ settings.fontSize }}px ·
                                {{ settings.fontWeight }}
                            </p>

                        </div>

                    </div>

                    <!-- CSS Tab -->
                    <div v-else class="p-5">

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
                                    Based on your typography settings
                                </p>

                            </div>

                        </div>

                        <pre
                            class="overflow-auto rounded-xl bg-[#101827] p-4 text-xs leading-6 text-slate-200"><code>{{ generatedCss }}</code></pre>

                        <button
                            type="button"
                            @click="copyText(generatedCss, 'css')"
                            class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#17447f] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#123968]">

                            <Check v-if="copied === 'css'" class="h-4 w-4" />

                            <Copy v-else class="h-4 w-4" />

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

                                    <Type class="h-5 w-5" />

                                </div>

                                <div>

                                    <h2 class="text-sm font-semibold text-[#10233f] dark:text-gray-100">
                                        Typography Editor
                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-gray-400">
                                        {{ fontLabel }}
                                    </p>

                                </div>

                            </div>

                            <div class="flex items-center gap-2">

                                <span
                                    class="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400">

                                    Typography

                                </span>

                                <span
                                    class="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">

                                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>

                                    Live

                                </span>

                            </div>

                        </div>

                        <!-- Preview Area -->
                        <div
                            class="border-b border-slate-200 bg-[#f8fafc] p-6 sm:p-10 dark:border-gray-800 dark:bg-gray-950">

                            <div
                                class="mb-5 rounded-xl border border-cyan-200 bg-cyan-50/70 px-4 py-3 dark:border-cyan-900/60 dark:bg-cyan-950/30">

                                <div class="flex items-start gap-3">

                                    <SlidersHorizontal
                                        class="mt-0.5 h-4 w-4 shrink-0 text-[#167fa8] dark:text-cyan-400" />

                                    <div>

                                        <p class="text-xs font-semibold text-[#167fa8] dark:text-cyan-400">
                                            Visual Typography Editor
                                        </p>

                                        <p class="mt-1 text-xs leading-5 text-[#2b6b86] dark:text-cyan-200/70">
                                            Change the text and typography controls
                                            to see the result update instantly.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div
                                class="rounded-xl border border-dashed border-slate-300 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">

                                <div
                                    class="flex min-h-[430px] items-center justify-center overflow-auto rounded-lg border border-slate-200 bg-white p-8 sm:p-16 dark:border-gray-700 dark:bg-gray-950">

                                    <div
                                        class="w-full max-w-4xl break-words"
                                        :style="previewStyle">

                                        {{ settings.text || 'Type something...' }}

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

                                    Font

                                </p>

                                <p
                                    class="mt-1 truncate text-xs font-semibold text-[#10233f] dark:text-gray-200">

                                    {{ settings.fontFamily }}

                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">

                                    Size

                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200">

                                    {{ settings.fontSize }}px

                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">

                                    Weight

                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200">

                                    {{ settings.fontWeight }}

                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">

                                    Status

                                </p>

                                <p class="mt-1 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">

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

                                    <h2 class="text-sm font-semibold text-[#10233f] dark:text-gray-100">
                                        Generated CSS
                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-gray-400">
                                        CSS generated from your typography.
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

                                    <h2 class="text-sm font-semibold text-[#10233f] dark:text-gray-100">
                                        Generated HTML
                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-gray-400">
                                        HTML structure for your typography.
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

                                {{ copied === 'html' ? 'Copied' : 'Copy HTML' }}

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
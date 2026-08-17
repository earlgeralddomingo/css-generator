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
    Type,
} from 'lucide-vue-next'

const copied = ref('')
const activeTab = ref('controls')

const settings = ref({
    family: 'Inter',
    source: 'https://fonts.example.com/inter.woff2',
    format: 'woff2',
    weight: '400',
    style: 'normal',
    display: 'swap',
    previewText: 'The quick brown fox jumps over the lazy dog.',
    fontSize: 40,
    letterSpacing: 0,
    lineHeight: 1.3,
})

const defaultSettings = {
    family: 'Inter',
    source: 'https://fonts.example.com/inter.woff2',
    format: 'woff2',
    weight: '400',
    style: 'normal',
    display: 'swap',
    previewText: 'The quick brown fox jumps over the lazy dog.',
    fontSize: 40,
    letterSpacing: 0,
    lineHeight: 1.3,
}

const fontPresets = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Nunito',
    'Raleway',
    'Oswald',
    'Playfair Display',
    'Merriweather',
    'Roboto Slab',
    'Source Sans 3',
    'Work Sans',
    'DM Sans',
    'Manrope',
    'Space Grotesk',
    'Plus Jakarta Sans',
    'Fira Sans',
    'Ubuntu',
    'Arial',
    'Helvetica',
    'Georgia',
    'Times New Roman',
    'Courier New',
]

const fontWeights = [
    { value: '100', label: '100 — Thin' },
    { value: '200', label: '200 — Extra Light' },
    { value: '300', label: '300 — Light' },
    { value: '400', label: '400 — Regular' },
    { value: '500', label: '500 — Medium' },
    { value: '600', label: '600 — Semi Bold' },
    { value: '700', label: '700 — Bold' },
    { value: '800', label: '800 — Extra Bold' },
    { value: '900', label: '900 — Black' },
]

const generatedCss = computed(() => {
    const s = settings.value

    return `@font-face {
    font-family: '${s.family}';
    src: url('${s.source}') format('${s.format}');
    font-weight: ${s.weight};
    font-style: ${s.style};
    font-display: ${s.display};
}

.font-preview {
    font-family: '${s.family}', sans-serif;
}`
})

const generatedHtml = computed(() => {
    return `<div class="font-preview">
    ${settings.value.previewText}
</div>`
})

const previewStyle = computed(() => ({
    fontFamily: `'${settings.value.family}', sans-serif`,
    fontSize: `${settings.value.fontSize}px`,
    fontWeight: settings.value.weight,
    fontStyle: settings.value.style,
    letterSpacing: `${settings.value.letterSpacing}px`,
    lineHeight: settings.value.lineHeight,
}))

const completeCode = computed(() => {
    const s = settings.value

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${s.family} Font</title>

    <style>
        @font-face {
            font-family: '${s.family}';
            src: url('${s.source}') format('${s.format}');
            font-weight: ${s.weight};
            font-style: ${s.style};
            font-display: ${s.display};
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 40px;
            font-family: '${s.family}', sans-serif;
            background: #f8fafc;
            color: #10233f;
        }

        .font-preview {
            font-family: '${s.family}', sans-serif;
            font-size: ${s.fontSize}px;
            font-weight: ${s.weight};
            font-style: ${s.style};
            letter-spacing: ${s.letterSpacing}px;
            line-height: ${s.lineHeight};
        }
    </style>
</head>

<body>

    <div class="font-preview">
        ${s.previewText}
    </div>

</body>
</html>`
})

const fontDescription = computed(() => {
    const weight = fontWeights.find(
        item => item.value === settings.value.weight
    )

    return `${settings.value.family} • ${weight?.label || settings.value.weight}`
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
    link.download = 'fontface-generator.html'

    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
}

const applyPreset = () => {
    if (!settings.value.family) {
        settings.value.family = 'Inter'
    }
}
</script>

<template>
    <main
        class="min-h-screen bg-[#f8fafc] text-[#10233f] transition-colors dark:bg-gray-950 dark:text-gray-100">

        <!-- Header -->
        <section
            class="border-b border-slate-200 bg-white transition-colors dark:border-gray-800 dark:bg-gray-950">

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

                            Font Face Generator

                        </h1>

                        <p
                            class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-gray-400">

                            Generate custom CSS
                            <code
                                class="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700 dark:bg-gray-800 dark:text-gray-300">
                                @font-face
                            </code>
                            declarations and preview your typography instantly.

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

                                <Type class="h-5 w-5" />

                            </div>

                            <div>

                                <h2
                                    class="text-sm font-semibold text-[#10233f] dark:text-gray-100">

                                    Font Settings

                                </h2>

                                <p class="text-xs text-slate-500 dark:text-gray-400">

                                    Configure your font

                                </p>

                            </div>

                        </div>

                        <!-- Font Family -->
                        <div>

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Font Family

                            </label>

                            <input
                                v-model="settings.family"
                                list="font-presets"
                                type="text"
                                @change="applyPreset"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:placeholder:text-gray-600 dark:focus:border-cyan-600 dark:focus:ring-cyan-950/50"
                                placeholder="Enter font family" />

                            <datalist id="font-presets">

                                <option
                                    v-for="font in fontPresets"
                                    :key="font"
                                    :value="font" />

                            </datalist>

                            <p class="mt-2 text-[10px] text-slate-400 dark:text-gray-500">
                                Type your own font or select a common font.
                            </p>

                        </div>

                        <!-- Source -->
                        <div class="mt-5">

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Font Source URL

                            </label>

                            <input
                                v-model="settings.source"
                                type="url"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:placeholder:text-gray-600 dark:focus:border-cyan-600 dark:focus:ring-cyan-950/50"
                                placeholder="https://example.com/font.woff2" />

                        </div>

                        <!-- Format -->
                        <div class="mt-5">

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Font Format

                            </label>

                            <select
                                v-model="settings.format"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:focus:border-cyan-600 dark:focus:ring-cyan-950/50">

                                <option value="woff2">
                                    WOFF2 — Recommended
                                </option>

                                <option value="woff">
                                    WOFF
                                </option>

                                <option value="truetype">
                                    TTF / TrueType
                                </option>

                                <option value="opentype">
                                    OTF / OpenType
                                </option>

                                <option value="embedded-opentype">
                                    EOT
                                </option>

                            </select>

                        </div>

                        <!-- Weight -->
                        <div class="mt-5">

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Font Weight

                            </label>

                            <select
                                v-model="settings.weight"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:focus:border-cyan-600 dark:focus:ring-cyan-950/50">

                                <option
                                    v-for="weight in fontWeights"
                                    :key="weight.value"
                                    :value="weight.value">

                                    {{ weight.label }}

                                </option>

                            </select>

                        </div>

                        <!-- Style -->
                        <div class="mt-5">

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Font Style

                            </label>

                            <select
                                v-model="settings.style"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:focus:border-cyan-600 dark:focus:ring-cyan-950/50">

                                <option value="normal">
                                    Normal
                                </option>

                                <option value="italic">
                                    Italic
                                </option>

                                <option value="oblique">
                                    Oblique
                                </option>

                            </select>

                        </div>

                        <!-- Display -->
                        <div class="mt-5">

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Font Display

                            </label>

                            <select
                                v-model="settings.display"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:focus:border-cyan-600 dark:focus:ring-cyan-950/50">

                                <option value="swap">
                                    Swap — Recommended
                                </option>

                                <option value="block">
                                    Block
                                </option>

                                <option value="fallback">
                                    Fallback
                                </option>

                                <option value="optional">
                                    Optional
                                </option>

                                <option value="auto">
                                    Auto
                                </option>

                            </select>

                        </div>

                        <!-- Preview Text -->
                        <div class="mt-6">

                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">

                                Preview Text

                            </label>

                            <textarea
                                v-model="settings.previewText"
                                rows="4"
                                class="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:placeholder:text-gray-600 dark:focus:border-cyan-600 dark:focus:ring-cyan-950/50"></textarea>

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
                                min="12"
                                max="100"
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

                        <!-- Current -->
                        <div
                            class="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">

                            <p
                                class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">

                                Current Font

                            </p>

                            <p
                                class="mt-2 break-words text-sm font-semibold text-[#10233f] dark:text-gray-100">

                                {{ fontDescription }}

                            </p>

                            <p
                                class="mt-1 break-all font-mono text-[10px] text-slate-500 dark:text-gray-400">

                                {{ settings.source }}

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

                                <p class="text-xs text-slate-500 dark:text-gray-400">

                                    Based on your font settings

                                </p>

                            </div>

                        </div>

                        <pre
                            class="overflow-auto rounded-xl bg-[#101827] p-4 text-xs leading-6 text-slate-200 dark:bg-gray-950"><code>{{ generatedCss }}</code></pre>

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

                                    <Type class="h-5 w-5" />

                                </div>

                                <div>

                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-gray-100">

                                        Font Preview

                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-gray-400">

                                        {{ fontDescription }}

                                    </p>

                                </div>

                            </div>

                            <div class="flex items-center gap-2">

                                <span
                                    class="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400">

                                    @font-face

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

                        <!-- Preview body -->
                        <div
                            class="border-b border-slate-200 bg-[#f8fafc] p-6 transition-colors sm:p-10 dark:border-gray-800 dark:bg-gray-950">

                            <div
                                class="mb-5 rounded-xl border border-cyan-200 bg-cyan-50/70 px-4 py-3 dark:border-cyan-900/60 dark:bg-cyan-950/30">

                                <div class="flex items-start gap-3">

                                    <SlidersHorizontal
                                        class="mt-0.5 h-4 w-4 shrink-0 text-[#167fa8] dark:text-cyan-400" />

                                    <div>

                                        <p
                                            class="text-xs font-semibold text-[#167fa8] dark:text-cyan-400">

                                            Live Font Preview

                                        </p>

                                        <p
                                            class="mt-1 text-xs leading-5 text-[#2b6b86] dark:text-cyan-200/70">

                                            Change the font settings and preview
                                            typography instantly.

                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div
                                class="rounded-xl border border-dashed border-slate-300 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">

                                <div
                                    class="flex min-h-[430px] items-center justify-center overflow-auto rounded-lg border border-slate-200 bg-white p-8 transition-colors sm:p-12 dark:border-gray-700 dark:bg-gray-950">

                                    <div
                                        class="w-full max-w-4xl break-words text-center text-gray-900 transition-all duration-200 dark:text-gray-100"
                                        :style="previewStyle">

                                        {{ settings.previewText }}

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

                                    Family

                                </p>

                                <p
                                    class="mt-1 truncate text-xs font-semibold text-[#10233f] dark:text-gray-100">

                                    {{ settings.family }}

                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">

                                    Weight

                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-100">

                                    {{ settings.weight }}

                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">

                                    Format

                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-100">

                                    {{ settings.format }}

                                </p>

                            </div>

                            <div class="p-4">

                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">

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

                                    <p class="text-xs text-slate-500 dark:text-gray-400">

                                        Your complete @font-face declaration.

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
                            class="overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200 dark:bg-gray-950"><code>{{ generatedCss }}</code></pre>

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

                                    <p class="text-xs text-slate-500 dark:text-gray-400">

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
                            class="overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200 dark:bg-gray-950"><code>{{ generatedHtml }}</code></pre>

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

                                    <p class="text-xs text-slate-500 dark:text-gray-400">

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
                            class="max-h-[500px] overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200 dark:bg-gray-950"><code>{{ completeCode }}</code></pre>

                    </section>

                </div>

            </div>

        </section>

    </main>
</template>
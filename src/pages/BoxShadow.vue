<script setup>
import { computed, ref } from 'vue'
import {
    Check,
    Code2,
    Copy,
    Download,
    FileCode2,
    Import,
    Palette,
    RotateCcw,
    Settings2,
    Sparkles,
    Square,
} from 'lucide-vue-next'

const copied = ref('')
const activeTab = ref('shadow')

const htmlCode = ref(`<div class="shadow-box">
    Box Shadow
</div>`)

const customCss = ref(`.shadow-box {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #10233f;
}`)

const settings = ref({
    x: 8,
    y: 8,
    blur: 20,
    spread: 0,
    color: '#17447f',
    opacity: 25,
    inset: false,
    width: 220,
    height: 140,
    radius: 16,
    background: '#ffffff',
})

const defaultSettings = {
    x: 8,
    y: 8,
    blur: 20,
    spread: 0,
    color: '#17447f',
    opacity: 25,
    inset: false,
    width: 220,
    height: 140,
    radius: 16,
    background: '#ffffff',
}

const defaultHtml = `<div class="shadow-box">
    Box Shadow
</div>`

const defaultCss = `.shadow-box {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #10233f;
}`

const hexToRgba = (hex, opacity) => {
    const normalized = hex.replace('#', '')

    if (normalized.length !== 6) {
        return `rgba(23, 68, 127, ${opacity / 100})`
    }

    const r = parseInt(normalized.substring(0, 2), 16)
    const g = parseInt(normalized.substring(2, 4), 16)
    const b = parseInt(normalized.substring(4, 6), 16)

    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
}

const shadowValue = computed(() => {
    const inset = settings.value.inset ? 'inset ' : ''

    return `${inset}${settings.value.x}px ${settings.value.y}px ${settings.value.blur}px ${settings.value.spread}px ${hexToRgba(
        settings.value.color,
        settings.value.opacity
    )}`
})

const previewStyle = computed(() => ({
    width: `${settings.value.width}px`,
    height: `${settings.value.height}px`,
    borderRadius: `${settings.value.radius}px`,
    backgroundColor: settings.value.background,
    boxShadow: shadowValue.value,
}))

const generatedCss = computed(() => {
    return `.shadow-box {
    width: ${settings.value.width}px;
    height: ${settings.value.height}px;
    border-radius: ${settings.value.radius}px;
    background: ${settings.value.background};
    box-shadow: ${shadowValue.value};
}

${customCss.value}`
})

const generatedHtml = computed(() => {
    const lines = htmlCode.value
        .split('\n')
        .map((line) => `    ${line}`)
        .join('\n')

    return `<div class="shadow-box">
${lines.replace(/^    <div class="shadow-box">\n/, '').replace(/\n    <\/div>$/, '')}
</div>`
})

const completeCode = computed(() => {
    return `${generatedHtml.value}

<style>
.shadow-box {
    width: ${settings.value.width}px;
    height: ${settings.value.height}px;
    border-radius: ${settings.value.radius}px;
    background: ${settings.value.background};
    box-shadow: ${shadowValue.value};
}

${customCss.value}
</style>`
})

const reset = () => {
    settings.value = {
        ...defaultSettings,
    }

    htmlCode.value = defaultHtml
    customCss.value = defaultCss
    activeTab.value = 'shadow'
    copied.value = ''
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

const exportHtml = () => {
    const blob = new Blob([completeCode.value], {
        type: 'text/html',
    })

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'box-shadow.html'
    link.click()

    URL.revokeObjectURL(url)
}
</script>

<template>
    <main
        class="min-h-screen bg-[#f8fafc] text-[#10233f] transition-colors dark:bg-gray-950 dark:text-gray-100"
    >
        <!-- Page Header -->
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
                            Box Shadow Generator
                        </h1>

                        <p
                            class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-gray-400"
                        >
                            Visually create CSS box shadows and generate clean
                            HTML and CSS instantly.
                        </p>
                    </div>

                    <div class="flex items-center gap-3">
                        <button
                            type="button"
                            @click="reset"
                            class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800"
                        >
                            <RotateCcw class="h-4 w-4" />
                            Reset
                        </button>

                        <button
                            type="button"
                            @click="exportHtml"
                            class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17447f] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#123968] dark:bg-cyan-700 dark:hover:bg-cyan-600"
                        >
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
                    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                    <!-- Tabs -->
                    <div
                        class="grid grid-cols-4 border-b border-slate-200 dark:border-gray-800"
                    >
                        <button
                            type="button"
                            @click="activeTab = 'shadow'"
                            :class="[
                                'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                                activeTab === 'shadow'
                                    ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8] dark:bg-cyan-950/30 dark:text-cyan-400'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200',
                            ]"
                        >
                            <Settings2 class="h-3.5 w-3.5" />
                            Shadow
                        </button>

                        <button
                            type="button"
                            @click="activeTab = 'style'"
                            :class="[
                                'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                                activeTab === 'style'
                                    ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8] dark:bg-cyan-950/30 dark:text-cyan-400'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200',
                            ]"
                        >
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
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200',
                            ]"
                        >
                            <Code2 class="h-3.5 w-3.5" />
                            CSS
                        </button>

                        <button
                            type="button"
                            @click="activeTab = 'html'"
                            :class="[
                                'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                                activeTab === 'html'
                                    ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8] dark:bg-cyan-950/30 dark:text-cyan-400'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200',
                            ]"
                        >
                            <Import class="h-3.5 w-3.5" />
                            HTML
                        </button>
                    </div>

                    <!-- Shadow Controls -->
                    <div v-if="activeTab === 'shadow'" class="p-5">
                        <div class="mb-6 flex items-center gap-3">
                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400"
                            >
                                <Settings2 class="h-5 w-5" />
                            </div>

                            <div>
                                <h2
                                    class="text-sm font-semibold text-[#10233f] dark:text-gray-100"
                                >
                                    Shadow Settings
                                </h2>

                                <p
                                    class="text-xs text-slate-500 dark:text-gray-400"
                                >
                                    Configure your shadow
                                </p>
                            </div>
                        </div>

                        <div class="space-y-5">
                            <!-- X Offset -->
                            <div>
                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                                >
                                    <span>X Offset</span>
                                    <span
                                        class="font-mono text-[#167fa8] dark:text-cyan-400"
                                    >
                                        {{ settings.x }}px
                                    </span>
                                </label>

                                <input
                                    v-model.number="settings.x"
                                    type="range"
                                    min="-100"
                                    max="100"
                                    class="w-full accent-cyan-500"
                                />
                            </div>

                            <!-- Y Offset -->
                            <div>
                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                                >
                                    <span>Y Offset</span>
                                    <span
                                        class="font-mono text-[#167fa8] dark:text-cyan-400"
                                    >
                                        {{ settings.y }}px
                                    </span>
                                </label>

                                <input
                                    v-model.number="settings.y"
                                    type="range"
                                    min="-100"
                                    max="100"
                                    class="w-full accent-cyan-500"
                                />
                            </div>

                            <!-- Blur -->
                            <div>
                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                                >
                                    <span>Blur</span>
                                    <span
                                        class="font-mono text-[#167fa8] dark:text-cyan-400"
                                    >
                                        {{ settings.blur }}px
                                    </span>
                                </label>

                                <input
                                    v-model.number="settings.blur"
                                    type="range"
                                    min="0"
                                    max="100"
                                    class="w-full accent-cyan-500"
                                />
                            </div>

                            <!-- Spread -->
                            <div>
                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                                >
                                    <span>Spread</span>
                                    <span
                                        class="font-mono text-[#167fa8] dark:text-cyan-400"
                                    >
                                        {{ settings.spread }}px
                                    </span>
                                </label>

                                <input
                                    v-model.number="settings.spread"
                                    type="range"
                                    min="-50"
                                    max="50"
                                    class="w-full accent-cyan-500"
                                />
                            </div>

                            <!-- Color -->
                            <div>
                                <label
                                    class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                                >
                                    Shadow Color
                                </label>

                                <div class="flex gap-2">
                                    <input
                                        v-model="settings.color"
                                        type="color"
                                        class="h-11 w-14 cursor-pointer rounded-xl border border-slate-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900"
                                    />

                                    <input
                                        v-model="settings.color"
                                        type="text"
                                        class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-600 dark:focus:ring-cyan-950"
                                        placeholder="#17447f"
                                    />
                                </div>
                            </div>

                            <!-- Opacity -->
                            <div>
                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                                >
                                    <span>Opacity</span>
                                    <span
                                        class="font-mono text-[#167fa8] dark:text-cyan-400"
                                    >
                                        {{ settings.opacity }}%
                                    </span>
                                </label>

                                <input
                                    v-model.number="settings.opacity"
                                    type="range"
                                    min="0"
                                    max="100"
                                    class="w-full accent-cyan-500"
                                />
                            </div>

                            <!-- Inset -->
                            <label
                                class="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div>
                                    <p
                                        class="text-xs font-semibold text-slate-700 dark:text-gray-200"
                                    >
                                        Inset Shadow
                                    </p>

                                    <p
                                        class="mt-1 text-[11px] text-slate-500 dark:text-gray-400"
                                    >
                                        Render shadow inside the element
                                    </p>
                                </div>

                                <input
                                    v-model="settings.inset"
                                    type="checkbox"
                                    class="h-4 w-4 rounded border-slate-300 accent-cyan-500"
                                />
                            </label>
                        </div>
                    </div>

                    <!-- Style -->
                    <div v-else-if="activeTab === 'style'" class="p-5">
                        <div class="mb-5 flex items-center gap-3">
                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400"
                            >
                                <Palette class="h-5 w-5" />
                            </div>

                            <div>
                                <h2
                                    class="text-sm font-semibold text-[#10233f] dark:text-gray-100"
                                >
                                    Box Styling
                                </h2>

                                <p
                                    class="text-xs text-slate-500 dark:text-gray-400"
                                >
                                    Customize the preview
                                </p>
                            </div>
                        </div>

                        <div class="space-y-5">
                            <!-- Width -->
                            <div>
                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                                >
                                    <span>Width</span>
                                    <span
                                        class="font-mono text-[#167fa8] dark:text-cyan-400"
                                    >
                                        {{ settings.width }}px
                                    </span>
                                </label>

                                <input
                                    v-model.number="settings.width"
                                    type="range"
                                    min="100"
                                    max="400"
                                    class="w-full accent-cyan-500"
                                />
                            </div>

                            <!-- Height -->
                            <div>
                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                                >
                                    <span>Height</span>
                                    <span
                                        class="font-mono text-[#167fa8] dark:text-cyan-400"
                                    >
                                        {{ settings.height }}px
                                    </span>
                                </label>

                                <input
                                    v-model.number="settings.height"
                                    type="range"
                                    min="80"
                                    max="300"
                                    class="w-full accent-cyan-500"
                                />
                            </div>

                            <!-- Radius -->
                            <div>
                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                                >
                                    <span>Border Radius</span>
                                    <span
                                        class="font-mono text-[#167fa8] dark:text-cyan-400"
                                    >
                                        {{ settings.radius }}px
                                    </span>
                                </label>

                                <input
                                    v-model.number="settings.radius"
                                    type="range"
                                    min="0"
                                    max="100"
                                    class="w-full accent-cyan-500"
                                />
                            </div>

                            <!-- Background -->
                            <div>
                                <label
                                    class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                                >
                                    Background
                                </label>

                                <div class="flex gap-2">
                                    <input
                                        v-model="settings.background"
                                        type="color"
                                        class="h-11 w-14 cursor-pointer rounded-xl border border-slate-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900"
                                    />

                                    <input
                                        v-model="settings.background"
                                        type="text"
                                        class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-600 dark:focus:ring-cyan-950"
                                        placeholder="#ffffff"
                                    />
                                </div>
                            </div>
                        </div>

                        <div
                            class="mt-6 overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700"
                        >
                            <div
                                class="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                            >
                                <p
                                    class="text-xs font-semibold text-slate-700 dark:text-gray-200"
                                >
                                    Custom CSS
                                </p>

                                <p
                                    class="mt-1 text-[11px] text-slate-500 dark:text-gray-400"
                                >
                                    Additional styles for the preview box.
                                </p>
                            </div>

                            <textarea
                                v-model="customCss"
                                spellcheck="false"
                                class="min-h-[260px] w-full resize-y bg-[#101827] p-4 font-mono text-xs leading-6 text-slate-200 outline-none"
                            ></textarea>
                        </div>

                        <button
                            type="button"
                            @click="copyText(customCss, 'custom')"
                            class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400"
                        >
                            <Check
                                v-if="copied === 'custom'"
                                class="h-4 w-4 text-emerald-500"
                            />

                            <Copy v-else class="h-4 w-4" />

                            {{ copied === 'custom' ? 'Copied' : 'Copy Custom CSS' }}
                        </button>
                    </div>

                    <!-- CSS -->
                    <div v-else-if="activeTab === 'css'" class="p-5">
                        <div class="mb-5 flex items-center gap-3">
                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400"
                            >
                                <Code2 class="h-5 w-5" />
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
                                    Based on your settings
                                </p>
                            </div>
                        </div>

                        <div
                            class="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700"
                        >
                            <pre
                                class="max-h-[500px] overflow-auto bg-[#101827] p-4 text-xs leading-6 text-slate-200"
                            ><code>{{ generatedCss }}</code></pre>
                        </div>

                        <button
                            type="button"
                            @click="copyText(generatedCss, 'css')"
                            class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#17447f] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#123968] dark:bg-cyan-700 dark:hover:bg-cyan-600"
                        >
                            <Check v-if="copied === 'css'" class="h-4 w-4" />

                            <Copy v-else class="h-4 w-4" />

                            {{ copied === 'css' ? 'Copied' : 'Copy CSS' }}
                        </button>
                    </div>

                    <!-- HTML -->
                    <div v-else class="p-5">
                        <div class="mb-5 flex items-center gap-3">
                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400"
                            >
                                <FileCode2 class="h-5 w-5" />
                            </div>

                            <div>
                                <h2
                                    class="text-sm font-semibold text-[#10233f] dark:text-gray-100"
                                >
                                    HTML Structure
                                </h2>

                                <p
                                    class="text-xs text-slate-500 dark:text-gray-400"
                                >
                                    Customize your shadow element
                                </p>
                            </div>
                        </div>

                        <textarea
                            v-model="htmlCode"
                            spellcheck="false"
                            class="min-h-[430px] w-full resize-y rounded-xl border border-slate-200 bg-[#101827] p-4 font-mono text-xs leading-6 text-slate-200 outline-none focus:border-cyan-400 dark:border-gray-700"
                        ></textarea>

                        <button
                            type="button"
                            @click="copyText(generatedHtml, 'html')"
                            class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400"
                        >
                            <Check
                                v-if="copied === 'html'"
                                class="h-4 w-4 text-emerald-500"
                            />

                            <Copy v-else class="h-4 w-4" />

                            {{ copied === 'html' ? 'Copied' : 'Copy HTML' }}
                        </button>
                    </div>
                </aside>

                <!-- Main -->
                <div class="min-w-0 space-y-6">
                    <!-- Preview -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400"
                                >
                                    <Square class="h-5 w-5" />
                                </div>

                                <div>
                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-gray-100"
                                    >
                                        Box Shadow Editor
                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        {{ settings.inset ? 'Inset' : 'Outer' }}
                                        shadow · {{ settings.blur }}px blur
                                    </p>
                                </div>
                            </div>

                            <div class="flex items-center gap-2">
                                <span
                                    class="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400"
                                >
                                    {{ settings.width }} × {{ settings.height }}
                                </span>

                                <span
                                    class="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                                >
                                    <span
                                        class="h-1.5 w-1.5 rounded-full bg-emerald-500"
                                    ></span>

                                    Live
                                </span>
                            </div>
                        </div>

                        <!-- Canvas -->
                        <div
                            class="border-b border-slate-200 bg-[#f8fafc] p-6 dark:border-gray-800 dark:bg-gray-950 sm:p-10"
                        >
                            <div
                                class="mb-5 rounded-xl border border-cyan-200 bg-cyan-50/70 px-4 py-3 dark:border-cyan-900/60 dark:bg-cyan-950/30"
                            >
                                <div class="flex items-start gap-3">
                                    <Settings2
                                        class="mt-0.5 h-4 w-4 shrink-0 text-[#167fa8] dark:text-cyan-400"
                                    />

                                    <div>
                                        <p
                                            class="text-xs font-semibold text-[#167fa8] dark:text-cyan-400"
                                        >
                                            Visual Box Shadow editor
                                        </p>

                                        <p
                                            class="mt-1 text-xs leading-5 text-[#2b6b86] dark:text-cyan-200/70"
                                        >
                                            Adjust the shadow controls to see
                                            your box update instantly.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                class="flex min-h-[430px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white p-10 dark:border-gray-700 dark:bg-gray-900"
                                style="
                                    background-image: radial-gradient(
                                        #d7dde5 1px,
                                        transparent 1px
                                    );
                                    background-size: 20px 20px;
                                "
                            >
                                <div
                                    class="flex min-h-[330px] w-full items-center justify-center overflow-auto rounded-lg border border-slate-200 bg-white/90 p-12 dark:border-gray-700 dark:bg-gray-800/90"
                                >
                                    <div
                                        class="flex shrink-0 items-center justify-center"
                                        :style="previewStyle"
                                        v-html="htmlCode"
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <!-- Properties -->
                        <div
                            class="grid grid-cols-2 divide-x divide-slate-200 dark:divide-gray-800 sm:grid-cols-4"
                        >
                            <div class="p-4">
                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    X Offset
                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200"
                                >
                                    {{ settings.x }}px
                                </p>
                            </div>

                            <div class="p-4">
                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    Y Offset
                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200"
                                >
                                    {{ settings.y }}px
                                </p>
                            </div>

                            <div class="p-4">
                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    Blur
                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200"
                                >
                                    {{ settings.blur }}px
                                </p>
                            </div>

                            <div class="p-4">
                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    Spread
                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200"
                                >
                                    {{ settings.spread }}px
                                </p>
                            </div>
                        </div>
                    </section>

                    <!-- Generated CSS -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
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
                                        CSS generated from your shadow
                                        settings.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                @click="
                                    copyText(generatedCss, 'generated-css')
                                "
                                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400"
                            >
                                <Check
                                    v-if="copied === 'generated-css'"
                                    class="h-3.5 w-3.5 text-emerald-500"
                                />

                                <Copy v-else class="h-3.5 w-3.5" />

                                {{
                                    copied === 'generated-css'
                                        ? 'Copied'
                                        : 'Copy CSS'
                                }}
                            </button>
                        </div>

                        <pre
                            class="max-h-[400px] overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"
                        ><code>{{ generatedCss }}</code></pre>
                    </section>

                    <!-- Generated HTML -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
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
                                        Generated HTML
                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        HTML structure generated from your
                                        editor.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                @click="copyText(generatedHtml, 'html-code')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400"
                            >
                                <Check
                                    v-if="copied === 'html-code'"
                                    class="h-3.5 w-3.5 text-emerald-500"
                                />

                                <Copy v-else class="h-3.5 w-3.5" />

                                {{
                                    copied === 'html-code'
                                        ? 'Copied'
                                        : 'Copy HTML'
                                }}
                            </button>
                        </div>

                        <pre
                            class="max-h-[400px] overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"
                        ><code>{{ generatedHtml }}</code></pre>
                    </section>

                    <!-- Complete Code -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400"
                                >
                                    <FileCode2 class="h-4 w-4" />
                                </div>

                                <div>
                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-gray-100"
                                    >
                                        Complete Code
                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        Ready-to-use HTML and CSS.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                @click="copyText(completeCode, 'complete')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#17447f] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#123968] dark:bg-cyan-700 dark:hover:bg-cyan-600"
                            >
                                <Check
                                    v-if="copied === 'complete'"
                                    class="h-3.5 w-3.5"
                                />

                                <Copy v-else class="h-3.5 w-3.5" />

                                {{
                                    copied === 'complete'
                                        ? 'Copied'
                                        : 'Copy Complete Code'
                                }}
                            </button>
                        </div>

                        <pre
                            class="max-h-[500px] overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"
                        ><code>{{ completeCode }}</code></pre>
                    </section>

                    <!-- Current Properties -->
                    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div
                            class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                        >
                            <p
                                class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                            >
                                Shadow
                            </p>

                            <p
                                class="mt-1 truncate font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200"
                            >
                                {{ settings.inset ? 'inset' : 'outer' }}
                            </p>
                        </div>

                        <div
                            class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                        >
                            <p
                                class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                            >
                                Opacity
                            </p>

                            <p
                                class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200"
                            >
                                {{ settings.opacity }}%
                            </p>
                        </div>

                        <div
                            class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                        >
                            <p
                                class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                            >
                                Radius
                            </p>

                            <p
                                class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200"
                            >
                                {{ settings.radius }}px
                            </p>
                        </div>

                        <div
                            class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                        >
                            <p
                                class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                            >
                                Color
                            </p>

                            <p
                                class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200"
                            >
                                {{ settings.color }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
<script setup>
import { computed, ref } from 'vue'
import {
    Check,
    Code2,
    Copy,
    Download,
    FileCode2,
    Link,
    Link2Off,
    Palette,
    RotateCcw,
    SlidersHorizontal,
    Sparkles,
    Square,
} from 'lucide-vue-next'

const copied = ref('')
const activeTab = ref('controls')
const linked = ref(false)

const settings = ref({
    topLeft: 24,
    topRight: 24,
    bottomRight: 24,
    bottomLeft: 24,
    unit: 'px',
    background: '#17447f',
    borderColor: '#0f2f59',
    borderWidth: 0,
})

const customCss = ref(`width: 280px;
height: 180px;`)

const defaultSettings = {
    topLeft: 24,
    topRight: 24,
    bottomRight: 24,
    bottomLeft: 24,
    unit: 'px',
    background: '#17447f',
    borderColor: '#0f2f59',
    borderWidth: 0,
}

const defaultCss = `width: 280px;
height: 180px;`

const updateRadius = (corner, value) => {
    const numericValue = Number(value)

    if (linked.value) {
        settings.value.topLeft = numericValue
        settings.value.topRight = numericValue
        settings.value.bottomRight = numericValue
        settings.value.bottomLeft = numericValue
    } else {
        settings.value[corner] = numericValue
    }
}

const toggleLinked = () => {
    linked.value = !linked.value

    if (linked.value) {
        const value = settings.value.topLeft

        settings.value.topRight = value
        settings.value.bottomRight = value
        settings.value.bottomLeft = value
    }
}

const borderRadiusValue = computed(() => {
    const unit = settings.value.unit

    return [
        `${settings.value.topLeft}${unit}`,
        `${settings.value.topRight}${unit}`,
        `${settings.value.bottomRight}${unit}`,
        `${settings.value.bottomLeft}${unit}`,
    ].join(' ')
})

const previewStyle = computed(() => ({
    borderRadius: borderRadiusValue.value,
    backgroundColor: settings.value.background,
    border:
        settings.value.borderWidth > 0
            ? `${settings.value.borderWidth}px solid ${settings.value.borderColor}`
            : 'none',
}))

const generatedCss = computed(() => {
    const customProperties = customCss.value
        .split('\n')
        .map((line) => `    ${line}`)
        .join('\n')

    return `.border-preview {
    border-radius: ${borderRadiusValue.value};
${customProperties}
}`
})

const generatedHtml = computed(() => {
    return `<div class="border-preview">
    CSSCraft
</div>`
})

const completeCode = computed(() => {
    const customProperties = customCss.value
        .split('\n')
        .map((line) => `    ${line}`)
        .join('\n')

    return `${generatedHtml.value}

<style>
.border-preview {
    border-radius: ${borderRadiusValue.value};
    background: ${settings.value.background};
    border: ${settings.value.borderWidth > 0
            ? `${settings.value.borderWidth}px solid ${settings.value.borderColor}`
            : 'none'
        };
${customProperties}
}
</style>`
})

const reset = () => {
    settings.value = {
        ...defaultSettings,
    }

    customCss.value = defaultCss
    linked.value = false
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
    const linkElement = document.createElement('a')

    linkElement.href = url
    linkElement.download = 'border-radius.html'

    document.body.appendChild(linkElement)
    linkElement.click()
    linkElement.remove()

    URL.revokeObjectURL(url)
}
</script>

<template>
    <main class="min-h-screen bg-[#f8fafc] text-[#10233f]">

        <!-- Header -->
        <section class="border-b border-slate-200 bg-white">
            <div class="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">

                <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <div
                            class="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#167fa8]">
                            <Sparkles class="h-3.5 w-3.5" />
                            CSS Builder
                        </div>

                        <h1 class="text-3xl font-bold tracking-tight text-[#10233f] sm:text-4xl">
                            Border Radius Generator
                        </h1>

                        <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                            Customize every corner independently and generate clean CSS instantly.
                        </p>
                    </div>

                    <div class="flex flex-wrap items-center gap-3">

                        <button type="button" @click="reset"
                            class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
                            <RotateCcw class="h-4 w-4" />
                            Reset
                        </button>

                        <button type="button" @click="exportHtml"
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

                <!-- Sidebar -->
                <aside class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <!-- Tabs -->
                    <div class="grid grid-cols-3 border-b border-slate-200">

                        <button type="button" @click="activeTab = 'controls'" :class="[
                            'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                            activeTab === 'controls'
                                ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8]'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        ]">
                            <SlidersHorizontal class="h-3.5 w-3.5" />
                            Controls
                        </button>

                        <button type="button" @click="activeTab = 'style'" :class="[
                            'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                            activeTab === 'style'
                                ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8]'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        ]">
                            <Palette class="h-3.5 w-3.5" />
                            Style
                        </button>

                        <button type="button" @click="activeTab = 'css'" :class="[
                            'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                            activeTab === 'css'
                                ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8]'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        ]">
                            <Code2 class="h-3.5 w-3.5" />
                            CSS
                        </button>

                    </div>

                    <!-- Controls -->
                    <div v-if="activeTab === 'controls'" class="p-5">

                        <div class="mb-6 flex items-center gap-3">

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac]">
                                <SlidersHorizontal class="h-5 w-5" />
                            </div>

                            <div>
                                <h2 class="text-sm font-semibold text-[#10233f]">
                                    Corner Settings
                                </h2>

                                <p class="text-xs text-slate-500">
                                    Customize each corner
                                </p>
                            </div>

                        </div>

                        <!-- Link Toggle -->
                        <button type="button" @click="toggleLinked" :class="[
                            'mb-6 flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition',
                            linked
                                ? 'border-cyan-200 bg-cyan-50 text-[#167fa8]'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        ]">
                            <Link v-if="linked" class="h-4 w-4" />

                            <Link2Off v-else class="h-4 w-4" />

                            {{ linked ? 'Linked Corners' : 'Independent Corners' }}
                        </button>

                        <div class="mb-5 rounded-xl border border-cyan-200 bg-cyan-50/60 px-3 py-3">
                            <p class="text-[11px] leading-5 text-[#2b6b86]">
                                {{
                                    linked
                                        ? 'Changing one corner updates all four corners.'
                                        : 'Each corner can now be customized independently.'
                                }}
                            </p>
                        </div>

                        <div class="space-y-5">

                            <!-- Top Left -->
                            <div>
                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                    <span>Top Left</span>

                                    <span class="font-mono text-[#167fa8]">
                                        {{ settings.topLeft }}{{ settings.unit }}
                                    </span>
                                </label>

                                <input :value="settings.topLeft" @input="updateRadius('topLeft', $event.target.value)"
                                    type="range" min="0" max="100" class="w-full accent-cyan-500" />

                                <input :value="settings.topLeft" @input="updateRadius('topLeft', $event.target.value)"
                                    type="number" min="0" max="100"
                                    class="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
                            </div>

                            <!-- Top Right -->
                            <div>
                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                    <span>Top Right</span>

                                    <span class="font-mono text-[#167fa8]">
                                        {{ settings.topRight }}{{ settings.unit }}
                                    </span>
                                </label>

                                <input :value="settings.topRight" @input="updateRadius('topRight', $event.target.value)"
                                    type="range" min="0" max="100" class="w-full accent-cyan-500" />

                                <input :value="settings.topRight" @input="updateRadius('topRight', $event.target.value)"
                                    type="number" min="0" max="100"
                                    class="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
                            </div>

                            <!-- Bottom Right -->
                            <div>
                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                    <span>Bottom Right</span>

                                    <span class="font-mono text-[#167fa8]">
                                        {{ settings.bottomRight }}{{ settings.unit }}
                                    </span>
                                </label>

                                <input :value="settings.bottomRight"
                                    @input="updateRadius('bottomRight', $event.target.value)" type="range" min="0"
                                    max="100" class="w-full accent-cyan-500" />

                                <input :value="settings.bottomRight"
                                    @input="updateRadius('bottomRight', $event.target.value)" type="number" min="0"
                                    max="100"
                                    class="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
                            </div>

                            <!-- Bottom Left -->
                            <div>
                                <label
                                    class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                    <span>Bottom Left</span>

                                    <span class="font-mono text-[#167fa8]">
                                        {{ settings.bottomLeft }}{{ settings.unit }}
                                    </span>
                                </label>

                                <input :value="settings.bottomLeft"
                                    @input="updateRadius('bottomLeft', $event.target.value)" type="range" min="0"
                                    max="100" class="w-full accent-cyan-500" />

                                <input :value="settings.bottomLeft"
                                    @input="updateRadius('bottomLeft', $event.target.value)" type="number" min="0"
                                    max="100"
                                    class="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
                            </div>

                            <!-- Unit -->
                            <div>
                                <label
                                    class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                    Unit
                                </label>

                                <select v-model="settings.unit"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100">
                                    <option value="px">px</option>
                                    <option value="%">%</option>
                                    <option value="rem">rem</option>
                                    <option value="em">em</option>
                                </select>
                            </div>

                        </div>
                    </div>

                    <!-- Style -->
                    <div v-else-if="activeTab === 'style'" class="p-5">

                        <div class="mb-6 flex items-center gap-3">

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac]">
                                <Palette class="h-5 w-5" />
                            </div>

                            <div>
                                <h2 class="text-sm font-semibold text-[#10233f]">
                                    Box Style
                                </h2>

                                <p class="text-xs text-slate-500">
                                    Customize the preview
                                </p>
                            </div>

                        </div>

                        <!-- Background -->
                        <div>
                            <label class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Background
                            </label>

                            <div class="flex gap-2">

                                <input v-model="settings.background" type="color"
                                    class="h-11 w-14 cursor-pointer rounded-xl border border-slate-200 bg-white p-1" />

                                <input v-model="settings.background" type="text"
                                    class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />

                            </div>
                        </div>

                        <!-- Border Width -->
                        <div class="mt-6">

                            <label
                                class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                <span>Border Width</span>

                                <span class="font-mono text-[#167fa8]">
                                    {{ settings.borderWidth }}px
                                </span>
                            </label>

                            <input v-model.number="settings.borderWidth" type="range" min="0" max="20"
                                class="w-full accent-cyan-500" />

                        </div>

                        <!-- Border Color -->
                        <div class="mt-6">

                            <label class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Border Color
                            </label>

                            <div class="flex gap-2">

                                <input v-model="settings.borderColor" type="color"
                                    class="h-11 w-14 cursor-pointer rounded-xl border border-slate-200 bg-white p-1" />

                                <input v-model="settings.borderColor" type="text"
                                    class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />

                            </div>

                        </div>

                        <!-- Custom CSS -->
                        <div class="mt-6 overflow-hidden rounded-xl border border-slate-200">

                            <div class="border-b border-slate-200 bg-slate-50 px-4 py-3">
                                <p class="text-xs font-semibold text-slate-700">
                                    Custom CSS
                                </p>

                                <p class="mt-1 text-[11px] text-slate-500">
                                    Additional styles applied to the preview.
                                </p>
                            </div>

                            <textarea v-model="customCss" spellcheck="false"
                                class="min-h-[220px] w-full resize-y bg-[#101827] p-4 font-mono text-xs leading-6 text-slate-200 outline-none"></textarea>

                        </div>

                        <button type="button" @click="copyText(customCss, 'custom')"
                            class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8]">
                            <Check v-if="copied === 'custom'" class="h-4 w-4 text-emerald-500" />

                            <Copy v-else class="h-4 w-4" />

                            {{ copied === 'custom' ? 'Copied' : 'Copy Custom CSS' }}
                        </button>

                    </div>

                    <!-- CSS -->
                    <div v-else class="p-5">

                        <div class="mb-5 flex items-center gap-3">

                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac]">
                                <Code2 class="h-5 w-5" />
                            </div>

                            <div>
                                <h2 class="text-sm font-semibold text-[#10233f]">
                                    Generated CSS
                                </h2>

                                <p class="text-xs text-slate-500">
                                    Based on your border radius settings
                                </p>
                            </div>

                        </div>

                        <div class="overflow-hidden rounded-xl border border-slate-200">

                            <pre
                                class="max-h-[500px] overflow-auto bg-[#101827] p-4 text-xs leading-6 text-slate-200"><code>{{ generatedCss }}</code></pre>

                        </div>

                        <button type="button" @click="copyText(generatedCss, 'css')"
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
                    <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div
                            class="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac]">
                                    <Square class="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 class="text-sm font-semibold text-[#10233f]">
                                        Border Radius Editor
                                    </h2>

                                    <p class="text-xs text-slate-500">
                                        {{ borderRadiusValue }}
                                    </p>
                                </div>

                            </div>

                            <div class="flex items-center gap-2">

                                <span class="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-[#167fa8]">
                                    Border Radius
                                </span>

                                <span
                                    class="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600">
                                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                    Live
                                </span>

                            </div>

                        </div>

                        <!-- Preview Body -->
                        <div class="border-b border-slate-200 bg-[#f8fafc] p-6 sm:p-10">

                            <div class="mb-5 rounded-xl border border-cyan-200 bg-cyan-50/70 px-4 py-3">

                                <div class="flex items-start gap-3">

                                    <SlidersHorizontal class="mt-0.5 h-4 w-4 shrink-0 text-[#167fa8]" />

                                    <div>
                                        <p class="text-xs font-semibold text-[#167fa8]">
                                            Visual Border Radius Editor
                                        </p>

                                        <p class="mt-1 text-xs leading-5 text-[#2b6b86]">
                                            Adjust each corner independently or link them together.
                                            The preview and generated CSS update instantly.
                                        </p>
                                    </div>

                                </div>

                            </div>

                            <!-- Canvas -->
                            <div class="rounded-xl border border-dashed border-slate-300 bg-white p-3">

                                <div class="flex min-h-[430px] w-full items-center justify-center overflow-auto rounded-lg border border-slate-200 bg-white p-8"
                                    style="background-image: radial-gradient(#d7dde5 1px, transparent 1px); background-size: 20px 20px;">

                                    <div
                                        class="flex min-h-[330px] w-full items-center justify-center overflow-auto rounded-lg border border-slate-200 bg-white/90 p-10">

                                        <div class="flex h-[180px] w-[280px] items-center justify-center shadow-lg transition-all duration-150"
                                            :style="previewStyle">
                                            <div class="text-center text-white">

                                                <p class="text-lg font-bold">
                                                    CSSCraft
                                                </p>

                                                <p class="mt-1 text-xs text-white/70">
                                                    Border Radius
                                                </p>

                                            </div>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <!-- Properties -->
                        <div class="grid grid-cols-2 divide-x divide-slate-200 sm:grid-cols-4">

                            <div class="p-4">
                                <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Top Left
                                </p>

                                <p class="mt-1 truncate font-mono text-xs font-semibold text-[#10233f]">
                                    {{ settings.topLeft }}{{ settings.unit }}
                                </p>
                            </div>

                            <div class="p-4">
                                <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Top Right
                                </p>

                                <p class="mt-1 truncate font-mono text-xs font-semibold text-[#10233f]">
                                    {{ settings.topRight }}{{ settings.unit }}
                                </p>
                            </div>

                            <div class="p-4">
                                <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Bottom Right
                                </p>

                                <p class="mt-1 truncate font-mono text-xs font-semibold text-[#10233f]">
                                    {{ settings.bottomRight }}{{ settings.unit }}
                                </p>
                            </div>

                            <div class="p-4">
                                <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Bottom Left
                                </p>

                                <p class="mt-1 truncate font-mono text-xs font-semibold text-[#10233f]">
                                    {{ settings.bottomLeft }}{{ settings.unit }}
                                </p>
                            </div>

                        </div>

                    </section>

                    <!-- Generated CSS -->
                    <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                    <Code2 class="h-4 w-4" />
                                </div>

                                <div>
                                    <h2 class="text-sm font-semibold text-[#10233f]">
                                        Generated CSS
                                    </h2>

                                    <p class="text-xs text-slate-500">
                                        CSS generated from your border radius settings.
                                    </p>
                                </div>

                            </div>

                            <button type="button" @click="copyText(generatedCss, 'generated-css')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8]">
                                <Check v-if="copied === 'generated-css'" class="h-3.5 w-3.5 text-emerald-500" />

                                <Copy v-else class="h-3.5 w-3.5" />

                                {{ copied === 'generated-css' ? 'Copied' : 'Copy CSS' }}
                            </button>

                        </div>

                        <pre
                            class="max-h-[400px] overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"><code>{{ generatedCss }}</code></pre>

                    </section>

                    <!-- Generated HTML -->
                    <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                    <FileCode2 class="h-4 w-4" />
                                </div>

                                <div>
                                    <h2 class="text-sm font-semibold text-[#10233f]">
                                        Generated HTML
                                    </h2>

                                    <p class="text-xs text-slate-500">
                                        HTML structure generated from your editor.
                                    </p>
                                </div>

                            </div>

                            <button type="button" @click="copyText(generatedHtml, 'html')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8]">
                                <Check v-if="copied === 'html'" class="h-3.5 w-3.5 text-emerald-500" />

                                <Copy v-else class="h-3.5 w-3.5" />

                                {{ copied === 'html' ? 'Copied' : 'Copy HTML' }}
                            </button>

                        </div>

                        <pre
                            class="max-h-[400px] overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"><code>{{ generatedHtml }}</code></pre>

                    </section>

                    <!-- Complete Code -->
                    <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                            <div class="flex items-center gap-3">

                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-[#167fa8]">
                                    <FileCode2 class="h-4 w-4" />
                                </div>

                                <div>
                                    <h2 class="text-sm font-semibold text-[#10233f]">
                                        Complete Code
                                    </h2>

                                    <p class="text-xs text-slate-500">
                                        Ready-to-use HTML and CSS.
                                    </p>
                                </div>

                            </div>

                            <button type="button" @click="copyText(completeCode, 'complete')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#17447f] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#123968]">
                                <Check v-if="copied === 'complete'" class="h-3.5 w-3.5" />

                                <Copy v-else class="h-3.5 w-3.5" />

                                {{ copied === 'complete' ? 'Copied' : 'Copy Complete Code' }}
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
<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
    Check,
    Code2,
    Copy,
    Download,
    FileCode2,
    RotateCcw,
    SlidersHorizontal,
    Sparkles,
    WandSparkles,
} from 'lucide-vue-next'

const copied = ref('')
const activeTab = ref('controls')
const previewKey = ref(0)
let styleElement = null

const defaultSettings = {
    animationName: 'csscraft-animation',
    duration: 1,
    timingFunction: 'ease',
    delay: 0,
    iterationCount: '1',
    direction: 'normal',
    fillMode: 'both',
    playState: 'running',
    translateX: 40,
    translateY: 0,
    scale: 1.1,
    rotate: 0,
    opacity: 1,
    previewText: 'CSSCraft Animation',
}

const settings = ref({ ...defaultSettings })

const timingFunctions = [
    { value: 'linear', label: 'Linear' },
    { value: 'ease', label: 'Ease' },
    { value: 'ease-in', label: 'Ease In' },
    { value: 'ease-out', label: 'Ease Out' },
    { value: 'ease-in-out', label: 'Ease In Out' },
]

const directions = [
    { value: 'normal', label: 'Normal' },
    { value: 'reverse', label: 'Reverse' },
    { value: 'alternate', label: 'Alternate' },
    { value: 'alternate-reverse', label: 'Alternate Reverse' },
]

const fillModes = [
    { value: 'none', label: 'None' },
    { value: 'forwards', label: 'Forwards' },
    { value: 'backwards', label: 'Backwards' },
    { value: 'both', label: 'Both' },
]

const iterationOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: 'infinite', label: 'Infinite' },
]

const safeAnimationName = computed(() => {
    const name = settings.value.animationName
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .replace(/^[^a-zA-Z_-]+/, '')

    return name || 'csscraft-animation'
})

const keyframes = computed(() => {
    const s = settings.value

    return `@keyframes ${safeAnimationName.value} {
    from {
        opacity: 0;
        transform:
            translate(${s.translateX}px, ${s.translateY}px)
            scale(${s.scale})
            rotate(${s.rotate}deg);
    }

    to {
        opacity: ${s.opacity};
        transform:
            translate(0, 0)
            scale(1)
            rotate(0deg);
    }
}`
})

const generatedCss = computed(() => {
    const s = settings.value

    return `${keyframes.value}

.animated-element {
    animation-name: ${safeAnimationName.value};
    animation-duration: ${s.duration}s;
    animation-timing-function: ${s.timingFunction};
    animation-delay: ${s.delay}s;
    animation-iteration-count: ${s.iterationCount};
    animation-direction: ${s.direction};
    animation-fill-mode: ${s.fillMode};
    animation-play-state: ${s.playState};
}`
})

const generatedHtml = computed(() => {
    return `<div class="animated-element">
    ${settings.value.previewText}
</div>`
})

const previewStyle = computed(() => {
    const s = settings.value

    return {
        animationName: safeAnimationName.value,
        animationDuration: `${s.duration}s`,
        animationTimingFunction: s.timingFunction,
        animationDelay: `${s.delay}s`,
        animationIterationCount: s.iterationCount,
        animationDirection: s.direction,
        animationFillMode: s.fillMode,
        animationPlayState: s.playState,
    }
})

const completeCode = computed(() => {
    const s = settings.value

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSSCraft Animation</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
            font-family: Arial, sans-serif;
            background: #f8fafc;
            color: #10233f;
        }

        @keyframes ${safeAnimationName.value} {
            from {
                opacity: 0;
                transform:
                    translate(${s.translateX}px, ${s.translateY}px)
                    scale(${s.scale})
                    rotate(${s.rotate}deg);
            }

            to {
                opacity: ${s.opacity};
                transform:
                    translate(0, 0)
                    scale(1)
                    rotate(0deg);
            }
        }

        .animated-element {
            animation-name: ${safeAnimationName.value};
            animation-duration: ${s.duration}s;
            animation-timing-function: ${s.timingFunction};
            animation-delay: ${s.delay}s;
            animation-iteration-count: ${s.iterationCount};
            animation-direction: ${s.direction};
            animation-fill-mode: ${s.fillMode};
            animation-play-state: ${s.playState};
        }
    </style>
</head>

<body>

    <div class="animated-element">
        ${s.previewText}
    </div>

</body>
</html>`
})

const animationDescription = computed(() => {
    const iteration =
        settings.value.iterationCount === 'infinite'
            ? 'Infinite'
            : `${settings.value.iterationCount}x`

    return `${settings.value.duration}s • ${settings.value.timingFunction} • ${iteration}`
})

const updatePreviewStyles = () => {
    if (!styleElement) return

    styleElement.textContent = keyframes.value
}

const reset = async () => {
    settings.value = { ...defaultSettings }
    activeTab.value = 'controls'
    copied.value = ''

    await nextTick()
    replayAnimation()
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
    link.download = 'animation-generator.html'

    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
}

const replayAnimation = async () => {
    previewKey.value++

    await nextTick()

    requestAnimationFrame(() => {
        previewKey.value++
    })
}

onMounted(() => {
    styleElement = document.createElement('style')
    styleElement.setAttribute('data-csscraft-animation', '')
    document.head.appendChild(styleElement)

    updatePreviewStyles()
})

watch(
    keyframes,
    () => {
        updatePreviewStyles()
    },
    { flush: 'post' }
)

onBeforeUnmount(() => {
    if (styleElement) {
        styleElement.remove()
        styleElement = null
    }
})
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
                            Animation Generator
                        </h1>

                        <p
                            class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-gray-400"
                        >
                            Create CSS animations visually with live preview,
                            customizable transforms, timing and animation controls.
                        </p>
                    </div>

                    <div class="flex flex-wrap gap-3">
                        <button
                            type="button"
                            @click="reset"
                            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <RotateCcw class="h-4 w-4" />
                            Reset
                        </button>

                        <button
                            type="button"
                            @click="exportHtml"
                            class="inline-flex items-center gap-2 rounded-xl bg-[#17447f] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#123968]"
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
                        class="grid grid-cols-2 border-b border-slate-200 dark:border-gray-800"
                    >
                        <button
                            type="button"
                            @click="activeTab = 'controls'"
                            :class="[
                                'flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium transition',
                                activeTab === 'controls'
                                    ? 'border-b-2 border-cyan-500 bg-cyan-50/50 text-[#167fa8] dark:bg-cyan-950/30 dark:text-cyan-400'
                                    : 'text-slate-500 hover:bg-slate-50 dark:text-gray-400 dark:hover:bg-gray-800',
                            ]"
                        >
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
                                    : 'text-slate-500 hover:bg-slate-50 dark:text-gray-400 dark:hover:bg-gray-800',
                            ]"
                        >
                            <Code2 class="h-3.5 w-3.5" />
                            CSS
                        </button>
                    </div>

                    <!-- Controls -->
                    <div v-if="activeTab === 'controls'" class="p-5">
                        <div class="mb-6 flex items-center gap-3">
                            <div
                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400"
                            >
                                <WandSparkles class="h-5 w-5" />
                            </div>

                            <div>
                                <h2
                                    class="text-sm font-semibold text-[#10233f] dark:text-gray-100"
                                >
                                    Animation Settings
                                </h2>

                                <p class="text-xs text-slate-500 dark:text-gray-400">
                                    Customize your animation
                                </p>
                            </div>
                        </div>

                        <!-- Animation Name -->
                        <div>
                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                            >
                                Animation Name
                            </label>

                            <input
                                v-model="settings.animationName"
                                type="text"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-900/40"
                                placeholder="my-animation"
                            />
                        </div>

                        <!-- Preview Text -->
                        <div class="mt-5">
                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                            >
                                Preview Text
                            </label>

                            <textarea
                                v-model="settings.previewText"
                                rows="3"
                                class="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-900/40"
                                placeholder="Enter preview text..."
                            />
                        </div>

                        <!-- Duration -->
                        <div class="mt-6">
                            <label
                                class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                            >
                                <span>Duration</span>
                                <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                    {{ settings.duration }}s
                                </span>
                            </label>

                            <input
                                v-model.number="settings.duration"
                                type="range"
                                min="0.1"
                                max="10"
                                step="0.1"
                                class="w-full accent-cyan-500"
                            />
                        </div>

                        <!-- Timing -->
                        <div class="mt-6">
                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                            >
                                Timing Function
                            </label>

                            <select
                                v-model="settings.timingFunction"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-900/40"
                            >
                                <option
                                    v-for="timing in timingFunctions"
                                    :key="timing.value"
                                    :value="timing.value"
                                >
                                    {{ timing.label }}
                                </option>
                            </select>
                        </div>

                        <!-- Delay -->
                        <div class="mt-6">
                            <label
                                class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                            >
                                <span>Delay</span>
                                <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                    {{ settings.delay }}s
                                </span>
                            </label>

                            <input
                                v-model.number="settings.delay"
                                type="range"
                                min="0"
                                max="5"
                                step="0.1"
                                class="w-full accent-cyan-500"
                            />
                        </div>

                        <!-- Iteration -->
                        <div class="mt-6">
                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                            >
                                Iteration Count
                            </label>

                            <select
                                v-model="settings.iterationCount"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-900/40"
                            >
                                <option
                                    v-for="option in iterationOptions"
                                    :key="option.value"
                                    :value="option.value"
                                >
                                    {{ option.label }}
                                </option>
                            </select>
                        </div>

                        <!-- Direction -->
                        <div class="mt-5">
                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                            >
                                Direction
                            </label>

                            <select
                                v-model="settings.direction"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-900/40"
                            >
                                <option
                                    v-for="direction in directions"
                                    :key="direction.value"
                                    :value="direction.value"
                                >
                                    {{ direction.label }}
                                </option>
                            </select>
                        </div>

                        <!-- Fill -->
                        <div class="mt-5">
                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                            >
                                Fill Mode
                            </label>

                            <select
                                v-model="settings.fillMode"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-900/40"
                            >
                                <option
                                    v-for="mode in fillModes"
                                    :key="mode.value"
                                    :value="mode.value"
                                >
                                    {{ mode.label }}
                                </option>
                            </select>
                        </div>

                        <!-- Play State -->
                        <div class="mt-5">
                            <label
                                class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                            >
                                Play State
                            </label>

                            <div class="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    @click="settings.playState = 'running'"
                                    :class="[
                                        'rounded-lg border px-3 py-2.5 text-xs font-medium transition',
                                        settings.playState === 'running'
                                            ? 'border-cyan-400 bg-cyan-50 text-[#167fa8] dark:border-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400'
                                            : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800',
                                    ]"
                                >
                                    Running
                                </button>

                                <button
                                    type="button"
                                    @click="settings.playState = 'paused'"
                                    :class="[
                                        'rounded-lg border px-3 py-2.5 text-xs font-medium transition',
                                        settings.playState === 'paused'
                                            ? 'border-cyan-400 bg-cyan-50 text-[#167fa8] dark:border-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400'
                                            : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800',
                                    ]"
                                >
                                    Paused
                                </button>
                            </div>
                        </div>

                        <!-- Transform -->
                        <div class="mt-6">
                            <label
                                class="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                            >
                                Transform
                            </label>

                            <!-- X -->
                            <div class="mt-3">
                                <label
                                    class="mb-2 flex justify-between text-[10px] font-medium text-slate-500 dark:text-gray-400"
                                >
                                    <span>Translate X</span>
                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
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

                            <!-- Y -->
                            <div class="mt-4">
                                <label
                                    class="mb-2 flex justify-between text-[10px] font-medium text-slate-500 dark:text-gray-400"
                                >
                                    <span>Translate Y</span>
                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
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

                            <!-- Scale -->
                            <div class="mt-4">
                                <label
                                    class="mb-2 flex justify-between text-[10px] font-medium text-slate-500 dark:text-gray-400"
                                >
                                    <span>Scale</span>
                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                        {{ settings.scale }}
                                    </span>
                                </label>

                                <input
                                    v-model.number="settings.scale"
                                    type="range"
                                    min="0.2"
                                    max="2"
                                    step="0.1"
                                    class="w-full accent-cyan-500"
                                />
                            </div>

                            <!-- Rotate -->
                            <div class="mt-4">
                                <label
                                    class="mb-2 flex justify-between text-[10px] font-medium text-slate-500 dark:text-gray-400"
                                >
                                    <span>Rotate</span>
                                    <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                        {{ settings.rotate }}°
                                    </span>
                                </label>

                                <input
                                    v-model.number="settings.rotate"
                                    type="range"
                                    min="-360"
                                    max="360"
                                    class="w-full accent-cyan-500"
                                />
                            </div>
                        </div>

                        <!-- Opacity -->
                        <div class="mt-6">
                            <label
                                class="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400"
                            >
                                <span>Final Opacity</span>
                                <span class="font-mono text-[#167fa8] dark:text-cyan-400">
                                    {{ settings.opacity }}
                                </span>
                            </label>

                            <input
                                v-model.number="settings.opacity"
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                class="w-full accent-cyan-500"
                            />
                        </div>

                        <!-- Current -->
                        <div
                            class="mt-6 rounded-xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-900/60 dark:bg-cyan-950/30"
                        >
                            <p
                                class="text-[10px] font-semibold uppercase tracking-wider text-[#167fa8] dark:text-cyan-400"
                            >
                                Current Animation
                            </p>

                            <p
                                class="mt-1 break-words text-sm font-semibold text-[#10233f] dark:text-gray-200"
                            >
                                {{ safeAnimationName }}
                            </p>

                            <p
                                class="mt-1 text-xs text-[#2b6b86] dark:text-cyan-300/70"
                            >
                                {{ animationDescription }}
                            </p>
                        </div>
                    </div>

                    <!-- CSS Tab -->
                    <div v-else class="p-5">
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

                                <p class="text-xs text-slate-500 dark:text-gray-400">
                                    Based on your animation settings
                                </p>
                            </div>
                        </div>

                        <pre
                            class="overflow-auto rounded-xl bg-[#101827] p-4 text-xs leading-6 text-slate-200"
                        ><code>{{ generatedCss }}</code></pre>

                        <button
                            type="button"
                            @click="copyText(generatedCss, 'css')"
                            class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#17447f] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#123968]"
                        >
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
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#1686ac] dark:bg-cyan-950/40 dark:text-cyan-400"
                                >
                                    <WandSparkles class="h-5 w-5" />
                                </div>

                                <div>
                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-gray-100"
                                    >
                                        Animation Preview
                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-gray-400">
                                        {{ animationDescription }}
                                    </p>
                                </div>
                            </div>

                            <div class="flex items-center gap-2">
                                <span
                                    class="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400"
                                >
                                    @keyframes
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

                        <!-- Preview body -->
                        <div
                            class="border-b border-slate-200 bg-[#f8fafc] p-6 dark:border-gray-800 dark:bg-gray-950 sm:p-10"
                        >
                            <div
                                class="mb-5 rounded-xl border border-cyan-200 bg-cyan-50/70 px-4 py-3 dark:border-cyan-900/60 dark:bg-cyan-950/30"
                            >
                                <div class="flex items-start gap-3">
                                    <SlidersHorizontal
                                        class="mt-0.5 h-4 w-4 shrink-0 text-[#167fa8] dark:text-cyan-400"
                                    />

                                    <div>
                                        <p
                                            class="text-xs font-semibold text-[#167fa8] dark:text-cyan-400"
                                        >
                                            Live Animation Editor
                                        </p>

                                        <p
                                            class="mt-1 text-xs leading-5 text-[#2b6b86] dark:text-cyan-300/70"
                                        >
                                            Adjust the animation controls and watch
                                            the preview update instantly.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                class="rounded-xl border border-dashed border-slate-300 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
                            >
                                <div
                                    class="flex min-h-[430px] items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900 sm:p-12"
                                >
                                    <div
                                        :key="previewKey"
                                        class="flex h-32 w-full max-w-xl items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 px-6 text-center text-xl font-semibold text-[#17447f] dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-300"
                                        :style="previewStyle"
                                    >
                                        {{ settings.previewText }}
                                    </div>
                                </div>
                            </div>

                            <div class="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    @click="replayAnimation"
                                    class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400"
                                >
                                    <RotateCcw class="h-3.5 w-3.5" />
                                    Replay Animation
                                </button>
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
                                    Duration
                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200"
                                >
                                    {{ settings.duration }}s
                                </p>
                            </div>

                            <div class="p-4">
                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    Timing
                                </p>

                                <p
                                    class="mt-1 truncate text-xs font-semibold text-[#10233f] dark:text-gray-200"
                                >
                                    {{ settings.timingFunction }}
                                </p>
                            </div>

                            <div class="p-4">
                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    Iterations
                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-[#10233f] dark:text-gray-200"
                                >
                                    {{ settings.iterationCount }}
                                </p>
                            </div>

                            <div class="p-4">
                                <p
                                    class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                                >
                                    Status
                                </p>

                                <p
                                    class="mt-1 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                                >
                                    Active
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

                                    <p class="text-xs text-slate-500 dark:text-gray-400">
                                        Your complete animation CSS.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                @click="copyText(generatedCss, 'generated-css')"
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
                            class="overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"
                        ><code>{{ generatedCss }}</code></pre>
                    </section>

                    <!-- Generated HTML -->
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
                                    <FileCode2 class="h-4 w-4" />
                                </div>

                                <div>
                                    <h2
                                        class="text-sm font-semibold text-[#10233f] dark:text-gray-100"
                                    >
                                        Generated HTML
                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-gray-400">
                                        HTML structure for the animation.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                @click="copyText(generatedHtml, 'html')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-[#167fa8] dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400"
                            >
                                <Check
                                    v-if="copied === 'html'"
                                    class="h-3.5 w-3.5 text-emerald-500"
                                />
                                <Copy v-else class="h-3.5 w-3.5" />

                                {{ copied === 'html' ? 'Copied' : 'Copy HTML' }}
                            </button>
                        </div>

                        <pre
                            class="overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"
                        ><code>{{ generatedHtml }}</code></pre>
                    </section>

                    <!-- Complete Code -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
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

                                    <p class="text-xs text-slate-500 dark:text-gray-400">
                                        Ready-to-use HTML and CSS.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                @click="copyText(completeCode, 'complete')"
                                class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#17447f] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#123968]"
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
                </div>
            </div>
        </section>
    </main>
</template>
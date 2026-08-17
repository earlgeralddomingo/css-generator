<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import {
    AlertCircle,
    Check,
    ChevronDown,
    Code2,
    Copy,
    Download,
    FileJson,
    Filter,
    History,
    Palette,
    Plus,
    Redo2,
    RotateCcw,
    Search,
    Settings2,
    SlidersHorizontal,
    Sparkles,
    Trash2,
    Undo2,
    Upload,
    WandSparkles,
    X,
} from 'lucide-vue-next'

const copied = ref('')
const searchQuery = ref('')
const selectedCategory = ref('All')
const selectedType = ref('All')
const sortBy = ref('order')
const showDisabled = ref(true)
const variableId = ref(6)
const themeName = ref('Default Theme')
const showThemeEditor = ref(false)
const showFilters = ref(false)

const historyStack = ref([])
const historyIndex = ref(-1)

const categories = [
    'All',
    'Colors',
    'Spacing',
    'Typography',
    'Borders',
    'Effects',
    'Layout',
    'Custom',
]

const types = [
    'All',
    'color',
    'length',
    'number',
    'font-weight',
    'text',
    'shadow',
    'duration',
    'percentage',
]

const variables = ref([
    {
        id: 1,
        name: '--primary-color',
        value: '#167fa8',
        type: 'color',
        category: 'Colors',
        description: 'Primary brand color',
        enabled: true,
    },
    {
        id: 2,
        name: '--secondary-color',
        value: '#10233f',
        type: 'color',
        category: 'Colors',
        description: 'Secondary brand color',
        enabled: true,
    },
    {
        id: 3,
        name: '--surface-color',
        value: '#ffffff',
        type: 'color',
        category: 'Colors',
        description: 'Main surface color',
        enabled: true,
    },
    {
        id: 4,
        name: '--spacing-md',
        value: '1rem',
        type: 'length',
        category: 'Spacing',
        description: 'Default medium spacing',
        enabled: true,
    },
    {
        id: 5,
        name: '--border-radius',
        value: '0.75rem',
        type: 'length',
        category: 'Borders',
        description: 'Default component radius',
        enabled: true,
    },
])

const themes = ref([
    {
        name: 'Default Theme',
        variables: JSON.parse(JSON.stringify(variables.value)),
    },
])

const selectedTheme = ref('Default Theme')

const unitOptions = [
    'px',
    'rem',
    'em',
    '%',
    'vh',
    'vw',
    'vmin',
    'vmax',
    'ch',
    's',
    'ms',
]

const defaultVariables = JSON.parse(JSON.stringify(variables.value))

const snapshot = () =>
    JSON.stringify({
        variables: variables.value,
        variableId: variableId.value,
    })

const restoreSnapshot = (value) => {
    const parsed = JSON.parse(value)

    variables.value = parsed.variables
    variableId.value = parsed.variableId
}

const saveHistory = () => {
    const current = snapshot()

    if (
        historyIndex.value >= 0 &&
        historyStack.value[historyIndex.value] === current
    ) {
        return
    }

    historyStack.value = historyStack.value.slice(
        0,
        historyIndex.value + 1,
    )

    historyStack.value.push(current)
    historyIndex.value = historyStack.value.length - 1
}

const undo = () => {
    if (historyIndex.value <= 0) {
        return
    }

    historyIndex.value--
    restoreSnapshot(historyStack.value[historyIndex.value])
}

const redo = () => {
    if (
        historyIndex.value < 0 ||
        historyIndex.value >= historyStack.value.length - 1
    ) {
        return
    }

    historyIndex.value++
    restoreSnapshot(historyStack.value[historyIndex.value])
}

saveHistory()

const filteredVariables = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()

    const result = variables.value.filter((variable) => {
        const matchesCategory =
            selectedCategory.value === 'All' ||
            variable.category === selectedCategory.value

        const matchesType =
            selectedType.value === 'All' ||
            variable.type === selectedType.value

        const matchesSearch =
            !query ||
            variable.name.toLowerCase().includes(query) ||
            variable.value.toLowerCase().includes(query) ||
            variable.description.toLowerCase().includes(query)

        const matchesEnabled =
            showDisabled.value || variable.enabled

        return (
            matchesCategory &&
            matchesType &&
            matchesSearch &&
            matchesEnabled
        )
    })

    return [...result].sort((a, b) => {
        if (sortBy.value === 'name') {
            return a.name.localeCompare(b.name)
        }

        if (sortBy.value === 'category') {
            return a.category.localeCompare(b.category)
        }

        if (sortBy.value === 'type') {
            return a.type.localeCompare(b.type)
        }

        return a.id - b.id
    })
})

const enabledVariables = computed(() =>
    variables.value.filter((variable) => variable.enabled),
)

const generatedCss = computed(() => {
    const grouped = {}

    enabledVariables.value.forEach((variable) => {
        if (!grouped[variable.category]) {
            grouped[variable.category] = []
        }

        grouped[variable.category].push(variable)
    })

    const lines = [':root {']

    Object.entries(grouped).forEach(([category, items]) => {
        lines.push(`    /* ${category} */`)

        items.forEach((variable) => {
            if (variable.description) {
                lines.push(`    /* ${variable.description} */`)
            }

            lines.push(
                `    ${variable.name}: ${variable.value};`,
            )
        })

        lines.push('')
    })

    if (lines[lines.length - 1] === '') {
        lines.pop()
    }

    lines.push('}')

    return lines.join('\n')
})

const generatedMinifiedCss = computed(() => {
    return `:root{${enabledVariables.value
        .map(
            (variable) =>
                `${variable.name}:${variable.value}`,
        )
        .join(';')}}`
})

const previewStyle = computed(() => {
    const styles = {}

    enabledVariables.value.forEach((variable) => {
        if (
            variable.name &&
            variable.name.startsWith('--') &&
            variable.value
        ) {
            styles[variable.name] = variable.value
        }
    })

    return styles
})

const variableCount = computed(() => variables.value.length)

const enabledCount = computed(
    () => enabledVariables.value.length,
)

const colorVariables = computed(() =>
    enabledVariables.value.filter(
        (variable) => variable.type === 'color',
    ),
)

const invalidVariables = computed(() =>
    variables.value.filter(
        (variable) =>
            !/^--[a-zA-Z0-9_-]+$/.test(variable.name),
    ),
)

const duplicateNames = computed(() => {
    const names = variables.value.map((variable) => variable.name)
    const duplicates = names.filter(
        (name, index) => names.indexOf(name) !== index,
    )

    return [...new Set(duplicates)]
})

const validationCount = computed(
    () =>
        invalidVariables.value.length +
        duplicateNames.value.length,
)

const typeLabel = (type) => {
    const labels = {
        color: 'Color',
        length: 'Length',
        number: 'Number',
        'font-weight': 'Font Weight',
        text: 'Text',
        shadow: 'Shadow',
        duration: 'Duration',
        percentage: 'Percentage',
    }

    return labels[type] || type
}

const getNumericValue = (value) => {
    const match = String(value).match(
        /^(-?\d*\.?\d+)/,
    )

    return match ? Number(match[1]) : 0
}

const getUnit = (value) => {
    const match = String(value).match(
        /^-?\d*\.?\d+\s*(.*)$/,
    )

    return match?.[1]?.trim() || 'px'
}

const updateNumericValue = (variable, event) => {
    const number = event.target.value
    const unit = getUnit(variable.value)

    variable.value = `${number}${unit}`
}

const updateUnit = (variable, event) => {
    const number = getNumericValue(variable.value)

    variable.value = `${number}${event.target.value}`
}

const updateType = (variable) => {
    const defaults = {
        color: '#167fa8',
        length: '1rem',
        number: '1',
        'font-weight': '500',
        text: 'value',
        shadow: '0 4px 12px rgba(0,0,0,0.12)',
        duration: '300ms',
        percentage: '100%',
    }

    variable.value =
        defaults[variable.type] || 'value'

    if (
        variable.type === 'color' &&
        variable.category === 'Custom'
    ) {
        variable.category = 'Colors'
    }

    if (
        variable.type === 'shadow' &&
        variable.category === 'Custom'
    ) {
        variable.category = 'Effects'
    }

    saveHistory()
}

const addVariable = (type = 'text') => {
    const id = variableId.value++

    const defaults = {
        color: {
            value: '#167fa8',
            category: 'Colors',
        },
        length: {
            value: '1rem',
            category: 'Spacing',
        },
        number: {
            value: '1',
            category: 'Custom',
        },
        'font-weight': {
            value: '500',
            category: 'Typography',
        },
        text: {
            value: 'value',
            category: 'Custom',
        },
        shadow: {
            value: '0 4px 12px rgba(0,0,0,0.12)',
            category: 'Effects',
        },
        duration: {
            value: '300ms',
            category: 'Effects',
        },
        percentage: {
            value: '100%',
            category: 'Layout',
        },
    }

    const config = defaults[type] || defaults.text

    variables.value.push({
        id,
        name: `--custom-variable-${id}`,
        value: config.value,
        type,
        category: config.category,
        description: 'Custom CSS variable',
        enabled: true,
    })

    selectedCategory.value = 'All'

    saveHistory()

    nextTick(() => {
        document
            .querySelector(
                `input[value="--custom-variable-${id}"]`,
            )
            ?.focus()
    })
}

const removeVariable = (id) => {
    variables.value = variables.value.filter(
        (variable) => variable.id !== id,
    )

    saveHistory()
}

const duplicateVariable = (variable) => {
    const id = variableId.value++

    variables.value.push({
        ...JSON.parse(JSON.stringify(variable)),
        id,
        name: `${variable.name}-copy`,
        description: variable.description
            ? `${variable.description} copy`
            : '',
    })

    saveHistory()
}

const reset = () => {
    variables.value = JSON.parse(
        JSON.stringify(defaultVariables),
    )

    searchQuery.value = ''
    selectedCategory.value = 'All'
    selectedType.value = 'All'
    sortBy.value = 'order'
    copied.value = ''
    variableId.value = 6

    saveHistory()
}

const resetFilters = () => {
    searchQuery.value = ''
    selectedCategory.value = 'All'
    selectedType.value = 'All'
    sortBy.value = 'order'
}

const copyText = async (text, id = 'css') => {
    try {
        await navigator.clipboard.writeText(text)

        copied.value = id

        window.setTimeout(() => {
            if (copied.value === id) {
                copied.value = ''
            }
        }, 1500)
    } catch {
        copied.value = ''
    }
}

const copyVariable = (variable) => {
    copyText(
        `${variable.name}: ${variable.value};`,
        variable.id,
    )
}

const downloadFile = (
    content,
    filename,
    type,
) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
}

const exportCss = () => {
    downloadFile(
        generatedCss.value,
        'variables.css',
        'text/css',
    )
}

const exportMinifiedCss = () => {
    downloadFile(
        generatedMinifiedCss.value,
        'variables.min.css',
        'text/css',
    )
}

const exportJson = () => {
    const data = JSON.stringify(
        {
            name: themeName.value,
            variables: variables.value,
        },
        null,
        4,
    )

    downloadFile(
        data,
        'variables.json',
        'application/json',
    )
}

const importCss = () => {
    const input = document.createElement('input')

    input.type = 'file'
    input.accept = '.css,text/css'

    input.addEventListener('change', (event) => {
        const file = event.target.files?.[0]

        if (!file) {
            return
        }

        const reader = new FileReader()

        reader.onload = () => {
            const css = String(reader.result || '')

            const matches = css.match(
                /(--[\w-]+)\s*:\s*([^;}\n]+)\s*;/g,
            )

            if (!matches) {
                return
            }

            const importedVariables = matches.map(
                (entry) => {
                    const match = entry.match(
                        /(--[\w-]+)\s*:\s*([^;}\n]+)\s*;/,
                    )

                    const name =
                        match?.[1] ||
                        `--imported-${variableId.value}`

                    const value =
                        match?.[2]?.trim() || ''

                    const type =
                        /^#|^rgb|^hsl|^oklch|^color/i.test(
                            value,
                        )
                            ? 'color'
                            : /^-?\d*\.?\d+(px|rem|em|%|vh|vw|vmin|vmax)$/.test(
                                  value,
                              )
                              ? 'length'
                              : /^-?\d*\.?\d+$/.test(
                                      value,
                                  )
                                ? 'number'
                                : 'text'

                    return {
                        id: variableId.value++,
                        name,
                        value,
                        type,
                        category:
                            type === 'color'
                                ? 'Colors'
                                : type === 'length'
                                  ? 'Spacing'
                                  : 'Custom',
                        description:
                            'Imported CSS variable',
                        enabled: true,
                    }
                },
            )

            variables.value = importedVariables
            selectedCategory.value = 'All'
            searchQuery.value = ''

            saveHistory()
        }

        reader.readAsText(file)
    })

    input.click()
}

const importJson = () => {
    const input = document.createElement('input')

    input.type = 'file'
    input.accept = '.json,application/json'

    input.addEventListener('change', (event) => {
        const file = event.target.files?.[0]

        if (!file) {
            return
        }

        const reader = new FileReader()

        reader.onload = () => {
            try {
                const parsed = JSON.parse(
                    String(reader.result || ''),
                )

                const imported =
                    Array.isArray(parsed)
                        ? parsed
                        : parsed.variables

                if (!Array.isArray(imported)) {
                    return
                }

                variables.value = imported.map(
                    (variable) => ({
                        id: variableId.value++,
                        name:
                            variable.name ||
                            `--imported-${variableId.value}`,
                        value:
                            variable.value || '',
                        type:
                            variable.type || 'text',
                        category:
                            variable.category ||
                            'Custom',
                        description:
                            variable.description || '',
                        enabled:
                            variable.enabled !== false,
                    }),
                )

                themeName.value =
                    parsed.name || 'Imported Theme'

                selectedCategory.value = 'All'
                searchQuery.value = ''

                saveHistory()
            } catch {
                console.error(
                    'Invalid JSON variable file.',
                )
            }
        }

        reader.readAsText(file)
    })

    input.click()
}

const createTheme = () => {
    const name = themeName.value.trim()

    if (!name) {
        return
    }

    const existing = themes.value.find(
        (theme) => theme.name === name,
    )

    if (existing) {
        existing.variables = JSON.parse(
            JSON.stringify(variables.value),
        )
    } else {
        themes.value.push({
            name,
            variables: JSON.parse(
                JSON.stringify(variables.value),
            ),
        })
    }

    selectedTheme.value = name
    showThemeEditor.value = false
}

const loadTheme = (name) => {
    const theme = themes.value.find(
        (item) => item.name === name,
    )

    if (!theme) {
        return
    }

    variables.value = JSON.parse(
        JSON.stringify(theme.variables),
    )

    themeName.value = theme.name
    selectedTheme.value = theme.name

    saveHistory()
}

const deleteTheme = (name) => {
    if (themes.value.length <= 1) {
        return
    }

    themes.value = themes.value.filter(
        (theme) => theme.name !== name,
    )

    selectedTheme.value = themes.value[0].name
}

const handleThemeChange = () => {
    loadTheme(selectedTheme.value)
}

const toggleVariable = (variable) => {
    variable.enabled = !variable.enabled
    saveHistory()
}

const clearAll = () => {
    variables.value = []
    saveHistory()
}

const addPreset = (preset) => {
    const presets = {
        modern: [
            {
                name: '--primary-color',
                value: '#167fa8',
                type: 'color',
                category: 'Colors',
                description: 'Primary brand color',
            },
            {
                name: '--secondary-color',
                value: '#10233f',
                type: 'color',
                category: 'Colors',
                description: 'Secondary brand color',
            },
            {
                name: '--surface-color',
                value: '#ffffff',
                type: 'color',
                category: 'Colors',
                description: 'Surface color',
            },
            {
                name: '--spacing-md',
                value: '1rem',
                type: 'length',
                category: 'Spacing',
                description: 'Medium spacing',
            },
            {
                name: '--border-radius',
                value: '0.75rem',
                type: 'length',
                category: 'Borders',
                description: 'Default radius',
            },
            {
                name: '--shadow-card',
                value:
                    '0 10px 30px rgba(16,35,63,0.12)',
                type: 'shadow',
                category: 'Effects',
                description: 'Card shadow',
            },
        ],

        dark: [
            {
                name: '--primary-color',
                value: '#38bdf8',
                type: 'color',
                category: 'Colors',
                description: 'Primary accent',
            },
            {
                name: '--secondary-color',
                value: '#0f172a',
                type: 'color',
                category: 'Colors',
                description: 'Secondary background',
            },
            {
                name: '--surface-color',
                value: '#111827',
                type: 'color',
                category: 'Colors',
                description: 'Surface color',
            },
            {
                name: '--text-color',
                value: '#f8fafc',
                type: 'color',
                category: 'Typography',
                description: 'Main text',
            },
            {
                name: '--border-radius',
                value: '0.75rem',
                type: 'length',
                category: 'Borders',
                description: 'Default radius',
            },
        ],

        pastel: [
            {
                name: '--primary-color',
                value: '#7c83fd',
                type: 'color',
                category: 'Colors',
                description: 'Primary pastel',
            },
            {
                name: '--secondary-color',
                value: '#a8d8ea',
                type: 'color',
                category: 'Colors',
                description: 'Secondary pastel',
            },
            {
                name: '--surface-color',
                value: '#fff9f5',
                type: 'color',
                category: 'Colors',
                description: 'Soft surface',
            },
            {
                name: '--border-radius',
                value: '1rem',
                type: 'length',
                category: 'Borders',
                description: 'Rounded components',
            },
        ],
    }

    const selectedPreset = presets[preset]

    if (!selectedPreset) {
        return
    }

    variables.value = selectedPreset.map(
        (variable) => ({
            ...variable,
            id: variableId.value++,
            enabled: true,
        }),
    )

    saveHistory()
}

const onKeydown = (event) => {
    const modifier = event.ctrlKey || event.metaKey

    if (!modifier) {
        return
    }

    if (event.key.toLowerCase() === 'z') {
        event.preventDefault()

        if (event.shiftKey) {
            redo()
        } else {
            undo()
        }
    }

    if (event.key.toLowerCase() === 'y') {
        event.preventDefault()
        redo()
    }

    if (event.key.toLowerCase() === 's') {
        event.preventDefault()
        exportCss()
    }
}

watch(
    variables,
    () => {
        const current = snapshot()

        if (
            historyIndex.value < 0 ||
            historyStack.value[
                historyIndex.value
            ] !== current
        ) {
            historyStack.value = historyStack.value.slice(
                0,
                historyIndex.value + 1,
            )

            historyStack.value.push(current)
            historyIndex.value =
                historyStack.value.length - 1
        }
    },
    { deep: true },
)

watch(
    () => themeName.value,
    (value) => {
        if (!value.trim()) {
            themeName.value = 'Default Theme'
        }
    },
)
</script>

<template>
    <main
        class="min-h-screen bg-[#f8fafc] text-[#10233f] transition-colors dark:bg-gray-950 dark:text-gray-100"
        @keydown="onKeydown"
    >
        <!-- Header -->
        <section
            class="border-b border-slate-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        >
            <div
                class="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8"
            >
                <div
                    class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between"
                >
                    <div>
                        <div
                            class="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#167fa8] dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-400"
                        >
                            <Sparkles
                                class="h-3.5 w-3.5"
                            />
                            CSS Builder
                        </div>

                        <h1
                            class="text-3xl font-bold tracking-tight text-[#10233f] dark:text-gray-100 sm:text-4xl"
                        >
                            CSS Variables Generator
                        </h1>

                        <p
                            class="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-gray-400"
                        >
                            Build, organize, validate, preview,
                            import and export production-ready
                            CSS custom properties.
                        </p>

                        <div
                            class="mt-4 flex flex-wrap gap-2 text-[11px]"
                        >
                            <span
                                class="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600 dark:bg-gray-800 dark:text-gray-300"
                            >
                                {{ variableCount }}
                                variables
                            </span>

                            <span
                                class="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                            >
                                {{ enabledCount }}
                                active
                            </span>

                            <span
                                v-if="validationCount"
                                class="rounded-full bg-red-50 px-2.5 py-1 font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400"
                            >
                                {{ validationCount }}
                                issue{{
                                    validationCount === 1
                                        ? ''
                                        : 's'
                                }}
                            </span>
                        </div>
                    </div>

                    <div
                        class="flex flex-wrap gap-2"
                    >
                        <button
                            type="button"
                            @click="undo"
                            :disabled="
                                historyIndex <= 0
                            "
                            title="Undo (Ctrl+Z)"
                            class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-cyan-300 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400"
                        >
                            <Undo2 class="h-4 w-4" />
                            <span class="hidden sm:inline">
                                Undo
                            </span>
                        </button>

                        <button
                            type="button"
                            @click="redo"
                            :disabled="
                                historyIndex >=
                                historyStack.length - 1
                            "
                            title="Redo (Ctrl+Y)"
                            class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-cyan-300 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400"
                        >
                            <Redo2 class="h-4 w-4" />
                            <span class="hidden sm:inline">
                                Redo
                            </span>
                        </button>

                        <button
                            type="button"
                            @click="importCss"
                            class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-[#167fa8] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/30 dark:hover:text-cyan-400"
                        >
                            <Upload class="h-4 w-4" />
                            Import
                        </button>

                        <button
                            type="button"
                            @click="exportCss"
                            class="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 dark:bg-cyan-500 dark:text-gray-950 dark:hover:bg-cyan-400"
                        >
                            <Download class="h-4 w-4" />
                            Export CSS
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Toolbar -->
        <section
            class="border-b border-slate-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        >
            <div
                class="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"
            >
                <div
                    class="flex min-w-0 flex-1 flex-wrap gap-2"
                >
                    <div
                        class="relative min-w-[220px] flex-1 lg:max-w-md"
                    >
                        <Search
                            class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            v-model="searchQuery"
                            type="search"
                            placeholder="Search variables, values, descriptions..."
                            class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-cyan-600"
                        />
                    </div>

                    <button
                        type="button"
                        @click="
                            showFilters = !showFilters
                        "
                        class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-cyan-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400"
                    >
                        <Filter class="h-4 w-4" />
                        Filters
                    </button>
                </div>

                <div
                    class="flex flex-wrap items-center gap-2"
                >
                    <select
                        v-model="selectedCategory"
                        class="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600 outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    >
                        <option
                            v-for="category in categories"
                            :key="category"
                            :value="category"
                        >
                            {{ category }}
                        </option>
                    </select>

                    <select
                        v-model="sortBy"
                        class="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600 outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    >
                        <option value="order">
                            Original order
                        </option>
                        <option value="name">
                            Name
                        </option>
                        <option value="category">
                            Category
                        </option>
                        <option value="type">
                            Type
                        </option>
                    </select>

                    <button
                        type="button"
                        @click="resetFilters"
                        class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        <X class="h-3.5 w-3.5" />
                        Clear
                    </button>
                </div>
            </div>

            <div
                v-if="showFilters"
                class="border-t border-slate-200 dark:border-gray-800"
            >
                <div
                    class="mx-auto flex max-w-[1500px] flex-wrap items-center gap-2 px-4 py-3 sm:px-6 lg:px-8"
                >
                    <span
                        class="mr-1 text-[10px] font-bold uppercase tracking-wider text-slate-400"
                    >
                        Type
                    </span>

                    <button
                        v-for="type in types"
                        :key="type"
                        type="button"
                        @click="
                            selectedType = type
                        "
                        class="rounded-full px-3 py-1.5 text-[11px] font-medium transition"
                        :class="
                            selectedType === type
                                ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-400'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                        "
                    >
                        {{
                            type === 'All'
                                ? 'All types'
                                : typeLabel(type)
                        }}
                    </button>

                    <label
                        class="ml-auto flex cursor-pointer items-center gap-2 text-[11px] text-slate-500 dark:text-gray-400"
                    >
                        <input
                            v-model="showDisabled"
                            type="checkbox"
                            class="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        Show disabled
                    </label>
                </div>
            </div>
        </section>

        <!-- Workspace -->
        <section
            class="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8"
        >
            <div
                class="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]"
            >
                <!-- Sidebar -->
                <aside class="space-y-6">
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="flex items-center justify-between border-b border-slate-200 p-5 dark:border-gray-800"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400"
                                >
                                    <SlidersHorizontal
                                        class="h-5 w-5"
                                    />
                                </div>

                                <div>
                                    <h2
                                        class="text-sm font-semibold"
                                    >
                                        Variable Library
                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        {{
                                            filteredVariables.length
                                        }}
                                        visible
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                @click="addVariable()"
                                title="Add variable"
                                class="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-600 text-white transition hover:bg-cyan-700 dark:bg-cyan-500 dark:text-gray-950 dark:hover:bg-cyan-400"
                            >
                                <Plus class="h-4 w-4" />
                            </button>
                        </div>

                        <div class="p-5">
                            <p
                                class="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400"
                            >
                                Categories
                            </p>

                            <div class="space-y-1">
                                <button
                                    v-for="category in categories"
                                    :key="category"
                                    type="button"
                                    @click="
                                        selectedCategory =
                                            category
                                    "
                                    class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition"
                                    :class="
                                        selectedCategory ===
                                        category
                                            ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-cyan-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-cyan-400'
                                    "
                                >
                                    <span>
                                        {{ category }}
                                    </span>

                                    <span
                                        v-if="
                                            selectedCategory ===
                                            category
                                        "
                                        class="h-1.5 w-1.5 rounded-full bg-cyan-500"
                                    ></span>
                                </button>
                            </div>
                        </div>
                    </section>

                    <!-- Quick Add -->
                    <section
                        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="mb-4 flex items-center gap-3"
                        >
                            <div
                                class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-300"
                            >
                                <Plus class="h-4 w-4" />
                            </div>

                            <div>
                                <h2
                                    class="text-sm font-semibold"
                                >
                                    Quick Add
                                </h2>

                                <p
                                    class="text-xs text-slate-500 dark:text-gray-400"
                                >
                                    Choose a variable type
                                </p>
                            </div>
                        </div>

                        <div
                            class="grid grid-cols-2 gap-2"
                        >
                            <button
                                v-for="type in types.slice(
                                    1,
                                )"
                                :key="type"
                                type="button"
                                @click="
                                    addVariable(type)
                                "
                                class="rounded-lg border border-slate-200 px-2 py-2 text-[10px] font-medium text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 dark:border-gray-700 dark:text-gray-400 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/30 dark:hover:text-cyan-400"
                            >
                                {{ typeLabel(type) }}
                            </button>
                        </div>
                    </section>

                    <!-- Presets -->
                    <section
                        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="mb-4 flex items-center gap-3"
                        >
                            <div
                                class="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400"
                            >
                                <Sparkles
                                    class="h-4 w-4"
                                />
                            </div>

                            <div>
                                <h2
                                    class="text-sm font-semibold"
                                >
                                    Presets
                                </h2>

                                <p
                                    class="text-xs text-slate-500 dark:text-gray-400"
                                >
                                    Load a starter theme
                                </p>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <button
                                type="button"
                                @click="
                                    addPreset('modern')
                                "
                                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/30 dark:hover:text-cyan-400"
                            >
                                Modern Teal
                            </button>

                            <button
                                type="button"
                                @click="addPreset('dark')"
                                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/30 dark:hover:text-cyan-400"
                            >
                                Dark UI
                            </button>

                            <button
                                type="button"
                                @click="
                                    addPreset('pastel')
                                "
                                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/30 dark:hover:text-cyan-400"
                            >
                                Pastel
                            </button>
                        </div>
                    </section>

                    <!-- Theme -->
                    <section
                        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="mb-4 flex items-center justify-between"
                        >
                            <div
                                class="flex items-center gap-3"
                            >
                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400"
                                >
                                    <Palette
                                        class="h-4 w-4"
                                    />
                                </div>

                                <div>
                                    <h2
                                        class="text-sm font-semibold"
                                    >
                                        Themes
                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        Save variable sets
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                @click="
                                    showThemeEditor =
                                        !showThemeEditor
                                "
                                class="text-xs font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400"
                            >
                                {{
                                    showThemeEditor
                                        ? 'Close'
                                        : 'Save'
                                }}
                            </button>
                        </div>

                        <div
                            v-if="showThemeEditor"
                            class="mb-4 space-y-2"
                        >
                            <input
                                v-model="themeName"
                                type="text"
                                placeholder="Theme name"
                                class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800"
                            />

                            <button
                                type="button"
                                @click="createTheme"
                                class="w-full rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-700 dark:bg-cyan-500 dark:text-gray-950"
                            >
                                Save Theme
                            </button>
                        </div>

                        <select
                            v-model="selectedTheme"
                            @change="handleThemeChange"
                            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        >
                            <option
                                v-for="theme in themes"
                                :key="theme.name"
                                :value="theme.name"
                            >
                                {{ theme.name }}
                            </option>
                        </select>

                        <div
                            class="mt-3 flex gap-2"
                        >
                            <button
                                type="button"
                                @click="exportJson"
                                class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-[10px] font-medium text-slate-600 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                <FileJson
                                    class="h-3.5 w-3.5"
                                />
                                JSON
                            </button>

                            <button
                                v-if="themes.length > 1"
                                type="button"
                                @click="
                                    deleteTheme(
                                        selectedTheme,
                                    )
                                "
                                class="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
                            >
                                <Trash2
                                    class="h-3.5 w-3.5"
                                />
                            </button>
                        </div>
                    </section>
                </aside>

                <!-- Main -->
                <div class="min-w-0 space-y-6">
                    <!-- Variables -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400"
                                >
                                    <Settings2
                                        class="h-5 w-5"
                                    />
                                </div>

                                <div>
                                    <h2
                                        class="text-sm font-semibold"
                                    >
                                        Custom Properties
                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        {{
                                            filteredVariables.length
                                        }}
                                        of
                                        {{ variableCount }}
                                        variables
                                    </p>
                                </div>
                            </div>

                            <div
                                class="flex flex-wrap gap-2"
                            >
                                <button
                                    type="button"
                                    @click="clearAll"
                                    class="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
                                >
                                    <Trash2
                                        class="h-3.5 w-3.5"
                                    />
                                    Clear All
                                </button>

                                <button
                                    type="button"
                                    @click="addVariable()"
                                    class="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-500 dark:text-gray-950 dark:hover:bg-cyan-400"
                                >
                                    <Plus
                                        class="h-3.5 w-3.5"
                                    />
                                    Add Variable
                                </button>
                            </div>
                        </div>

                        <!-- Validation -->
                        <div
                            v-if="validationCount"
                            class="border-b border-red-100 bg-red-50 px-5 py-3 dark:border-red-900/30 dark:bg-red-950/20"
                        >
                            <div
                                class="flex items-start gap-3"
                            >
                                <AlertCircle
                                    class="mt-0.5 h-4 w-4 shrink-0 text-red-500"
                                />

                                <div>
                                    <p
                                        class="text-xs font-semibold text-red-700 dark:text-red-400"
                                    >
                                        Variable validation
                                        issues detected
                                    </p>

                                    <p
                                        v-if="
                                            invalidVariables.length
                                        "
                                        class="mt-1 text-[11px] text-red-600 dark:text-red-400"
                                    >
                                        {{
                                            invalidVariables.length
                                        }}
                                        variable name{{
                                            invalidVariables.length ===
                                            1
                                                ? ''
                                                : 's'
                                        }}
                                        are invalid. Names
                                        should begin with
                                        <code>--</code>.
                                    </p>

                                    <p
                                        v-if="
                                            duplicateNames.length
                                        "
                                        class="mt-1 text-[11px] text-red-600 dark:text-red-400"
                                    >
                                        Duplicate:
                                        {{
                                            duplicateNames.join(
                                                ', ',
                                            )
                                        }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="p-5">
                            <div
                                v-if="
                                    filteredVariables.length
                                "
                                class="space-y-3"
                            >
                                <article
                                    v-for="variable in filteredVariables"
                                    :key="variable.id"
                                    class="rounded-xl border p-4 transition"
                                    :class="
                                        variable.enabled
                                            ? 'border-slate-200 bg-slate-50 hover:border-cyan-200 dark:border-gray-800 dark:bg-gray-950/60 dark:hover:border-cyan-900'
                                            : 'border-slate-200 bg-slate-100/60 opacity-60 dark:border-gray-800 dark:bg-gray-950'
                                    "
                                >
                                    <div
                                        class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                                    >
                                        <!-- Name -->
                                        <div>
                                            <div
                                                class="mb-1.5 flex items-center justify-between"
                                            >
                                                <label
                                                    class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                                                >
                                                    Variable
                                                </label>

                                                <span
                                                    class="rounded-full bg-slate-200 px-2 py-0.5 text-[9px] font-medium text-slate-500 dark:bg-gray-800 dark:text-gray-400"
                                                >
                                                    {{
                                                        typeLabel(
                                                            variable.type,
                                                        )
                                                    }}
                                                </span>
                                            </div>

                                            <input
                                                v-model="
                                                    variable.name
                                                "
                                                type="text"
                                                :class="
                                                    invalidVariables.some(
                                                        (item) =>
                                                            item.id ===
                                                            variable.id,
                                                    )
                                                        ? 'border-red-400 focus:border-red-500'
                                                        : 'border-slate-200 focus:border-cyan-400 dark:border-gray-700 dark:focus:border-cyan-600'
                                                "
                                                class="w-full rounded-lg border bg-white px-3 py-2.5 font-mono text-xs text-slate-700 outline-none transition dark:bg-gray-900 dark:text-gray-200"
                                            />

                                            <p
                                                v-if="
                                                    invalidVariables.some(
                                                        (item) =>
                                                            item.id ===
                                                            variable.id,
                                                    )
                                                "
                                                class="mt-1 text-[9px] text-red-500"
                                            >
                                                Invalid CSS custom
                                                property name
                                            </p>
                                        </div>

                                        <!-- Value -->
                                        <div>
                                            <label
                                                class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400"
                                            >
                                                Value
                                            </label>

                                            <!-- Color -->
                                            <div
                                                v-if="
                                                    variable.type ===
                                                    'color'
                                                "
                                                class="flex gap-2"
                                            >
                                                <input
                                                    v-model="
                                                        variable.value
                                                    "
                                                    type="color"
                                                    class="h-[38px] w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900"
                                                />

                                                <input
                                                    v-model="
                                                        variable.value
                                                    "
                                                    type="text"
                                                    class="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 font-mono text-xs text-slate-700 outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-cyan-600"
                                                />
                                            </div>

                                            <!-- Length -->
                                            <div
                                                v-else-if="
                                                    variable.type ===
                                                    'length'
                                                "
                                                class="flex gap-2"
                                            >
                                                <input
                                                    :value="
                                                        getNumericValue(
                                                            variable.value,
                                                        )
                                                    "
                                                    @input="
                                                        updateNumericValue(
                                                            variable,
                                                            $event,
                                                        )
                                                    "
                                                    type="number"
                                                    step="0.1"
                                                    class="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-cyan-600"
                                                />

                                                <select
                                                    :value="
                                                        getUnit(
                                                            variable.value,
                                                        )
                                                    "
                                                    @change="
                                                        updateUnit(
                                                            variable,
                                                            $event,
                                                        )
                                                    "
                                                    class="w-20 rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                                >
                                                    <option
                                                        v-for="unit in unitOptions.slice(
                                                            0,
                                                            9,
                                                        )"
                                                        :key="unit"
                                                        :value="
                                                            unit
                                                        "
                                                    >
                                                        {{
                                                            unit
                                                        }}
                                                    </option>
                                                </select>
                                            </div>

                                            <!-- Number -->
                                            <input
                                                v-else-if="
                                                    variable.type ===
                                                    'number'
                                                "
                                                v-model="
                                                    variable.value
                                                "
                                                type="number"
                                                step="0.1"
                                                class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-cyan-600"
                                            />

                                            <!-- Font weight -->
                                            <select
                                                v-else-if="
                                                    variable.type ===
                                                    'font-weight'
                                                "
                                                v-model="
                                                    variable.value
                                                "
                                                class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-cyan-600"
                                            >
                                                <option
                                                    value="100"
                                                >
                                                    100 Thin
                                                </option>
                                                <option
                                                    value="200"
                                                >
                                                    200 Extra Light
                                                </option>
                                                <option
                                                    value="300"
                                                >
                                                    300 Light
                                                </option>
                                                <option
                                                    value="400"
                                                >
                                                    400 Regular
                                                </option>
                                                <option
                                                    value="500"
                                                >
                                                    500 Medium
                                                </option>
                                                <option
                                                    value="600"
                                                >
                                                    600 Semibold
                                                </option>
                                                <option
                                                    value="700"
                                                >
                                                    700 Bold
                                                </option>
                                                <option
                                                    value="800"
                                                >
                                                    800 Extra Bold
                                                </option>
                                                <option
                                                    value="900"
                                                >
                                                    900 Black
                                                </option>
                                            </select>

                                            <!-- Duration -->
                                            <div
                                                v-else-if="
                                                    variable.type ===
                                                    'duration'
                                                "
                                                class="flex gap-2"
                                            >
                                                <input
                                                    :value="
                                                        getNumericValue(
                                                            variable.value,
                                                        )
                                                    "
                                                    @input="
                                                        updateNumericValue(
                                                            variable,
                                                            $event,
                                                        )
                                                    "
                                                    type="number"
                                                    min="0"
                                                    class="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                                                />

                                                <select
                                                    :value="
                                                        getUnit(
                                                            variable.value,
                                                        )
                                                    "
                                                    @change="
                                                        updateUnit(
                                                            variable,
                                                            $event,
                                                        )
                                                    "
                                                    class="w-20 rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                                >
                                                    <option
                                                        value="ms"
                                                    >
                                                        ms
                                                    </option>
                                                    <option
                                                        value="s"
                                                    >
                                                        s
                                                    </option>
                                                </select>
                                            </div>

                                            <!-- Percentage -->
                                            <div
                                                v-else-if="
                                                    variable.type ===
                                                    'percentage'
                                                "
                                                class="flex items-center gap-2"
                                            >
                                                <input
                                                    v-model.number="
                                                        variable.value
                                                    "
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                                                />

                                                <span
                                                    class="text-xs font-bold text-slate-400"
                                                >
                                                    %
                                                </span>
                                            </div>

                                            <!-- Generic -->
                                            <input
                                                v-else
                                                v-model="
                                                    variable.value
                                                "
                                                type="text"
                                                class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 font-mono text-xs text-slate-700 outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-cyan-600"
                                            />
                                        </div>

                                        <!-- Actions -->
                                        <div
                                            class="flex items-end justify-end gap-2"
                                        >
                                            <button
                                                type="button"
                                                @click="
                                                    toggleVariable(
                                                        variable,
                                                    )
                                                "
                                                :title="
                                                    variable.enabled
                                                        ? 'Disable variable'
                                                        : 'Enable variable'
                                                "
                                                class="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-cyan-300 hover:text-cyan-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-cyan-700 dark:hover:text-cyan-400"
                                            >
                                                <Check
                                                    v-if="
                                                        variable.enabled
                                                    "
                                                    class="h-4 w-4 text-emerald-500"
                                                />

                                                <X
                                                    v-else
                                                    class="h-4 w-4"
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                @click="
                                                    duplicateVariable(
                                                        variable,
                                                    )
                                                "
                                                title="Duplicate"
                                                class="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-cyan-300 hover:text-cyan-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-cyan-700 dark:hover:text-cyan-400"
                                            >
                                                <Copy
                                                    class="h-4 w-4"
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                @click="
                                                    copyVariable(
                                                        variable,
                                                    )
                                                "
                                                title="Copy variable"
                                                class="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-cyan-300 hover:text-cyan-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-cyan-700 dark:hover:text-cyan-400"
                                            >
                                                <Check
                                                    v-if="
                                                        copied ===
                                                        variable.id
                                                    "
                                                    class="h-4 w-4 text-emerald-500"
                                                />

                                                <Copy
                                                    v-else
                                                    class="h-4 w-4"
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                @click="
                                                    removeVariable(
                                                        variable.id,
                                                    )
                                                "
                                                title="Delete"
                                                class="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-red-300 hover:text-red-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-red-900 dark:hover:text-red-400"
                                            >
                                                <Trash2
                                                    class="h-4 w-4"
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    <div
                                        class="mt-4 grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)_auto]"
                                    >
                                        <select
                                            v-model="
                                                variable.type
                                            "
                                            @change="
                                                updateType(
                                                    variable,
                                                )
                                            "
                                            class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                        >
                                            <option
                                                v-for="type in types.slice(
                                                    1,
                                                )"
                                                :key="type"
                                                :value="type"
                                            >
                                                {{
                                                    typeLabel(
                                                        type,
                                                    )
                                                }}
                                            </option>
                                        </select>

                                        <input
                                            v-model="
                                                variable.description
                                            "
                                            type="text"
                                            placeholder="Description..."
                                            class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-cyan-600"
                                        />

                                        <select
                                            v-model="
                                                variable.category
                                            "
                                            class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                        >
                                            <option
                                                v-for="category in categories.slice(
                                                    1,
                                                )"
                                                :key="category"
                                                :value="category"
                                            >
                                                {{
                                                    category
                                                }}
                                            </option>
                                        </select>
                                    </div>

                                    <div
                                        class="mt-3 flex flex-wrap items-center justify-between gap-2"
                                    >
                                        <span
                                            class="font-mono text-[10px] text-slate-400"
                                        >
                                            {{ variable.name }}:
                                            {{
                                                variable.value
                                            }};
                                        </span>

                                        <span
                                            v-if="
                                                variable.description
                                            "
                                            class="text-[10px] text-slate-400"
                                        >
                                            {{
                                                variable.description
                                            }}
                                        </span>
                                    </div>
                                </article>
                            </div>

                            <div
                                v-else
                                class="rounded-xl border border-dashed border-slate-300 p-12 text-center dark:border-gray-700"
                            >
                                <Search
                                    class="mx-auto h-8 w-8 text-slate-300 dark:text-gray-600"
                                />

                                <p
                                    class="mt-3 text-sm font-medium text-slate-600 dark:text-gray-300"
                                >
                                    No variables found
                                </p>

                                <p
                                    class="mt-1 text-xs text-slate-400 dark:text-gray-500"
                                >
                                    Try another search,
                                    category or variable
                                    type.
                                </p>

                                <button
                                    type="button"
                                    @click="resetFilters"
                                    class="mt-4 rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-700 dark:bg-cyan-500 dark:text-gray-950"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </section>

                    <!-- Preview -->
                    <section
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
                        >
                            <div
                                class="flex items-center gap-3"
                            >
                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400"
                                >
                                    <Sparkles
                                        class="h-5 w-5"
                                    />
                                </div>

                                <div>
                                    <h2
                                        class="text-sm font-semibold"
                                    >
                                        Live Preview
                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        Driven directly by
                                        your variables
                                    </p>
                                </div>
                            </div>

                            <span
                                class="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                            >
                                LIVE
                            </span>
                        </div>

                        <div
                            class="bg-[#f8fafc] p-5 dark:bg-gray-950 sm:p-8"
                        >
                            <div
                                :style="previewStyle"
                                class="mx-auto max-w-3xl rounded-2xl p-6 shadow-sm sm:p-8"
                                style="
                                    background-color: var(--surface-color, #ffffff);
                                    border: 1px solid var(--primary-color, #167fa8);
                                    border-radius: var(--border-radius, 0.75rem);
                                "
                            >
                                <div
                                    class="rounded-xl p-6"
                                    :style="{
                                        backgroundColor:
                                            'var(--primary-color, #167fa8)',
                                        color:
                                            'var(--surface-color, #ffffff)',
                                        borderRadius:
                                            'var(--border-radius, 0.75rem)',
                                    }"
                                >
                                    <p
                                        class="text-xs font-semibold uppercase tracking-wider opacity-75"
                                    >
                                        CSS Custom Properties
                                    </p>

                                    <h3
                                        class="mt-2 text-2xl font-bold"
                                    >
                                        Build once. Reuse
                                        everywhere.
                                    </h3>

                                    <p
                                        class="mt-2 max-w-xl text-sm leading-6 opacity-80"
                                    >
                                        Change your variables
                                        above and every
                                        component using them
                                        updates instantly.
                                    </p>

                                    <div
                                        class="mt-5 flex flex-wrap gap-2"
                                    >
                                        <button
                                            class="rounded-lg bg-white/15 px-4 py-2 text-xs font-semibold backdrop-blur transition hover:bg-white/25"
                                        >
                                            Primary Button
                                        </button>

                                        <button
                                            class="rounded-lg border border-white/30 px-4 py-2 text-xs font-semibold transition hover:bg-white/10"
                                        >
                                            Secondary
                                        </button>
                                    </div>
                                </div>

                                <div
                                    class="mt-5 grid gap-3 sm:grid-cols-3"
                                >
                                    <div
                                        v-for="variable in colorVariables.slice(
                                            0,
                                            3,
                                        )"
                                        :key="variable.id"
                                        class="rounded-xl border border-slate-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
                                    >
                                        <div
                                            class="mb-3 h-10 rounded-lg"
                                            :style="{
                                                background:
                                                    variable.value,
                                            }"
                                        ></div>

                                        <p
                                            class="truncate font-mono text-[10px] text-slate-500 dark:text-gray-400"
                                        >
                                            {{
                                                variable.name
                                            }}
                                        </p>

                                        <p
                                            class="mt-1 truncate text-xs font-semibold text-slate-700 dark:text-gray-200"
                                        >
                                            {{
                                                variable.value
                                            }}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    class="mt-5 grid gap-3 sm:grid-cols-2"
                                >
                                    <div
                                        class="rounded-xl border border-slate-200 p-4 dark:border-gray-700"
                                        :style="{
                                            borderRadius:
                                                'var(--border-radius, 0.75rem)',
                                        }"
                                    >
                                        <p
                                            class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                                        >
                                            Spacing
                                        </p>

                                        <div
                                            class="mt-3 flex items-center gap-2"
                                        >
                                            <div
                                                class="h-6 rounded bg-cyan-100 dark:bg-cyan-950/50"
                                                :style="{
                                                    width: 'var(--spacing-md, 1rem)',
                                                }"
                                            ></div>

                                            <span
                                                class="font-mono text-[10px] text-slate-500 dark:text-gray-400"
                                            >
                                                {{
                                                    variables.find(
                                                        (
                                                            variable,
                                                        ) =>
                                                            variable.name ===
                                                            '--spacing-md',
                                                    )
                                                        ?.value ||
                                                    '1rem'
                                                }}
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        class="rounded-xl border border-slate-200 p-4 dark:border-gray-700"
                                    >
                                        <p
                                            class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                                        >
                                            Status
                                        </p>

                                        <div
                                            class="mt-3 flex items-center gap-2"
                                        >
                                            <span
                                                class="h-2 w-2 rounded-full bg-emerald-500"
                                            ></span>

                                            <span
                                                class="text-xs font-medium text-slate-600 dark:text-gray-300"
                                            >
                                                {{
                                                    enabledCount
                                                }}
                                                active
                                                variables
                                            </span>
                                        </div>
                                    </div>
                                </div>
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
                            <div
                                class="flex items-center gap-3"
                            >
                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-300"
                                >
                                    <Code2
                                        class="h-4 w-4"
                                    />
                                </div>

                                <div>
                                    <h2
                                        class="text-sm font-semibold"
                                    >
                                        Generated CSS
                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        {{
                                            enabledCount
                                        }}
                                        active properties
                                    </p>
                                </div>
                            </div>

                            <div
                                class="flex flex-wrap gap-2"
                            >
                                <button
                                    type="button"
                                    @click="
                                        exportMinifiedCss
                                    "
                                    class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-cyan-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400"
                                >
                                    <Download
                                        class="h-3.5 w-3.5"
                                    />
                                    Minified
                                </button>

                                <button
                                    type="button"
                                    @click="
                                        copyText(
                                            generatedCss,
                                        )
                                    "
                                    class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:text-cyan-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-cyan-700 dark:hover:text-cyan-400"
                                >
                                    <Check
                                        v-if="
                                            copied === 'css'
                                        "
                                        class="h-3.5 w-3.5 text-emerald-500"
                                    />

                                    <Copy
                                        v-else
                                        class="h-3.5 w-3.5"
                                    />

                                    {{
                                        copied === 'css'
                                            ? 'Copied'
                                            : 'Copy CSS'
                                    }}
                                </button>
                            </div>
                        </div>

                        <div
                            class="relative overflow-hidden"
                        >
                            <pre
                                class="max-h-[500px] overflow-auto bg-[#101827] p-5 text-xs leading-6 text-slate-200"
                            ><code>{{ generatedCss }}</code></pre>
                        </div>
                    </section>

                    <!-- Import / Export -->
                    <section
                        class="grid gap-4 md:grid-cols-3"
                    >
                        <button
                            type="button"
                            @click="importCss"
                            class="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-cyan-800"
                        >
                            <Upload
                                class="h-5 w-5 text-cyan-600 dark:text-cyan-400"
                            />

                            <h3
                                class="mt-3 text-sm font-semibold"
                            >
                                Import CSS
                            </h3>

                            <p
                                class="mt-1 text-xs leading-5 text-slate-500 dark:text-gray-400"
                            >
                                Parse existing custom
                                properties from a CSS file.
                            </p>
                        </button>

                        <button
                            type="button"
                            @click="importJson"
                            class="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-cyan-800"
                        >
                            <FileJson
                                class="h-5 w-5 text-violet-600 dark:text-violet-400"
                            />

                            <h3
                                class="mt-3 text-sm font-semibold"
                            >
                                Import JSON
                            </h3>

                            <p
                                class="mt-1 text-xs leading-5 text-slate-500 dark:text-gray-400"
                            >
                                Restore a complete variable
                                workspace.
                            </p>
                        </button>

                        <button
                            type="button"
                            @click="exportJson"
                            class="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-cyan-800"
                        >
                            <Download
                                class="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                            />

                            <h3
                                class="mt-3 text-sm font-semibold"
                            >
                                Export JSON
                            </h3>

                            <p
                                class="mt-1 text-xs leading-5 text-slate-500 dark:text-gray-400"
                            >
                                Save variables,
                                categories, descriptions and
                                settings.
                            </p>
                        </button>
                    </section>

                    <!-- Keyboard shortcuts -->
                    <section
                        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div
                                class="flex items-center gap-3"
                            >
                                <div
                                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-300"
                                >
                                    <History
                                        class="h-4 w-4"
                                    />
                                </div>

                                <div>
                                    <h2
                                        class="text-sm font-semibold"
                                    >
                                        Workspace Controls
                                    </h2>

                                    <p
                                        class="text-xs text-slate-500 dark:text-gray-400"
                                    >
                                        Changes are tracked
                                        automatically.
                                    </p>
                                </div>
                            </div>

                            <div
                                class="flex flex-wrap gap-2"
                            >
                                <span
                                    class="rounded-lg bg-slate-100 px-3 py-2 text-[10px] text-slate-500 dark:bg-gray-800 dark:text-gray-400"
                                >
                                    Ctrl + Z
                                    <strong
                                        class="ml-1 text-slate-700 dark:text-gray-200"
                                    >
                                        Undo
                                    </strong>
                                </span>

                                <span
                                    class="rounded-lg bg-slate-100 px-3 py-2 text-[10px] text-slate-500 dark:bg-gray-800 dark:text-gray-400"
                                >
                                    Ctrl + Y
                                    <strong
                                        class="ml-1 text-slate-700 dark:text-gray-200"
                                    >
                                        Redo
                                    </strong>
                                </span>

                                <span
                                    class="rounded-lg bg-slate-100 px-3 py-2 text-[10px] text-slate-500 dark:bg-gray-800 dark:text-gray-400"
                                >
                                    Ctrl + S
                                    <strong
                                        class="ml-1 text-slate-700 dark:text-gray-200"
                                    >
                                        Export
                                    </strong>
                                </span>

                                <button
                                    type="button"
                                    @click="reset"
                                    class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-medium text-slate-600 transition hover:bg-slate-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    <RotateCcw
                                        class="h-3.5 w-3.5"
                                    />
                                    Reset
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    </main>
</template>
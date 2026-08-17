<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import {
    Copy,
    Check,
    RotateCcw,
    Download,
    Code2,
    Grid3X3,
    Settings2,
    Eye,
    MousePointer2,
    Plus,
    Minus,
    Palette,
    Braces,
    X,
    Paintbrush,
    Sparkles,
} from "lucide-vue-next";

const MAX_GRID_SIZE = 12;
const MIN_GRID_SIZE = 1;

const columns = ref(4);
const rows = ref(3);

const columnGap = ref(16);
const rowGap = ref(16);

const justifyItems = ref("stretch");
const alignItems = ref("stretch");

const justifyContent = ref("start");
const alignContent = ref("start");

const gridAutoFlow = ref("row");

const containerBackground = ref("#ffffff");
const containerPadding = ref(16);
const containerBorderWidth = ref(1);
const containerBorderColor = ref("#e2e8f0");
const containerBorderRadius = ref(12);
const containerShadow = ref("sm");

const areaBackground = ref("#123B7A");
const areaColor = ref("#ffffff");
const areaPadding = ref(24);
const areaBorderRadius = ref(8);
const areaTextAlign = ref("center");

const customCSS = ref("");

const importedHTML = ref("");
const importedCSS = ref("");
const useImportedContent = ref(false);
const importError = ref("");

const copied = ref(null);
const activePanel = ref("layout");
const selectedArea = ref(null);

const areaNames = ref({
    header: "Header",
    sidebar: "Sidebar",
    main: "Main",
    footer: "Footer",
});

const gridAreas = ref([
    ["header", "header", "header", "header"],
    ["sidebar", "main", "main", "main"],
    ["footer", "footer", "footer", "footer"],
]);

let importedStyleElement = null;
let copyTimeout = null;

const alignmentOptions = [
    "stretch",
    "start",
    "center",
    "end",
];

const contentOptions = [
    "start",
    "center",
    "end",
    "stretch",
    "space-between",
    "space-around",
    "space-evenly",
];

const shadowOptions = [
    "none",
    "sm",
    "md",
    "lg",
    "xl",
];

const areaColors = [
    "#123B7A",
    "#1769B0",
    "#00A8C7",
    "#7C3AED",
    "#DB2777",
    "#059669",
    "#D97706",
    "#DC2626",
];

const importedHTMLProcessed = computed(() => {
    if (!importedHTML.value.trim()) {
        return "";
    }

    try {
        const parser = new DOMParser();

        const doc = parser.parseFromString(
            importedHTML.value,
            "text/html",
        );

        doc.querySelectorAll(
            "script, iframe, object, embed, base, link, meta, style, form",
        ).forEach((element) => {
            element.remove();
        });

        doc.querySelectorAll("*").forEach((element) => {
            Array.from(element.attributes).forEach((attribute) => {
                const name = attribute.name.toLowerCase();
                const value = attribute.value.trim().toLowerCase();

                if (name.startsWith("on")) {
                    element.removeAttribute(attribute.name);
                }

                if (
                    ["href", "src", "action"].includes(name) &&
                    value.startsWith("javascript:")
                ) {
                    element.removeAttribute(attribute.name);
                }
            });
        });

        Array.from(doc.body.children).forEach((element, index) => {
            const name =
                element.getAttribute("data-grid-area") ||
                element.classList[0] ||
                `area-${index + 1}`;

            element.setAttribute(
                "data-grid-area",
                sanitizeAreaName(name),
            );
        });

        return doc.body.innerHTML;
    } catch {
        return "";
    }
});

const importedAreaNames = computed(() => {
    if (!importedHTMLProcessed.value) {
        return [];
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(
        importedHTMLProcessed.value,
        "text/html",
    );

    return Array.from(
        doc.querySelectorAll("[data-grid-area]"),
    ).map((element) =>
        element.getAttribute("data-grid-area"),
    );
});

const previewAreas = computed(() => {
    const names = [];

    gridAreas.value.forEach((row) => {
        row.forEach((area) => {
            if (area !== "." && !names.includes(area)) {
                names.push(area);
            }
        });
    });

    return names;
});

const areaList = computed(() => {
    const names = useImportedContent.value
        ? importedAreaNames.value
        : previewAreas.value;

    return names.map((name) => ({
        name,
        label:
            areaNames.value[name] ||
            formatAreaName(name),
    }));
});

const gridTemplateAreasValue = computed(() => {
    return gridAreas.value
        .map((row) => `"${row.join(" ")}"`)
        .join("\n        ");
});

const previewStyle = computed(() => ({
    display: "grid",

    gridTemplateColumns:
        `repeat(${columns.value}, minmax(0, 1fr))`,

    gridTemplateRows:
        `repeat(${rows.value}, minmax(0, 1fr))`,

    gridTemplateAreas:
        gridAreas.value
            .map((row) => `"${row.join(" ")}"`)
            .join(" "),

    columnGap: `${safeNumber(columnGap.value)}px`,
    rowGap: `${safeNumber(rowGap.value)}px`,

    justifyItems: justifyItems.value,
    alignItems: alignItems.value,

    justifyContent: justifyContent.value,
    alignContent: alignContent.value,

    gridAutoFlow: gridAutoFlow.value,

    background: containerBackground.value,

    padding: `${safeNumber(containerPadding.value)}px`,

    border:
        `${safeNumber(containerBorderWidth.value)}px solid ${containerBorderColor.value}`,

    borderRadius:
        `${safeNumber(containerBorderRadius.value)}px`,

    boxShadow:
        getShadowValue(containerShadow.value),

    "--grid-area-padding":
        `${safeNumber(areaPadding.value)}px`,

    "--grid-area-background":
        areaBackground.value,

    "--grid-area-color":
        areaColor.value,

    "--grid-area-radius":
        `${safeNumber(areaBorderRadius.value)}px`,

    "--grid-area-text-align":
        areaTextAlign.value,
}));

const generatedCSS = computed(() => {
    let css = `.grid-container {
    display: grid;
    grid-template-columns: repeat(${columns.value}, 1fr);
    grid-template-rows: repeat(${rows.value}, 1fr);
    grid-template-areas:
        ${gridTemplateAreasValue.value};
    column-gap: ${safeNumber(columnGap.value)}px;
    row-gap: ${safeNumber(rowGap.value)}px;
    justify-items: ${justifyItems.value};
    align-items: ${alignItems.value};
    justify-content: ${justifyContent.value};
    align-content: ${alignContent.value};
    grid-auto-flow: ${gridAutoFlow.value};
    background: ${containerBackground.value};
    padding: ${safeNumber(containerPadding.value)}px;
    border: ${safeNumber(containerBorderWidth.value)}px solid ${containerBorderColor.value};
    border-radius: ${safeNumber(containerBorderRadius.value)}px;
    box-shadow: ${getShadowValue(containerShadow.value)};
}

.grid-area {
    box-sizing: border-box;
    min-width: 0;
    min-height: 60px;
    padding: ${safeNumber(areaPadding.value)}px;
    background: ${areaBackground.value};
    color: ${areaColor.value};
    border-radius: ${safeNumber(areaBorderRadius.value)}px;
    text-align: ${areaTextAlign.value};
}`;

    const names = useImportedContent.value
        ? importedAreaNames.value
        : previewAreas.value;

    names.forEach((name) => {
        css += `

.${escapeCSSClass(name)} {
    grid-area: ${name};
}`;
    });

    if (
        useImportedContent.value &&
        importedCSS.value.trim()
    ) {
        css += `

/* Imported CSS */

${cleanImportedCSS(importedCSS.value)}`;
    }

    if (customCSS.value.trim()) {
        css += `

/* Custom CSS */

${customCSS.value.trim()}`;
    }

    return css;
});

const generatedHTML = computed(() => {
    if (useImportedContent.value) {
        return `<div class="grid-container">
${importedHTMLProcessed.value}
</div>`;
    }

    const items = previewAreas.value
        .map((name) => {
            const label =
                areaNames.value[name] ||
                formatAreaName(name);

            return `    <div class="grid-area ${name}">${label}</div>`;
        })
        .join("\n");

    return `<div class="grid-container">
${items}
</div>`;
});

const generatedDocument = computed(() => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Grid Template Areas</title>
    <style>
${generatedCSS.value}
    </style>
</head>
<body>
${generatedHTML.value}
</body>
</html>`;
});

const importedPreviewCSS = computed(() => {
    if (!importedCSS.value.trim()) {
        return "";
    }

    return cleanImportedCSS(importedCSS.value);
});

function safeNumber(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return Math.max(0, number);
}

function getShadowValue(shadow) {
    const shadowMap = {
        none: "none",
        sm: "0 1px 3px rgba(0,0,0,0.08)",
        md: "0 4px 12px rgba(0,0,0,0.10)",
        lg: "0 10px 25px rgba(0,0,0,0.12)",
        xl: "0 20px 40px rgba(0,0,0,0.14)",
    };

    return shadowMap[shadow] || "none";
}

function cleanImportedCSS(css) {
    return css
        .replace(/<style[\s\S]*?>/gi, "")
        .replace(/<\/style>/gi, "")
        .replace(/@import[\s\S]*?;/gi, "")
        .trim();
}

function sanitizeAreaName(name) {
    let result = String(name || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    if (!result) {
        result = "area";
    }

    if (/^[0-9]/.test(result)) {
        result = `area-${result}`;
    }

    return result;
}

function formatAreaName(name) {
    return String(name)
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase(),
        );
}

function escapeCSSClass(name) {
    return String(name)
        .replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}

function isAreaUsed(name) {
    return gridAreas.value.some((row) =>
        row.includes(name),
    );
}

function createUniqueAreaName() {
    let index = 1;
    let name = `area-${index}`;

    while (
        previewAreas.value.includes(name)
    ) {
        index++;
        name = `area-${index}`;
    }

    return name;
}

function getAreaColor(name) {
    const index = Math.max(
        0,
        previewAreas.value.indexOf(name),
    );

    return areaColors[index % areaColors.length];
}

function getAreaStyle(name) {
    const style = {
        background:
            getAreaColor(name),

        color:
            areaColor.value,

        padding:
            `${safeNumber(areaPadding.value)}px`,

        borderRadius:
            `${safeNumber(areaBorderRadius.value)}px`,

        textAlign:
            areaTextAlign.value,
    };

    return style;
}

function getCellStyle(area) {
    if (area === ".") {
        return {
            background: "transparent",
        };
    }

    return {
        background: getAreaColor(area),
    };
}

function selectArea(name) {
    if (!name || name === ".") {
        return;
    }

    selectedArea.value = name;
    activePanel.value = "layout";
}

function renameSelectedArea(value) {
    if (!selectedArea.value) {
        return;
    }

    const oldName = selectedArea.value;
    const newName = sanitizeAreaName(value);

    if (
        !newName ||
        newName === oldName
    ) {
        return;
    }

    if (
        previewAreas.value.includes(newName)
    ) {
        return;
    }

    gridAreas.value = gridAreas.value.map(
        (row) =>
            row.map((cell) =>
                cell === oldName
                    ? newName
                    : cell,
            ),
    );

    areaNames.value = {
        ...areaNames.value,
        [newName]:
            areaNames.value[oldName] ||
            formatAreaName(newName),
    };

    delete areaNames.value[oldName];

    selectedArea.value = newName;
}

function updateAreaLabel(value) {
    if (!selectedArea.value) {
        return;
    }

    areaNames.value = {
        ...areaNames.value,
        [selectedArea.value]: value,
    };
}

function paintCell(rowIndex, columnIndex) {
    if (!selectedArea.value) {
        const current =
            gridAreas.value[rowIndex][columnIndex];

        if (current !== ".") {
            selectArea(current);
        }

        return;
    }

    const next = gridAreas.value.map(
        (row) => [...row],
    );

    next[rowIndex][columnIndex] =
        selectedArea.value;

    gridAreas.value = next;
}

function clearCell(rowIndex, columnIndex) {
    const next = gridAreas.value.map(
        (row) => [...row],
    );

    next[rowIndex][columnIndex] = ".";

    gridAreas.value = next;
}

function fillSelectedArea() {
    if (!selectedArea.value) {
        return;
    }

    const next = gridAreas.value.map(
        (row) => [...row],
    );

    for (
        let row = 0;
        row < rows.value;
        row++
    ) {
        for (
            let column = 0;
            column < columns.value;
            column++
        ) {
            if (
                next[row][column] ===
                selectedArea.value
            ) {
                continue;
            }
        }
    }

    gridAreas.value = next;
}

function addArea() {
    const name = createUniqueAreaName();

    areaNames.value = {
        ...areaNames.value,
        [name]: formatAreaName(name),
    };

    selectedArea.value = name;
    activePanel.value = "layout";
}

function removeSelectedArea() {
    if (!selectedArea.value) {
        return;
    }

    const name = selectedArea.value;

    gridAreas.value =
        gridAreas.value.map(
            (row) =>
                row.map((cell) =>
                    cell === name
                        ? "."
                        : cell,
                ),
        );

    const names = {
        ...areaNames.value,
    };

    delete names[name];

    areaNames.value = names;
    selectedArea.value = null;
}

function addColumn() {
    if (
        columns.value >=
        MAX_GRID_SIZE
    ) {
        return;
    }

    columns.value++;

    gridAreas.value =
        gridAreas.value.map((row) => [
            ...row,
            ".",
        ]);
}

function removeColumn() {
    if (
        columns.value <=
        MIN_GRID_SIZE
    ) {
        return;
    }

    columns.value--;

    gridAreas.value =
        gridAreas.value.map((row) =>
            row.slice(
                0,
                columns.value,
            ),
        );

    cleanSelectedArea();
}

function addRow() {
    if (
        rows.value >=
        MAX_GRID_SIZE
    ) {
        return;
    }

    rows.value++;

    gridAreas.value = [
        ...gridAreas.value,
        Array(columns.value).fill("."),
    ];
}

function removeRow() {
    if (
        rows.value <=
        MIN_GRID_SIZE
    ) {
        return;
    }

    rows.value--;

    gridAreas.value =
        gridAreas.value.slice(
            0,
            rows.value,
        );

    cleanSelectedArea();
}

function cleanSelectedArea() {
    if (
        selectedArea.value &&
        !isAreaUsed(selectedArea.value)
    ) {
        selectedArea.value = null;
    }
}

function resetGrid() {
    columns.value = 4;
    rows.value = 3;

    columnGap.value = 16;
    rowGap.value = 16;

    justifyItems.value = "stretch";
    alignItems.value = "stretch";

    justifyContent.value = "start";
    alignContent.value = "start";

    gridAutoFlow.value = "row";

    gridAreas.value = [
        ["header", "header", "header", "header"],
        ["sidebar", "main", "main", "main"],
        ["footer", "footer", "footer", "footer"],
    ];

    areaNames.value = {
        header: "Header",
        sidebar: "Sidebar",
        main: "Main",
        footer: "Footer",
    };

    selectedArea.value = null;

    containerBackground.value = "#ffffff";
    containerPadding.value = 16;
    containerBorderWidth.value = 1;
    containerBorderColor.value = "#e2e8f0";
    containerBorderRadius.value = 12;
    containerShadow.value = "sm";

    areaBackground.value = "#123B7A";
    areaColor.value = "#ffffff";
    areaPadding.value = 24;
    areaBorderRadius.value = 8;
    areaTextAlign.value = "center";

    customCSS.value = "";

    importedHTML.value = "";
    importedCSS.value = "";

    useImportedContent.value = false;
    importError.value = "";

    activePanel.value = "layout";

    removeImportedPreviewStyles();
}

async function applyImportedContent() {
    importError.value = "";

    if (!importedHTML.value.trim()) {
        importError.value =
            "Please paste some HTML first.";

        return;
    }

    if (!importedHTMLProcessed.value) {
        importError.value =
            "The HTML could not be processed.";

        return;
    }

    useImportedContent.value = true;
    selectedArea.value = null;

    await nextTick();

    updateImportedPreviewStyles();
}

function clearImportedContent() {
    importedHTML.value = "";
    importedCSS.value = "";

    useImportedContent.value = false;
    selectedArea.value = null;
    importError.value = "";

    removeImportedPreviewStyles();
}

function useGeneratedGrid() {
    useImportedContent.value = false;
    selectedArea.value = null;

    removeImportedPreviewStyles();
}

function updateImportedPreviewStyles() {
    removeImportedPreviewStyles();

    if (
        !useImportedContent.value ||
        !importedPreviewCSS.value.trim()
    ) {
        return;
    }

    importedStyleElement =
        document.createElement("style");

    importedStyleElement.setAttribute(
        "data-css-grid-template-areas-import",
        "true",
    );

    importedStyleElement.textContent = `
.preview-grid .preview-import-scope {
    display: contents;
}

.preview-grid .preview-import-scope > [data-grid-area] {
    box-sizing: border-box;
    min-width: 0;
    min-height: 60px;
    cursor: pointer;
    overflow-wrap: anywhere;
}

${importedPreviewCSS.value}
`;

    document.head.appendChild(
        importedStyleElement,
    );
}

function removeImportedPreviewStyles() {
    if (importedStyleElement) {
        importedStyleElement.remove();
        importedStyleElement = null;
    }

    document
        .querySelectorAll(
            'style[data-css-grid-template-areas-import="true"]',
        )
        .forEach((element) => {
            element.remove();
        });
}

function handleImportedClick(event) {
    if (!useImportedContent.value) {
        return;
    }

    const target =
        event.target.closest(
            "[data-grid-area]",
        );

    if (!target) {
        return;
    }

    const name =
        target.getAttribute(
            "data-grid-area",
        );

    if (name) {
        selectArea(name);
    }
}

async function copyCode(type) {
    const contentMap = {
        html: generatedHTML.value,
        css: generatedCSS.value,
        document: generatedDocument.value,
    };

    const content =
        contentMap[type];

    if (!content) {
        return;
    }

    try {
        await navigator.clipboard.writeText(
            content,
        );

        copied.value = type;

        if (copyTimeout) {
            clearTimeout(copyTimeout);
        }

        copyTimeout = setTimeout(() => {
            copied.value = null;
        }, 1800);
    } catch (error) {
        console.error(
            "Failed to copy:",
            error,
        );
    }
}

function downloadHTML() {
    const blob = new Blob(
        [generatedDocument.value],
        {
            type: "text/html;charset=utf-8",
        },
    );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;
    link.download =
        "grid-template-areas.html";

    document.body.appendChild(link);

    link.click();

    link.remove();

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 100);
}

function resetSelectedArea() {
    if (!selectedArea.value) {
        return;
    }

    const name =
        selectedArea.value;

    gridAreas.value =
        gridAreas.value.map(
            (row) =>
                row.map((cell) =>
                    cell === name
                        ? "."
                        : cell,
                ),
        );

    selectedArea.value = null;
}

watch(
    [
        importedCSS,
        useImportedContent,
    ],
    async () => {
        if (!useImportedContent.value) {
            removeImportedPreviewStyles();
            return;
        }

        await nextTick();

        updateImportedPreviewStyles();
    },
);

watch(
    importedHTMLProcessed,
    async () => {
        if (!useImportedContent.value) {
            return;
        }

        await nextTick();

        updateImportedPreviewStyles();
    },
);

onBeforeUnmount(() => {
    removeImportedPreviewStyles();

    if (copyTimeout) {
        clearTimeout(copyTimeout);
    }
});
</script>

<template>
    <main
        class="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-[#050B14] dark:text-slate-100 sm:px-6 lg:px-8">
        <section class="mx-auto max-w-7xl">
            <div class="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div
                        class="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#167fa8] dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-400">
                        <Sparkles class="h-3.5 w-3.5" />
                        CSS Builder
                    </div>

                    <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
                        Grid Template Areas Builder
                    </h1>

                    <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Visually create named CSS Grid areas and generate clean
                        HTML and CSS.
                    </p>
                </div>

                <div class="flex items-center gap-2">
                    <button type="button" @click="resetGrid"
                        class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-[#1769B0] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-cyan-900 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-300">
                        <RotateCcw class="size-4" />
                        Reset
                    </button>

                    <button type="button" @click="downloadHTML"
                        class="inline-flex items-center gap-2 rounded-xl bg-[#123B7A] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1769B0] hover:shadow-lg hover:shadow-cyan-500/10">
                        <Download class="size-4" />
                        Export HTML
                    </button>
                </div>
            </div>

            <div class="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                <aside
                    class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#09111F]">
                    <div class="grid grid-cols-4 border-b border-slate-200 dark:border-slate-800">
                        <button type="button" @click="activePanel = 'layout'"
                            class="flex items-center justify-center gap-2 px-2 py-3 text-xs font-semibold transition"
                            :class="activePanel === 'layout'
                                    ? 'bg-cyan-50 text-[#1769B0] dark:bg-cyan-950/40 dark:text-cyan-300'
                                    : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900'
                                ">
                            <Settings2 class="size-3.5" />
                            Layout
                        </button>

                        <button type="button" @click="activePanel = 'style'"
                            class="flex items-center justify-center gap-2 px-2 py-3 text-xs font-semibold transition"
                            :class="activePanel === 'style'
                                    ? 'bg-cyan-50 text-[#1769B0] dark:bg-cyan-950/40 dark:text-cyan-300'
                                    : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900'
                                ">
                            <Palette class="size-3.5" />
                            Style
                        </button>

                        <button type="button" @click="activePanel = 'custom'"
                            class="flex items-center justify-center gap-2 px-2 py-3 text-xs font-semibold transition"
                            :class="activePanel === 'custom'
                                    ? 'bg-cyan-50 text-[#1769B0] dark:bg-cyan-950/40 dark:text-cyan-300'
                                    : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900'
                                ">
                            <Braces class="size-3.5" />
                            CSS
                        </button>

                        <button type="button" @click="activePanel = 'import'"
                            class="flex items-center justify-center gap-2 px-2 py-3 text-xs font-semibold transition"
                            :class="activePanel === 'import'
                                    ? 'bg-cyan-50 text-[#1769B0] dark:bg-cyan-950/40 dark:text-cyan-300'
                                    : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900'
                                ">
                            <Download class="size-3.5" />
                            Import
                        </button>
                    </div>

                    <div class="p-5">
                        <div v-if="activePanel === 'layout'">
                            <div class="mb-6 flex items-center gap-3">
                                <div
                                    class="flex size-9 items-center justify-center rounded-xl bg-cyan-50 text-[#1769B0] dark:bg-cyan-950/40 dark:text-cyan-300">
                                    <Settings2 class="size-4" />
                                </div>

                                <div>
                                    <h2 class="text-sm font-semibold">
                                        Grid Settings
                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-slate-400">
                                        Configure your template areas
                                    </p>
                                </div>
                            </div>

                            <div class="space-y-5">
                                <div>
                                    <div class="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Grid Size
                                    </div>

                                    <div class="space-y-3">
                                        <div
                                            class="flex items-center justify-between rounded-xl border border-slate-200 p-2 dark:border-slate-700">
                                            <span class="px-2 text-xs text-slate-500">
                                                Columns
                                            </span>

                                            <div class="flex items-center gap-2">
                                                <button type="button" @click="removeColumn" :disabled="columns <=
                                                    MIN_GRID_SIZE
                                                    "
                                                    class="flex size-8 items-center justify-center rounded-lg bg-slate-100 transition hover:bg-cyan-50 hover:text-[#1769B0] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800">
                                                    <Minus class="size-3.5" />
                                                </button>

                                                <span class="w-8 text-center font-mono text-sm font-semibold">
                                                    {{ columns }}
                                                </span>

                                                <button type="button" @click="addColumn" :disabled="columns >=
                                                    MAX_GRID_SIZE
                                                    "
                                                    class="flex size-8 items-center justify-center rounded-lg bg-slate-100 transition hover:bg-cyan-50 hover:text-[#1769B0] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800">
                                                    <Plus class="size-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div
                                            class="flex items-center justify-between rounded-xl border border-slate-200 p-2 dark:border-slate-700">
                                            <span class="px-2 text-xs text-slate-500">
                                                Rows
                                            </span>

                                            <div class="flex items-center gap-2">
                                                <button type="button" @click="removeRow" :disabled="rows <=
                                                    MIN_GRID_SIZE
                                                    "
                                                    class="flex size-8 items-center justify-center rounded-lg bg-slate-100 transition hover:bg-cyan-50 hover:text-[#1769B0] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800">
                                                    <Minus class="size-3.5" />
                                                </button>

                                                <span class="w-8 text-center font-mono text-sm font-semibold">
                                                    {{ rows }}
                                                </span>

                                                <button type="button" @click="addRow" :disabled="rows >=
                                                    MAX_GRID_SIZE
                                                    "
                                                    class="flex size-8 items-center justify-center rounded-lg bg-slate-100 transition hover:bg-cyan-50 hover:text-[#1769B0] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800">
                                                    <Plus class="size-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div class="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Areas
                                    </div>

                                    <div class="space-y-2">
                                        <button v-for="area in areaList" :key="area.name" type="button"
                                            @click="selectArea(area.name)"
                                            class="flex w-full items-center gap-3 rounded-xl border p-3 text-left transition"
                                            :class="selectedArea === area.name
                                                    ? 'border-cyan-300 bg-cyan-50 dark:border-cyan-800 dark:bg-cyan-950/40'
                                                    : 'border-slate-200 hover:border-cyan-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-cyan-900'
                                                ">
                                            <span class="size-3 shrink-0 rounded-full" :style="{
                                                background:
                                                    getAreaColor(
                                                        area.name,
                                                    ),
                                            }"></span>

                                            <span class="min-w-0 flex-1 truncate text-xs font-medium">
                                                {{ area.label }}
                                            </span>

                                            <span class="font-mono text-[10px] text-slate-400">
                                                {{ area.name }}
                                            </span>
                                        </button>

                                        <button type="button" @click="addArea"
                                            class="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-2.5 text-xs font-semibold text-slate-500 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-[#1769B0] dark:border-slate-700 dark:hover:border-cyan-800 dark:hover:bg-cyan-950/30">
                                            <Plus class="size-3.5" />
                                            Add Area
                                        </button>
                                    </div>
                                </div>

                                <div v-if="selectedArea"
                                    class="rounded-xl border border-cyan-200 bg-cyan-50/50 p-4 dark:border-cyan-900/50 dark:bg-cyan-950/20">
                                    <div class="mb-3 flex items-center justify-between">
                                        <div>
                                            <p class="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Selected Area
                                            </p>

                                            <p class="mt-0.5 font-mono text-xs text-[#1769B0] dark:text-cyan-300">
                                                {{ selectedArea }}
                                            </p>
                                        </div>

                                        <button type="button" @click="
                                            selectedArea = null
                                            "
                                            class="rounded-lg p-1 text-slate-400 hover:bg-white hover:text-slate-700 dark:hover:bg-slate-800">
                                            <X class="size-3.5" />
                                        </button>
                                    </div>

                                    <label class="block">
                                        <span class="mb-2 block text-xs text-slate-500">
                                            Area Name
                                        </span>

                                        <input :value="selectedArea" @change="
                                            renameSelectedArea(
                                                $event.target.value,
                                            )
                                            "
                                            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-xs outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950" />
                                    </label>

                                    <label class="mt-3 block">
                                        <span class="mb-2 block text-xs text-slate-500">
                                            Display Label
                                        </span>

                                        <input :value="areaNames[
                                            selectedArea
                                            ] ||
                                            formatAreaName(
                                                selectedArea,
                                            )
                                            " @input="
                                                updateAreaLabel(
                                                    $event.target.value,
                                                )
                                                "
                                            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950" />
                                    </label>

                                    <button type="button" @click="
                                        removeSelectedArea
                                    "
                                        class="mt-3 w-full rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30">
                                        Remove Area
                                    </button>
                                </div>

                                <div>
                                    <div class="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Spacing
                                    </div>

                                    <div class="grid grid-cols-2 gap-3">
                                        <label>
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Column Gap
                                            </span>

                                            <input v-model.number="columnGap
                                                " type="number" min="0" max="100"
                                                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-950" />
                                        </label>

                                        <label>
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Row Gap
                                            </span>

                                            <input v-model.number="rowGap
                                                " type="number" min="0" max="100"
                                                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-950" />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <div class="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Item Alignment
                                    </div>

                                    <div class="space-y-3">
                                        <label>
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Justify Items
                                            </span>

                                            <select v-model="justifyItems
                                                "
                                                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950">
                                                <option v-for="option in alignmentOptions" :key="option" :value="option
                                                    ">
                                                    {{ option }}
                                                </option>
                                            </select>
                                        </label>

                                        <label>
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Align Items
                                            </span>

                                            <select v-model="alignItems
                                                "
                                                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950">
                                                <option v-for="option in alignmentOptions" :key="option" :value="option
                                                    ">
                                                    {{ option }}
                                                </option>
                                            </select>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <div class="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Content Alignment
                                    </div>

                                    <div class="space-y-3">
                                        <label>
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Justify Content
                                            </span>

                                            <select v-model="justifyContent
                                                "
                                                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950">
                                                <option v-for="option in contentOptions" :key="option" :value="option
                                                    ">
                                                    {{ option }}
                                                </option>
                                            </select>
                                        </label>

                                        <label>
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Align Content
                                            </span>

                                            <select v-model="alignContent
                                                "
                                                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950">
                                                <option v-for="option in contentOptions" :key="option" :value="option
                                                    ">
                                                    {{ option }}
                                                </option>
                                            </select>
                                        </label>
                                    </div>
                                </div>

                                <label class="block">
                                    <span class="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-400">
                                        Grid Auto Flow
                                    </span>

                                    <select v-model="gridAutoFlow
                                        "
                                        class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950">
                                        <option value="row">
                                            row
                                        </option>
                                        <option value="column">
                                            column
                                        </option>
                                        <option value="row dense">
                                            row dense
                                        </option>
                                        <option value="column dense">
                                            column dense
                                        </option>
                                    </select>
                                </label>
                            </div>
                        </div>

                        <div v-else-if="activePanel === 'style'">
                            <div class="mb-6 flex items-center gap-3">
                                <div
                                    class="flex size-9 items-center justify-center rounded-xl bg-cyan-50 text-[#1769B0] dark:bg-cyan-950/40 dark:text-cyan-300">
                                    <Palette class="size-4" />
                                </div>

                                <div>
                                    <h2 class="text-sm font-semibold">
                                        Visual Styles
                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-slate-400">
                                        Customize the preview
                                    </p>
                                </div>
                            </div>

                            <div class="space-y-6">
                                <div>
                                    <div class="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Container
                                    </div>

                                    <div class="space-y-3">
                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Background
                                            </span>

                                            <div class="flex gap-2">
                                                <input v-model="containerBackground
                                                    " type="color"
                                                    class="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white" />

                                                <input v-model="containerBackground
                                                    " type="text"
                                                    class="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                            </div>
                                        </label>

                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Padding
                                            </span>

                                            <input v-model.number="containerPadding
                                                " type="number" min="0" max="100"
                                                class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                        </label>

                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Border Width
                                            </span>

                                            <input v-model.number="containerBorderWidth
                                                " type="number" min="0" max="20"
                                                class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                        </label>

                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Border Color
                                            </span>

                                            <div class="flex gap-2">
                                                <input v-model="containerBorderColor
                                                    " type="color"
                                                    class="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white" />

                                                <input v-model="containerBorderColor
                                                    " type="text"
                                                    class="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                            </div>
                                        </label>

                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Border Radius
                                            </span>

                                            <input v-model.number="containerBorderRadius
                                                " type="number" min="0" max="100"
                                                class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                        </label>

                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Shadow
                                            </span>

                                            <select v-model="containerShadow
                                                "
                                                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950">
                                                <option v-for="option in shadowOptions" :key="option" :value="option
                                                    ">
                                                    {{ option }}
                                                </option>
                                            </select>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <div class="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Grid Areas
                                    </div>

                                    <div class="space-y-3">
                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Background
                                            </span>

                                            <div class="flex gap-2">
                                                <input v-model="areaBackground
                                                    " type="color"
                                                    class="h-10 w-12 cursor-pointer rounded-lg border border-slate-200" />

                                                <input v-model="areaBackground
                                                    " type="text"
                                                    class="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                            </div>
                                        </label>

                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Text Color
                                            </span>

                                            <div class="flex gap-2">
                                                <input v-model="areaColor
                                                    " type="color"
                                                    class="h-10 w-12 cursor-pointer rounded-lg border border-slate-200" />

                                                <input v-model="areaColor
                                                    " type="text"
                                                    class="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                            </div>
                                        </label>

                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Padding
                                            </span>

                                            <input v-model.number="areaPadding
                                                " type="number" min="0" max="100"
                                                class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                        </label>

                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Border Radius
                                            </span>

                                            <input v-model.number="areaBorderRadius
                                                " type="number" min="0" max="100"
                                                class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                        </label>

                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Text Align
                                            </span>

                                            <select v-model="areaTextAlign
                                                "
                                                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950">
                                                <option value="left">
                                                    left
                                                </option>

                                                <option value="center">
                                                    center
                                                </option>

                                                <option value="right">
                                                    right
                                                </option>
                                            </select>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-else-if="activePanel === 'custom'">
                            <div class="mb-6 flex items-center gap-3">
                                <div
                                    class="flex size-9 items-center justify-center rounded-xl bg-cyan-50 text-[#1769B0] dark:bg-cyan-950/40 dark:text-cyan-300">
                                    <Braces class="size-4" />
                                </div>

                                <div>
                                    <h2 class="text-sm font-semibold">
                                        Custom CSS
                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-slate-400">
                                        Add your own styles
                                    </p>
                                </div>
                            </div>

                            <textarea v-model="customCSS" spellcheck="false" placeholder="/* Add custom CSS here */

.grid-container {
    min-height: 400px;
}

.header {
    font-weight: 700;
}

.main {
    line-height: 1.6;
}" class="min-h-[380px] w-full resize-y rounded-xl border border-slate-200 bg-[#050B14] p-4 font-mono text-xs leading-6 text-slate-300 outline-none transition focus:border-cyan-500 dark:border-slate-700"></textarea>
                        </div>

                        <div v-else-if="activePanel === 'import'">
                            <div class="mb-6 flex items-center gap-3">
                                <div
                                    class="flex size-9 items-center justify-center rounded-xl bg-cyan-50 text-[#1769B0] dark:bg-cyan-950/40 dark:text-cyan-300">
                                    <Download class="size-4" />
                                </div>

                                <div>
                                    <h2 class="text-sm font-semibold">
                                        Import HTML & CSS
                                    </h2>

                                    <p class="text-xs text-slate-500 dark:text-slate-400">
                                        Preview your own markup
                                    </p>
                                </div>
                            </div>

                            <div class="space-y-5">
                                <div>
                                    <label class="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        HTML
                                    </label>

                                    <textarea v-model="importedHTML" spellcheck="false" placeholder='<header class="header">
    Header
</header>

<aside class="sidebar">
    Sidebar
</aside>

<main class="main">
    Main content
</main>

<footer class="footer">
    Footer
</footer>' class="min-h-[260px] w-full resize-y rounded-xl border border-slate-200 bg-[#050B14] p-4 font-mono text-xs leading-6 text-slate-300 outline-none transition focus:border-cyan-500 dark:border-slate-700"></textarea>
                                </div>

                                <div>
                                    <label class="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        CSS
                                    </label>

                                    <textarea v-model="importedCSS" spellcheck="false" placeholder=".header {
    padding: 24px;
    background: #123B7A;
    color: white;
}

.main {
    padding: 24px;
}" class="min-h-[220px] w-full resize-y rounded-xl border border-slate-200 bg-[#050B14] p-4 font-mono text-xs leading-6 text-slate-300 outline-none transition focus:border-cyan-500 dark:border-slate-700"></textarea>
                                </div>

                                <div v-if="importError"
                                    class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                                    {{ importError }}
                                </div>

                                <div class="grid grid-cols-2 gap-2">
                                    <button type="button" @click="
                                        applyImportedContent
                                    "
                                        class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123B7A] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1769B0]">
                                        <Eye class="size-3.5" />
                                        Use in Preview
                                    </button>

                                    <button type="button" @click="
                                        clearImportedContent
                                    "
                                        class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-400">
                                        <X class="size-3.5" />
                                        Clear
                                    </button>
                                </div>

                                <button v-if="useImportedContent" type="button" @click="useGeneratedGrid"
                                    class="w-full rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2.5 text-xs font-semibold text-[#1769B0] transition hover:bg-cyan-100 dark:border-cyan-900/50 dark:bg-cyan-950/40 dark:text-cyan-300">
                                    Switch Back to Generated Grid
                                </button>

                                <div
                                    class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                                    <p class="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        How it works
                                    </p>

                                    <ul class="mt-2 space-y-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                        <li>
                                            • HTML elements become grid
                                            areas.
                                        </li>

                                        <li>
                                            • Existing class names are used
                                            as area names.
                                        </li>

                                        <li>
                                            • Grid settings control the
                                            layout.
                                        </li>

                                        <li>
                                            • Click imported elements to
                                            select them.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <section
                    class="flex min-h-[650px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#09111F]">
                    <div
                        class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                        <div class="flex items-center gap-3">
                            <div
                                class="flex size-9 items-center justify-center rounded-xl bg-cyan-50 text-[#1769B0] dark:bg-cyan-950/40 dark:text-cyan-300">
                                <Eye class="size-4" />
                            </div>

                            <div>
                                <h2 class="text-sm font-semibold">
                                    Template Area Editor
                                </h2>

                                <p class="text-xs text-slate-500 dark:text-slate-400">
                                    {{ columns }} × {{ rows }} grid
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <div
                                class="hidden items-center gap-1.5 rounded-lg bg-cyan-50 px-2.5 py-1.5 text-xs font-medium text-[#1769B0] sm:flex dark:bg-cyan-950/40 dark:text-cyan-300">
                                <MousePointer2 class="size-3.5" />
                                Select an area
                            </div>

                            <span
                                class="rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                {{ areaList.length }} areas
                            </span>
                        </div>
                    </div>

                    <div class="flex flex-1 flex-col overflow-auto bg-slate-50 p-6 dark:bg-[#050B14] sm:p-10">
                        <div
                            class="mb-5 flex items-start gap-3 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-xs text-[#1769B0] dark:border-cyan-900/50 dark:bg-cyan-950/30 dark:text-cyan-300">
                            <Paintbrush class="mt-0.5 size-4 shrink-0" />

                            <div>
                                <p class="font-semibold">
                                    {{
                                        selectedArea
                                            ? `Editing: ${selectedArea}`
                                            : "Visual template editor"
                                    }}
                                </p>

                                <p class="mt-1 leading-5 text-[#1769B0]/80 dark:text-cyan-300/70">
                                    {{
                                        selectedArea
                                            ? "Click cells to assign them to the selected area."
                                            : "Click an existing area or choose one from the Layout panel."
                                    }}
                                </p>
                            </div>
                        </div>

                        <div
                            class="flex min-h-[480px] flex-1 items-stretch justify-stretch rounded-xl border border-dashed border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-[#09111F]">
                            <div class="min-h-[440px] w-full preview-grid" :style="previewStyle"
                                @click="handleImportedClick">
                                <template v-if="useImportedContent">
                                    <div class="contents preview-import-scope" v-html="importedHTMLProcessed
                                        "></div>
                                </template>

                                <template v-else>
                                    <button v-for="(
cell, index
                                        ) in gridAreas.flat()" :key="`${index}-${cell}`" type="button"
                                        class="group relative min-h-[60px] min-w-0 overflow-hidden border border-white/20 p-3 text-xs font-semibold text-white shadow-sm transition hover:brightness-110"
                                        :style="{
                                            ...getCellStyle(
                                                cell,
                                            ),
                                            gridColumn:
                                                (index %
                                                    columns) +
                                                1,
                                            gridRow:
                                                Math.floor(
                                                    index /
                                                    columns,
                                                ) + 1,
                                        }" @click="
                                            paintCell(
                                                Math.floor(
                                                    index /
                                                    columns,
                                                ),
                                                index %
                                                columns,
                                            )
                                            " @dblclick="
                                            clearCell(
                                                Math.floor(
                                                    index /
                                                    columns,
                                                ),
                                                index %
                                                columns,
                                            )
                                            " :class="{
                                            'ring-2 ring-cyan-400 ring-offset-2 ring-offset-white dark:ring-offset-[#09111F]':
                                                selectedArea ===
                                                cell &&
                                                cell !== '.',
                                            'bg-slate-100 dark:bg-slate-800':
                                                cell === '.',
                                        }">
                                        <span v-if="cell !== '.'" class="truncate">
                                            {{
                                                areaNames[
                                                cell
                                                ] ||
                                                formatAreaName(
                                                    cell,
                                                )
                                            }}
                                        </span>

                                        <span v-else class="font-mono text-[10px] text-slate-400">
                                            .
                                        </span>

                                        <span v-if="
                                            cell !== '.' &&
                                            selectedArea ===
                                            cell
                                        "
                                            class="absolute right-2 top-2 rounded-md bg-white/20 px-1.5 py-0.5 text-[9px] uppercase tracking-wide">
                                            Selected
                                        </span>
                                    </button>
                                </template>
                            </div>
                        </div>

                        <div
                            class="mt-5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#09111F]">
                            <div class="mb-3 flex items-center justify-between">
                                <div>
                                    <p class="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        grid-template-areas
                                    </p>

                                    <p class="mt-1 text-[11px] text-slate-400">
                                        Generated automatically from the
                                        visual grid.
                                    </p>
                                </div>

                                <button type="button" @click="copyCode('css')"
                                    class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-[#1769B0] dark:border-slate-700">
                                    <Check v-if="
                                        copied === 'css'
                                    " class="size-3.5" />

                                    <Copy v-else class="size-3.5" />

                                    {{
                                        copied === "css"
                                            ? "Copied"
                                            : "Copy CSS"
                                    }}
                                </button>
                            </div>

                            <pre
                                class="overflow-x-auto rounded-xl bg-[#050B14] p-4 font-mono text-xs leading-6 text-cyan-300">
        <code>grid-template-areas:
            {{ gridTemplateAreasValue }};</code></pre>
                        </div>

                        <div class="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span>Grid:</span>

                            <span class="rounded-md bg-[#123B7A] px-2 py-1 font-mono font-semibold text-white">
                                {{ columns }} columns
                            </span>

                            <span class="rounded-md bg-[#1769B0] px-2 py-1 font-mono font-semibold text-white">
                                {{ rows }} rows
                            </span>

                            <span class="text-slate-400">→</span>

                            <span class="font-mono text-[#1769B0] dark:text-cyan-300">
                                {{ areaList.length }} named areas
                            </span>
                        </div>
                    </div>
                </section>
            </div>

            <section class="mt-8">
                <div class="mb-4 flex items-center gap-3">
                    <div
                        class="flex size-9 items-center justify-center rounded-xl bg-cyan-50 text-[#1769B0] dark:bg-cyan-950/40 dark:text-cyan-300">
                        <Code2 class="size-4" />
                    </div>

                    <div>
                        <h2 class="text-lg font-semibold">
                            Generated Code
                        </h2>

                        <p class="text-sm text-slate-500 dark:text-slate-400">
                            HTML and CSS update automatically as you build your
                            template areas.
                        </p>
                    </div>
                </div>

                <div class="grid gap-6 lg:grid-cols-2">
                    <div
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#09111F]">
                        <div
                            class="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                            <div class="flex items-center gap-2">
                                <span
                                    class="rounded-md bg-[#1769B0]/10 px-2 py-1 font-mono text-xs font-semibold text-[#1769B0] dark:bg-cyan-950/50 dark:text-cyan-300">
                                    HTML
                                </span>

                                <span class="text-sm font-medium">
                                    Markup
                                </span>
                            </div>

                            <button type="button" @click="copyCode('html')"
                                class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-[#1769B0] dark:border-slate-700">
                                <Check v-if="
                                    copied === 'html'
                                " class="size-3.5" />

                                <Copy v-else class="size-3.5" />

                                {{
                                    copied === "html"
                                        ? "Copied"
                                        : "Copy"
                                }}
                            </button>
                        </div>

                        <pre
                            class="min-h-[320px] overflow-x-auto bg-[#050B14] p-5 font-mono text-xs leading-6 text-slate-300">
                <code>{{ generatedHTML }}</code></pre>
                    </div>

                    <div
                        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#09111F]">
                        <div
                            class="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                            <div class="flex items-center gap-2">
                                <span
                                    class="rounded-md bg-[#00A8C7]/10 px-2 py-1 font-mono text-xs font-semibold text-[#008AA5] dark:bg-cyan-950/50 dark:text-cyan-300">
                                    CSS
                                </span>

                                <span class="text-sm font-medium">
                                    Styles
                                </span>
                            </div>

                            <button type="button" @click="copyCode('css')"
                                class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-[#1769B0] dark:border-slate-700">
                                <Check v-if="
                                    copied === 'css'
                                " class="size-3.5" />

                                <Copy v-else class="size-3.5" />

                                {{
                                    copied === "css"
                                        ? "Copied"
                                        : "Copy"
                                }}
                            </button>
                        </div>

                        <pre
                            class="min-h-[320px] overflow-x-auto bg-[#050B14] p-5 font-mono text-xs leading-6 text-slate-300">
                <code>{{ generatedCSS }}</code></pre>
                    </div>
                </div>
            </section>

            <section
                class="relative mt-6 overflow-hidden rounded-2xl border border-[#1769B0]/30 bg-gradient-to-r from-[#123B7A] via-[#1769B0] to-[#00A8C7] p-6 text-white shadow-lg shadow-cyan-500/10">
                <div
                    class="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#7BD957]/20 blur-3xl">
                </div>

                <div class="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div
                            class="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-100">
                            <span class="size-1.5 rounded-full bg-[#7BD957] shadow shadow-[#7BD957]"></span>

                            Ready to export
                        </div>

                        <h3 class="text-lg font-bold">
                            Take your grid with you.
                        </h3>

                        <p class="mt-1 max-w-xl text-sm leading-6 text-cyan-50/80">
                            Export a complete HTML file with your generated
                            template areas and CSS included.
                        </p>
                    </div>

                    <button type="button" @click="downloadHTML"
                        class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#123B7A] shadow-lg transition hover:bg-cyan-50 hover:shadow-xl">
                        <Download class="size-4" />
                        Download HTML
                    </button>
                </div>
            </section>
        </section>
    </main>
</template>

<style>
.preview-grid {
    min-width: 0;
}

.preview-grid>.preview-import-scope {
    display: contents;
}

.preview-grid>.preview-import-scope>[data-grid-area] {
    box-sizing: border-box;
    min-width: 0;
    min-height: 60px;
    padding: var(--grid-area-padding);
    background: var(--grid-area-background);
    color: var(--grid-area-color);
    border-radius: var(--grid-area-radius);
    text-align: var(--grid-area-text-align);
    cursor: pointer;
    overflow-wrap: anywhere;
}

.preview-grid>.preview-import-scope>[data-grid-area]:hover {
    outline: 2px solid rgb(34 211 238 / 0.45);
    outline-offset: 2px;
}

.preview-grid>.preview-import-scope>[data-grid-area] img {
    max-width: 100%;
    height: auto;
}

.preview-grid>.preview-import-scope>[data-grid-area] video {
    max-width: 100%;
    height: auto;
}

.preview-grid>.preview-import-scope>[data-grid-area] iframe {
    max-width: 100%;
}
</style>
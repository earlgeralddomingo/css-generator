<script setup>
import {
    computed,
    nextTick,
    onBeforeUnmount,
    ref,
    watch,
} from "vue";

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
} from "lucide-vue-next";

/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

const MAX_GRID_SIZE = 12;
const MIN_GRID_SIZE = 1;

/*
|--------------------------------------------------------------------------
| Grid Settings
|--------------------------------------------------------------------------
*/

const columns = ref(3);
const rows = ref(2);

const columnGap = ref(16);
const rowGap = ref(16);

const justifyItems = ref("stretch");
const alignItems = ref("stretch");

const justifyContent = ref("start");
const alignContent = ref("start");

const gridAutoFlow = ref("row");

const itemCount = ref(6);

/*
|--------------------------------------------------------------------------
| UI State
|--------------------------------------------------------------------------
*/

const copied = ref(null);
const activePanel = ref("layout");
const selectedItem = ref(null);

/*
|--------------------------------------------------------------------------
| Container Styles
|--------------------------------------------------------------------------
*/

const containerBackground = ref("#ffffff");
const containerPadding = ref(16);
const containerBorderWidth = ref(1);
const containerBorderColor = ref("#e2e8f0");
const containerBorderRadius = ref(12);
const containerShadow = ref("sm");

/*
|--------------------------------------------------------------------------
| Item Styles
|--------------------------------------------------------------------------
*/

const itemBackground = ref("#123B7A");
const itemColor = ref("#ffffff");
const itemPadding = ref(24);
const itemBorderRadius = ref(8);
const itemTextAlign = ref("center");

/*
|--------------------------------------------------------------------------
| Custom / Imported CSS
|--------------------------------------------------------------------------
*/

const customCSS = ref("");

const importedHTML = ref("");
const importedCSS = ref("");

const useImportedContent = ref(false);
const importError = ref("");

/*
|--------------------------------------------------------------------------
| Item Placement
|--------------------------------------------------------------------------
*/

const itemPositions = ref({});

/*
|--------------------------------------------------------------------------
| Options
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| DOM References
|--------------------------------------------------------------------------
*/

let importedStyleElement = null;
let customStyleElement = null;
let copyTimeout = null;

/*
|--------------------------------------------------------------------------
| Grid Items
|--------------------------------------------------------------------------
*/

const gridItems = computed(() => {
    const maxItems =
        Math.max(
            1,
            columns.value * rows.value,
        );

    const count =
        Math.max(
            1,
            Math.min(
                Number(itemCount.value) || 1,
                maxItems,
            ),
        );

    return Array.from(
        { length: count },
        (_, index) => index + 1,
    );
});

/*
|--------------------------------------------------------------------------
| Preview Information
|--------------------------------------------------------------------------
*/

const previewInstruction = computed(() => {
    if (useImportedContent.value) {
        return "Click an imported element to edit its grid placement.";
    }

    return "Click an item to edit its grid placement. Use the layout controls to change the overall grid.";
});

const previewItemCount = computed(() => {
    return useImportedContent.value
        ? importedItemCount.value
        : gridItems.value.length;
});

/*
|--------------------------------------------------------------------------
| Imported HTML Processing
|--------------------------------------------------------------------------
*/

const processedImportedHTML = computed(() => {
    if (!importedHTML.value.trim()) {
        return "";
    }

    try {
        const parser = new DOMParser();

        const parsedDocument =
            parser.parseFromString(
                importedHTML.value,
                "text/html",
            );

        /*
        |--------------------------------------------------------------------------
        | Remove potentially unsafe / unsupported elements
        |--------------------------------------------------------------------------
        */

        parsedDocument
            .querySelectorAll(
                "script, iframe, object, embed, base, link, meta, style, form",
            )
            .forEach((element) => {
                element.remove();
            });

        /*
        |--------------------------------------------------------------------------
        | Remove inline event handlers
        |--------------------------------------------------------------------------
        */

        parsedDocument
            .querySelectorAll("*")
            .forEach((element) => {
                Array.from(
                    element.attributes,
                ).forEach((attribute) => {
                    const name =
                        attribute.name.toLowerCase();

                    const value =
                        attribute.value
                            .trim()
                            .toLowerCase();

                    if (
                        name.startsWith("on")
                    ) {
                        element.removeAttribute(
                            attribute.name,
                        );
                    }

                    if (
                        (
                            name === "href" ||
                            name === "src" ||
                            name === "action"
                        ) &&
                        value.startsWith(
                            "javascript:",
                        )
                    ) {
                        element.removeAttribute(
                            attribute.name,
                        );
                    }
                });
            });

        /*
        |--------------------------------------------------------------------------
        | Convert top-level elements into grid items
        |--------------------------------------------------------------------------
        */

        Array.from(
            parsedDocument.body.children,
        ).forEach((element, index) => {
            element.classList.add(
                "grid-item",
            );

            element.setAttribute(
                "data-grid-item",
                String(index + 1),
            );
        });

        return parsedDocument.body.innerHTML;
    } catch (error) {
        console.error(
            "Failed to process imported HTML:",
            error,
        );

        return "";
    }
});

/*
|--------------------------------------------------------------------------
| Imported Item Count
|--------------------------------------------------------------------------
*/

const importedItemCount = computed(() => {
    if (!processedImportedHTML.value) {
        return 0;
    }

    try {
        const parser =
            new DOMParser();

        const parsedDocument =
            parser.parseFromString(
                processedImportedHTML.value,
                "text/html",
            );

        return parsedDocument.body.children.length;
    } catch {
        return 0;
    }
});

/*
|--------------------------------------------------------------------------
| Preview Style
|--------------------------------------------------------------------------
*/

const previewStyle = computed(() => {
    const style = {
        display: "grid",

        background:
            containerBackground.value,

        padding:
            `${Math.max(
                0,
                Number(containerPadding.value) || 0,
            )}px`,

        border:
            `${Math.max(
                0,
                Number(containerBorderWidth.value) || 0,
            )}px solid ${containerBorderColor.value}`,

        borderRadius:
            `${Math.max(
                0,
                Number(containerBorderRadius.value) || 0,
            )}px`,

        boxShadow:
            getShadowValue(
                containerShadow.value,
            ),

        "--grid-item-padding":
            `${Math.max(
                0,
                Number(itemPadding.value) || 0,
            )}px`,

        "--grid-item-background":
            itemBackground.value,

        "--grid-item-color":
            itemColor.value,

        "--grid-item-radius":
            `${Math.max(
                0,
                Number(itemBorderRadius.value) || 0,
            )}px`,

        "--grid-item-text-align":
            itemTextAlign.value,
    };

    if (!useImportedContent.value) {
        style.gridTemplateColumns =
            `repeat(${columns.value}, minmax(0, 1fr))`;

        style.gridTemplateRows =
            `repeat(${rows.value}, minmax(0, 1fr))`;

        style.columnGap =
            `${Math.max(
                0,
                Number(columnGap.value) || 0,
            )}px`;

        style.rowGap =
            `${Math.max(
                0,
                Number(rowGap.value) || 0,
            )}px`;

        style.justifyItems =
            justifyItems.value;

        style.alignItems =
            alignItems.value;

        style.justifyContent =
            justifyContent.value;

        style.alignContent =
            alignContent.value;

        style.gridAutoFlow =
            gridAutoFlow.value;
    }

    return style;
});

/*
|--------------------------------------------------------------------------
| Generated CSS
|--------------------------------------------------------------------------
*/

const generatedCSS = computed(() => {
    let css = `.grid-container {
    display: grid;
    grid-template-columns: repeat(${columns.value}, 1fr);
    grid-template-rows: repeat(${rows.value}, 1fr);
    column-gap: ${Number(columnGap.value) || 0}px;
    row-gap: ${Number(rowGap.value) || 0}px;
    justify-items: ${justifyItems.value};
    align-items: ${alignItems.value};
    justify-content: ${justifyContent.value};
    align-content: ${alignContent.value};
    grid-auto-flow: ${gridAutoFlow.value};
    background: ${containerBackground.value};
    padding: ${Number(containerPadding.value) || 0}px;
    border: ${Number(containerBorderWidth.value) || 0}px solid ${containerBorderColor.value};
    border-radius: ${Number(containerBorderRadius.value) || 0}px;
    box-shadow: ${getShadowValue(containerShadow.value)};
}

.grid-item {
    box-sizing: border-box;
    min-width: 0;
    min-height: 60px;
    padding: ${Number(itemPadding.value) || 0}px;
    background: ${itemBackground.value};
    color: ${itemColor.value};
    border-radius: ${Number(itemBorderRadius.value) || 0}px;
    text-align: ${itemTextAlign.value};
}`;

    const itemList =
        useImportedContent.value
            ? Array.from(
                {
                    length:
                        importedItemCount.value,
                },
                (_, index) => index + 1,
            )
            : gridItems.value;

    itemList.forEach((item) => {
        const position =
            getItemPosition(item);

        const rules = [];

        if (
            position.columnStart
        ) {
            rules.push(
                `    grid-column-start: ${position.columnStart};`,
            );
        }

        if (
            position.columnEnd
        ) {
            rules.push(
                `    grid-column-end: ${position.columnEnd};`,
            );
        }

        if (
            position.rowStart
        ) {
            rules.push(
                `    grid-row-start: ${position.rowStart};`,
            );
        }

        if (
            position.rowEnd
        ) {
            rules.push(
                `    grid-row-end: ${position.rowEnd};`,
            );
        }

        if (!rules.length) {
            return;
        }

        css += `

.grid-item:nth-child(${item}) {
${rules.join("\n")}
}`;
    });

    /*
    |--------------------------------------------------------------------------
    | Imported CSS
    |--------------------------------------------------------------------------
    */

    if (
        useImportedContent.value &&
        importedCSS.value.trim()
    ) {
        css += `

/* Imported CSS */

${cleanImportedCSS(
    importedCSS.value,
)}`;
    }

    /*
    |--------------------------------------------------------------------------
    | Custom CSS
    |--------------------------------------------------------------------------
    */

    if (customCSS.value.trim()) {
        css += `

/* Custom CSS */

${customCSS.value.trim()}`;
    }

    return css;
});

/*
|--------------------------------------------------------------------------
| Generated HTML
|--------------------------------------------------------------------------
*/

const generatedHTML = computed(() => {
    if (useImportedContent.value) {
        return `<div class="grid-container">
${processedImportedHTML.value}
</div>`;
    }

    const items =
        gridItems.value
            .map(
                (item) =>
                    `    <div class="grid-item">${item}</div>`,
            )
            .join("\n");

    return `<div class="grid-container">
${items}
</div>`;
});

/*
|--------------------------------------------------------------------------
| Generated Full Document
|--------------------------------------------------------------------------
*/

const generatedDocument = computed(() => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Grid Builder</title>

    <style>
${generatedCSS.value}
    </style>
</head>

<body>
${generatedHTML.value}
</body>
</html>`;
});

/*
|--------------------------------------------------------------------------
| Imported CSS
|--------------------------------------------------------------------------
*/

const importedPreviewCSS = computed(() => {
    if (!importedCSS.value.trim()) {
        return "";
    }

    return cleanImportedCSS(
        importedCSS.value,
    );
});

/*
|--------------------------------------------------------------------------
| Shadow Helper
|--------------------------------------------------------------------------
*/

function getShadowValue(shadow) {
    const shadowMap = {
        none: "none",
        sm: "0 1px 3px rgba(0,0,0,0.08)",
        md: "0 4px 12px rgba(0,0,0,0.10)",
        lg: "0 10px 25px rgba(0,0,0,0.12)",
        xl: "0 20px 40px rgba(0,0,0,0.14)",
    };

    return (
        shadowMap[shadow] ||
        "none"
    );
}

/*
|--------------------------------------------------------------------------
| Clean Imported CSS
|--------------------------------------------------------------------------
*/

function cleanImportedCSS(css) {
    return css
        .replace(
            /<style[\s\S]*?>/gi,
            "",
        )
        .replace(
            /<\/style>/gi,
            "",
        )
        .replace(
            /@import[\s\S]*?;/gi,
            "",
        )
        .trim();
}

/*
|--------------------------------------------------------------------------
| Custom CSS Preview
|--------------------------------------------------------------------------
*/

function updateCustomPreviewStyles() {
    removeCustomPreviewStyles();

    if (!customCSS.value.trim()) {
        return;
    }

    customStyleElement =
        document.createElement("style");

    customStyleElement.setAttribute(
        "data-css-grid-builder-custom",
        "true",
    );

    customStyleElement.textContent =
        customCSS.value;

    document.head.appendChild(
        customStyleElement,
    );
}

function removeCustomPreviewStyles() {
    if (customStyleElement) {
        customStyleElement.remove();

        customStyleElement = null;
    }

    document
        .querySelectorAll(
            'style[data-css-grid-builder-custom="true"]',
        )
        .forEach((element) => {
            element.remove();
        });
}

/*
|--------------------------------------------------------------------------
| Imported Preview Styles
|--------------------------------------------------------------------------
*/

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
        "data-css-grid-builder-import",
        "true",
    );

    importedStyleElement.textContent = `
.preview-grid > .preview-import-scope {
    display: contents;
}

.preview-grid > .preview-import-scope > [data-grid-item] {
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
            'style[data-css-grid-builder-import="true"]',
        )
        .forEach((element) => {
            element.remove();
        });
}

/*
|--------------------------------------------------------------------------
| Grid Size
|--------------------------------------------------------------------------
*/

function clampItemCount() {
    const maxItems =
        columns.value *
        rows.value;

    itemCount.value =
        Math.max(
            1,
            Math.min(
                Number(itemCount.value) || 1,
                maxItems,
            ),
        );

    if (
        selectedItem.value &&
        selectedItem.value >
            itemCount.value &&
        !useImportedContent.value
    ) {
        selectedItem.value =
            null;
    }
}

function addColumn() {
    if (
        columns.value >=
        MAX_GRID_SIZE
    ) {
        return;
    }

    columns.value++;

    clampItemCount();
    cleanItemPositions();
}

function removeColumn() {
    if (
        columns.value <=
        MIN_GRID_SIZE
    ) {
        return;
    }

    columns.value--;

    clampItemCount();
    cleanItemPositions();
}

function addRow() {
    if (
        rows.value >=
        MAX_GRID_SIZE
    ) {
        return;
    }

    rows.value++;

    clampItemCount();
    cleanItemPositions();
}

function removeRow() {
    if (
        rows.value <=
        MIN_GRID_SIZE
    ) {
        return;
    }

    rows.value--;

    clampItemCount();
    cleanItemPositions();
}

/*
|--------------------------------------------------------------------------
| Clean Item Positions
|--------------------------------------------------------------------------
*/

function cleanItemPositions() {
    const positions = {
        ...itemPositions.value,
    };

    Object.keys(positions).forEach(
        (key) => {
            const position =
                positions[key];

            const invalid =
                (
                    position.columnStart &&
                    (
                        position.columnStart < 1 ||
                        position.columnStart >
                            columns.value
                    )
                ) ||
                (
                    position.columnEnd &&
                    (
                        position.columnEnd < 1 ||
                        position.columnEnd >
                            columns.value + 1
                    )
                ) ||
                (
                    position.rowStart &&
                    (
                        position.rowStart < 1 ||
                        position.rowStart >
                            rows.value
                    )
                ) ||
                (
                    position.rowEnd &&
                    (
                        position.rowEnd < 1 ||
                        position.rowEnd >
                            rows.value + 1
                    )
                );

            if (invalid) {
                delete positions[key];
            }
        },
    );

    itemPositions.value =
        positions;

    if (
        useImportedContent.value
    ) {
        nextTick(() => {
            applyImportedPositions();
        });
    }
}

/*
|--------------------------------------------------------------------------
| Get Item Position
|--------------------------------------------------------------------------
*/

function getItemPosition(item) {
    return (
        itemPositions.value[item] || {
            columnStart: null,
            columnEnd: null,
            rowStart: null,
            rowEnd: null,
        }
    );
}

/*
|--------------------------------------------------------------------------
| Update Item Position
|--------------------------------------------------------------------------
*/

function updateItemPosition(
    item,
    property,
    value,
) {
    if (value === "") {
        itemPositions.value = {
            ...itemPositions.value,

            [item]: {
                ...getItemPosition(item),

                [property]: null,
            },
        };

        if (
            useImportedContent.value
        ) {
            nextTick(() => {
                applyImportedPositions();
            });
        }

        return;
    }

    let numericValue =
        Number(value);

    if (
        !Number.isFinite(
            numericValue,
        )
    ) {
        return;
    }

    let max;

    if (
        property === "columnStart"
    ) {
        max = columns.value;
    } else if (
        property === "columnEnd"
    ) {
        max =
            columns.value + 1;
    } else if (
        property === "rowStart"
    ) {
        max = rows.value;
    } else {
        max =
            rows.value + 1;
    }

    numericValue =
        Math.max(
            1,
            Math.min(
                Math.floor(
                    numericValue,
                ),
                max,
            ),
        );

    itemPositions.value = {
        ...itemPositions.value,

        [item]: {
            ...getItemPosition(item),

            [property]:
                numericValue,
        },
    };

    if (
        useImportedContent.value
    ) {
        nextTick(() => {
            applyImportedPositions();
        });
    }
}

/*
|--------------------------------------------------------------------------
| Reset Item Position
|--------------------------------------------------------------------------
*/

function resetItemPosition(item) {
    const positions = {
        ...itemPositions.value,
    };

    delete positions[item];

    itemPositions.value =
        positions;

    if (
        useImportedContent.value
    ) {
        nextTick(() => {
            applyImportedPositions();
        });
    }
}

/*
|--------------------------------------------------------------------------
| Generated Item Style
|--------------------------------------------------------------------------
*/

function getItemStyle(item) {
    const position =
        getItemPosition(item);

    const style = {
        background:
            itemBackground.value,

        color:
            itemColor.value,

        padding:
            `${Math.max(
                0,
                Number(
                    itemPadding.value,
                ) || 0,
            )}px`,

        borderRadius:
            `${Math.max(
                0,
                Number(
                    itemBorderRadius.value,
                ) || 0,
            )}px`,

        textAlign:
            itemTextAlign.value,
    };

    if (
        position.columnStart
    ) {
        style.gridColumnStart =
            position.columnStart;
    }

    if (
        position.columnEnd
    ) {
        style.gridColumnEnd =
            position.columnEnd;
    }

    if (
        position.rowStart
    ) {
        style.gridRowStart =
            position.rowStart;
    }

    if (
        position.rowEnd
    ) {
        style.gridRowEnd =
            position.rowEnd;
    }

    return style;
}

/*
|--------------------------------------------------------------------------
| Apply Imported Positions
|--------------------------------------------------------------------------
*/

function applyImportedPositions() {
    const container =
        document.querySelector(
            ".preview-grid",
        );

    if (!container) {
        return;
    }

    const items =
        container.querySelectorAll(
            "[data-grid-item]",
        );

    items.forEach(
        (element) => {
            const item =
                Number(
                    element.getAttribute(
                        "data-grid-item",
                    ),
                );

            if (!item) {
                return;
            }

            const position =
                getItemPosition(item);

            element.style.gridColumnStart =
                position.columnStart
                    ? String(
                        position.columnStart,
                    )
                    : "";

            element.style.gridColumnEnd =
                position.columnEnd
                    ? String(
                        position.columnEnd,
                    )
                    : "";

            element.style.gridRowStart =
                position.rowStart
                    ? String(
                        position.rowStart,
                    )
                    : "";

            element.style.gridRowEnd =
                position.rowEnd
                    ? String(
                        position.rowEnd,
                    )
                    : "";
        },
    );
}

/*
|--------------------------------------------------------------------------
| Imported Item Click
|--------------------------------------------------------------------------
*/

function handleImportedItemClick(event) {
    if (
        !useImportedContent.value
    ) {
        return;
    }

    const target =
        event.target.closest(
            "[data-grid-item]",
        );

    if (!target) {
        return;
    }

    const item =
        Number(
            target.getAttribute(
                "data-grid-item",
            ),
        );

    if (!item) {
        return;
    }

    selectItem(item);
}

/*
|--------------------------------------------------------------------------
| Import HTML / CSS
|--------------------------------------------------------------------------
*/

async function applyImportedContent() {
    importError.value = "";

    if (
        !importedHTML.value.trim()
    ) {
        importError.value =
            "Please paste some HTML first.";

        return;
    }

    if (
        !processedImportedHTML.value
    ) {
        importError.value =
            "The HTML could not be processed.";

        return;
    }

    useImportedContent.value =
        true;

    selectedItem.value =
        null;

    itemPositions.value =
        {};

    await nextTick();

    updateImportedPreviewStyles();

    applyImportedPositions();
}

function clearImportedContent() {
    importedHTML.value = "";
    importedCSS.value = "";

    useImportedContent.value =
        false;

    importError.value = "";

    selectedItem.value =
        null;

    itemPositions.value =
        {};

    removeImportedPreviewStyles();
}

function useGeneratedGrid() {
    useImportedContent.value =
        false;

    selectedItem.value =
        null;

    itemPositions.value =
        {};

    removeImportedPreviewStyles();
}

/*
|--------------------------------------------------------------------------
| Copy Code
|--------------------------------------------------------------------------
*/

async function copyCode(type) {
    const contentMap = {
        html:
            generatedHTML.value,

        css:
            generatedCSS.value,

        document:
            generatedDocument.value,
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

        copied.value =
            type;

        if (copyTimeout) {
            clearTimeout(
                copyTimeout,
            );
        }

        copyTimeout =
            setTimeout(() => {
                copied.value =
                    null;
            }, 1800);
    } catch (error) {
        console.error(
            "Failed to copy code:",
            error,
        );
    }
}

/*
|--------------------------------------------------------------------------
| Download HTML
|--------------------------------------------------------------------------
*/

function downloadHTML() {
    const blob =
        new Blob(
            [
                generatedDocument.value,
            ],
            {
                type:
                    "text/html;charset=utf-8",
            },
        );

    const url =
        URL.createObjectURL(
            blob,
        );

    const link =
        document.createElement(
            "a",
        );

    link.href = url;

    link.download =
        "css-grid.html";

    document.body.appendChild(
        link,
    );

    link.click();

    link.remove();

    setTimeout(() => {
        URL.revokeObjectURL(
            url,
        );
    }, 100);
}

/*
|--------------------------------------------------------------------------
| Selection
|--------------------------------------------------------------------------
*/

function selectItem(item) {
    selectedItem.value =
        item;

    activePanel.value =
        "layout";
}

function closeItemPanel() {
    selectedItem.value =
        null;
}

/*
|--------------------------------------------------------------------------
| Reset
|--------------------------------------------------------------------------
*/

function resetGrid() {
    columns.value = 3;
    rows.value = 2;

    columnGap.value = 16;
    rowGap.value = 16;

    justifyItems.value =
        "stretch";

    alignItems.value =
        "stretch";

    justifyContent.value =
        "start";

    alignContent.value =
        "start";

    gridAutoFlow.value =
        "row";

    itemCount.value =
        6;

    selectedItem.value =
        null;

    itemPositions.value =
        {};

    containerBackground.value =
        "#ffffff";

    containerPadding.value =
        16;

    containerBorderWidth.value =
        1;

    containerBorderColor.value =
        "#e2e8f0";

    containerBorderRadius.value =
        12;

    containerShadow.value =
        "sm";

    itemBackground.value =
        "#123B7A";

    itemColor.value =
        "#ffffff";

    itemPadding.value =
        24;

    itemBorderRadius.value =
        8;

    itemTextAlign.value =
        "center";

    customCSS.value =
        "";

    importedHTML.value =
        "";

    importedCSS.value =
        "";

    useImportedContent.value =
        false;

    importError.value =
        "";

    activePanel.value =
        "layout";

    removeImportedPreviewStyles();
    removeCustomPreviewStyles();
}

/*
|--------------------------------------------------------------------------
| Watchers
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Custom CSS Live Preview
|--------------------------------------------------------------------------
*/

watch(
    customCSS,
    () => {
        updateCustomPreviewStyles();
    },
    {
        immediate: true,
    },
);

/*
|--------------------------------------------------------------------------
| Imported CSS / Content
|--------------------------------------------------------------------------
*/

watch(
    [
        importedCSS,
        useImportedContent,
    ],
    async () => {
        if (
            !useImportedContent.value
        ) {
            removeImportedPreviewStyles();

            return;
        }

        await nextTick();

        updateImportedPreviewStyles();

        applyImportedPositions();
    },
);

/*
|--------------------------------------------------------------------------
| Processed Imported HTML
|--------------------------------------------------------------------------
*/

watch(
    processedImportedHTML,
    async () => {
        if (
            !useImportedContent.value
        ) {
            return;
        }

        await nextTick();

        updateImportedPreviewStyles();

        applyImportedPositions();
    },
);

/*
|--------------------------------------------------------------------------
| Grid Dimensions
|--------------------------------------------------------------------------
*/

watch(
    [
        columns,
        rows,
    ],
    () => {
        cleanItemPositions();
    },
);

/*
|--------------------------------------------------------------------------
| Imported Content Item Count
|--------------------------------------------------------------------------
*/

watch(
    importedItemCount,
    async () => {
        if (
            !useImportedContent.value
        ) {
            return;
        }

        if (
            importedItemCount.value === 0
        ) {
            selectedItem.value =
                null;

            return;
        }

        if (
            selectedItem.value &&
            selectedItem.value >
                importedItemCount.value
        ) {
            selectedItem.value =
                null;
        }

        await nextTick();

        applyImportedPositions();
    },
);

/*
|--------------------------------------------------------------------------
| Cleanup
|--------------------------------------------------------------------------
*/

onBeforeUnmount(() => {
    removeImportedPreviewStyles();

    removeCustomPreviewStyles();

    if (copyTimeout) {
        clearTimeout(
            copyTimeout,
        );
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
                        class="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-[#1769B0] dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-300">
                        <Grid3X3 class="size-3.5" />
                        CSS BUILDER
                    </div>

                    <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
                        Visual CSS Grid Builder
                    </h1>

                    <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Build CSS Grid layouts visually, customize every detail, and
                        generate clean HTML and CSS.
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
                        <!-- Layout -->

                        <div v-if="activePanel === 'layout'">
                            <div class="mb-6 flex items-center gap-3">
                                <div
                                    class="flex size-9 items-center justify-center rounded-xl bg-cyan-50 text-[#1769B0] dark:bg-cyan-950/40 dark:text-cyan-300">
                                    <Settings2 class="size-4" />
                                </div>

                                <div>
                                    <h2 class="text-sm font-semibold">Grid Settings</h2>
                                    <p class="text-xs text-slate-500 dark:text-slate-400">
                                        Configure your layout
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
                                            <span class="px-2 text-xs text-slate-500"> Columns </span>

                                            <div class="flex items-center gap-2">
                                                <button type="button" @click="removeColumn"
                                                    :disabled="columns <= MIN_GRID_SIZE"
                                                    class="flex size-8 items-center justify-center rounded-lg bg-slate-100 transition hover:bg-cyan-50 hover:text-[#1769B0] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800">
                                                    <Minus class="size-3.5" />
                                                </button>

                                                <span class="w-8 text-center font-mono text-sm font-semibold">
                                                    {{ columns }}
                                                </span>

                                                <button type="button" @click="addColumn"
                                                    :disabled="columns >= MAX_GRID_SIZE"
                                                    class="flex size-8 items-center justify-center rounded-lg bg-slate-100 transition hover:bg-cyan-50 hover:text-[#1769B0] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800">
                                                    <Plus class="size-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div
                                            class="flex items-center justify-between rounded-xl border border-slate-200 p-2 dark:border-slate-700">
                                            <span class="px-2 text-xs text-slate-500"> Rows </span>

                                            <div class="flex items-center gap-2">
                                                <button type="button" @click="removeRow"
                                                    :disabled="rows <= MIN_GRID_SIZE"
                                                    class="flex size-8 items-center justify-center rounded-lg bg-slate-100 transition hover:bg-cyan-50 hover:text-[#1769B0] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800">
                                                    <Minus class="size-3.5" />
                                                </button>

                                                <span class="w-8 text-center font-mono text-sm font-semibold">
                                                    {{ rows }}
                                                </span>

                                                <button type="button" @click="addRow" :disabled="rows >= MAX_GRID_SIZE"
                                                    class="flex size-8 items-center justify-center rounded-lg bg-slate-100 transition hover:bg-cyan-50 hover:text-[#1769B0] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800">
                                                    <Plus class="size-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <label class="block">
                                    <span class="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-400">
                                        Grid Items
                                    </span>

                                    <input v-model.number="itemCount" @change="clampItemCount" type="number" min="1"
                                        :max="columns * rows"
                                        class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950" />
                                </label>

                                <div>
                                    <div class="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Spacing
                                    </div>

                                    <div class="grid grid-cols-2 gap-3">
                                        <label>
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Column Gap
                                            </span>

                                            <input v-model.number="columnGap" type="number" min="0" max="100"
                                                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-950" />
                                        </label>

                                        <label>
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Row Gap
                                            </span>

                                            <input v-model.number="rowGap" type="number" min="0" max="100"
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

                                            <select v-model="justifyItems"
                                                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950">
                                                <option v-for="option in alignmentOptions" :key="option"
                                                    :value="option">
                                                    {{ option }}
                                                </option>
                                            </select>
                                        </label>

                                        <label>
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Align Items
                                            </span>

                                            <select v-model="alignItems"
                                                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950">
                                                <option v-for="option in alignmentOptions" :key="option"
                                                    :value="option">
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

                                            <select v-model="justifyContent"
                                                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950">
                                                <option v-for="option in contentOptions" :key="option" :value="option">
                                                    {{ option }}
                                                </option>
                                            </select>
                                        </label>

                                        <label>
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Align Content
                                            </span>

                                            <select v-model="alignContent"
                                                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950">
                                                <option v-for="option in contentOptions" :key="option" :value="option">
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

                                    <select v-model="gridAutoFlow"
                                        class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950">
                                        <option value="row">row</option>
                                        <option value="column">column</option>
                                        <option value="row dense">row dense</option>
                                        <option value="column dense">column dense</option>
                                    </select>
                                </label>
                            </div>
                        </div>

                        <!-- Style -->

                        <div v-else-if="activePanel === 'style'">
                            <div class="mb-6 flex items-center gap-3">
                                <div
                                    class="flex size-9 items-center justify-center rounded-xl bg-cyan-50 text-[#1769B0] dark:bg-cyan-950/40 dark:text-cyan-300">
                                    <Palette class="size-4" />
                                </div>

                                <div>
                                    <h2 class="text-sm font-semibold">Visual Styles</h2>
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
                                                <input v-model="containerBackground" type="color"
                                                    class="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white" />

                                                <input v-model="containerBackground" type="text"
                                                    class="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                            </div>
                                        </label>

                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Padding
                                            </span>

                                            <input v-model.number="containerPadding" type="number" min="0" max="100"
                                                class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                        </label>

                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Border Width
                                            </span>

                                            <input v-model.number="containerBorderWidth" type="number" min="0" max="20"
                                                class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                        </label>

                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Border Color
                                            </span>

                                            <div class="flex gap-2">
                                                <input v-model="containerBorderColor" type="color"
                                                    class="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white" />

                                                <input v-model="containerBorderColor" type="text"
                                                    class="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                            </div>
                                        </label>

                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Border Radius
                                            </span>

                                            <input v-model.number="containerBorderRadius" type="number" min="0"
                                                max="100"
                                                class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                        </label>

                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Shadow
                                            </span>

                                            <select v-model="containerShadow"
                                                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950">
                                                <option v-for="option in shadowOptions" :key="option" :value="option">
                                                    {{ option }}
                                                </option>
                                            </select>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <div class="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Grid Items
                                    </div>

                                    <div class="space-y-3">
                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Background
                                            </span>

                                            <div class="flex gap-2">
                                                <input v-model="itemBackground" type="color"
                                                    class="h-10 w-12 cursor-pointer rounded-lg border border-slate-200" />

                                                <input v-model="itemBackground" type="text"
                                                    class="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                            </div>
                                        </label>

                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Text Color
                                            </span>

                                            <div class="flex gap-2">
                                                <input v-model="itemColor" type="color"
                                                    class="h-10 w-12 cursor-pointer rounded-lg border border-slate-200" />

                                                <input v-model="itemColor" type="text"
                                                    class="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                            </div>
                                        </label>

                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Padding
                                            </span>

                                            <input v-model.number="itemPadding" type="number" min="0" max="100"
                                                class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                        </label>

                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Border Radius
                                            </span>

                                            <input v-model.number="itemBorderRadius" type="number" min="0" max="100"
                                                class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                        </label>

                                        <label class="block">
                                            <span class="mb-2 block text-xs text-slate-500">
                                                Text Align
                                            </span>

                                            <select v-model="itemTextAlign"
                                                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950">
                                                <option value="left">left</option>
                                                <option value="center">center</option>
                                                <option value="right">right</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- CSS -->

                        <div v-else-if="activePanel === 'custom'">
                            <div class="mb-6 flex items-center gap-3">
                                <div
                                    class="flex size-9 items-center justify-center rounded-xl bg-cyan-50 text-[#1769B0] dark:bg-cyan-950/40 dark:text-cyan-300">
                                    <Braces class="size-4" />
                                </div>

                                <div>
                                    <h2 class="text-sm font-semibold">Custom CSS</h2>
                                    <p class="text-xs text-slate-500 dark:text-slate-400">
                                        Add your own styles
                                    </p>
                                </div>
                            </div>

                            <textarea v-model="customCSS" spellcheck="false" placeholder="/* Add custom CSS here */

.grid-container {
    min-height: 400px;
}

.grid-item {
    font-weight: 700;
}" class="min-h-[380px] w-full resize-y rounded-xl border border-slate-200 bg-[#050B14] p-4 font-mono text-xs leading-6 text-slate-300 outline-none transition focus:border-cyan-500 dark:border-slate-700"></textarea>
                        </div>

                        <!-- Import -->

                        <div v-else-if="activePanel === 'import'">
                            <div class="mb-6 flex items-center gap-3">
                                <div
                                    class="flex size-9 items-center justify-center rounded-xl bg-cyan-50 text-[#1769B0] dark:bg-cyan-950/40 dark:text-cyan-300">
                                    <Download class="size-4" />
                                </div>

                                <div>
                                    <h2 class="text-sm font-semibold">Import HTML & CSS</h2>

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

                                    <textarea v-model="importedHTML" spellcheck="false" placeholder='<div class="card">
    <h2>Hello World</h2>
    <p>Your content here...</p>
</div>

<div class="card">
    Another item
</div>' class="min-h-[240px] w-full resize-y rounded-xl border border-slate-200 bg-[#050B14] p-4 font-mono text-xs leading-6 text-slate-300 outline-none transition focus:border-cyan-500 dark:border-slate-700"></textarea>
                                </div>

                                <div>
                                    <label class="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        CSS
                                    </label>

                                    <textarea v-model="importedCSS" spellcheck="false" placeholder=".card {
    padding: 24px;
    background: #123B7A;
    color: white;
    border-radius: 12px;
}

.card h2 {
    font-size: 24px;
}" class="min-h-[220px] w-full resize-y rounded-xl border border-slate-200 bg-[#050B14] p-4 font-mono text-xs leading-6 text-slate-300 outline-none transition focus:border-cyan-500 dark:border-slate-700"></textarea>
                                </div>

                                <div v-if="importError"
                                    class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                                    {{ importError }}
                                </div>

                                <div class="grid grid-cols-2 gap-2">
                                    <button type="button" @click="applyImportedContent"
                                        class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123B7A] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1769B0]">
                                        <Eye class="size-3.5" />
                                        Use in Preview
                                    </button>

                                    <button type="button" @click="clearImportedContent"
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
                                        <li>• Top-level HTML elements become grid items.</li>
                                        <li>• Your CSS is applied to the preview.</li>
                                        <li>• Grid settings control the layout.</li>
                                        <li>• Click an imported element to edit placement.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div v-if="selectedItem" class="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
                            <div class="mb-4 flex items-center justify-between">
                                <div>
                                    <h3 class="text-sm font-semibold">Item {{ selectedItem }}</h3>

                                    <p class="text-xs text-slate-500 dark:text-slate-400">
                                        Grid placement
                                    </p>
                                </div>

                                <button type="button" @click="closeItemPanel"
                                    class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800">
                                    <X class="size-4" />
                                </button>
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <label>
                                    <span class="mb-2 block text-xs text-slate-500">
                                        Column Start
                                    </span>

                                    <input :value="getItemPosition(selectedItem).columnStart" @input="
                                        updateItemPosition(
                                            selectedItem,
                                            'columnStart',
                                            $event.target.value,
                                        )
                                        " type="number" min="1" :max="columns"
                                        class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                </label>

                                <label>
                                    <span class="mb-2 block text-xs text-slate-500">
                                        Column End
                                    </span>

                                    <input :value="getItemPosition(selectedItem).columnEnd" @input="
                                        updateItemPosition(
                                            selectedItem,
                                            'columnEnd',
                                            $event.target.value,
                                        )
                                        " type="number" min="1" :max="columns + 1"
                                        class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                </label>

                                <label>
                                    <span class="mb-2 block text-xs text-slate-500">
                                        Row Start
                                    </span>

                                    <input :value="getItemPosition(selectedItem).rowStart" @input="
                                        updateItemPosition(
                                            selectedItem,
                                            'rowStart',
                                            $event.target.value,
                                        )
                                        " type="number" min="1" :max="rows"
                                        class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                </label>

                                <label>
                                    <span class="mb-2 block text-xs text-slate-500">
                                        Row End
                                    </span>

                                    <input :value="getItemPosition(selectedItem).rowEnd" @input="
                                        updateItemPosition(
                                            selectedItem,
                                            'rowEnd',
                                            $event.target.value,
                                        )
                                        " type="number" min="1" :max="rows + 1"
                                        class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                </label>
                            </div>

                            <button type="button" @click="resetItemPosition(selectedItem)"
                                class="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-[#1769B0] dark:border-slate-700 dark:text-slate-400">
                                Reset Item Position
                            </button>
                        </div>
                    </div>
                </aside>

                <!-- Preview -->

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
                                <h2 class="text-sm font-semibold">Live Grid Editor</h2>

                                <p class="text-xs text-slate-500 dark:text-slate-400">
                                    {{ columns }} × {{ rows }} grid
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <div
                                class="hidden items-center gap-1.5 rounded-lg bg-cyan-50 px-2.5 py-1.5 text-xs font-medium text-[#1769B0] sm:flex dark:bg-cyan-950/40 dark:text-cyan-300">
                                <MousePointer2 class="size-3.5" />
                                Click to edit
                            </div>

                            <span
                                class="rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                {{ previewItemCount }} items
                            </span>
                        </div>
                    </div>

                    <div class="flex flex-1 flex-col overflow-auto bg-slate-50 p-6 dark:bg-[#050B14] sm:p-10">
                        <div
                            class="mb-5 flex items-start gap-3 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-xs text-[#1769B0] dark:border-cyan-900/50 dark:bg-cyan-950/30 dark:text-cyan-300">
                            <MousePointer2 class="mt-0.5 size-4 shrink-0" />

                            <div>
                                <p class="font-semibold">
                                    {{
                                        useImportedContent ? "Imported content" : "Build visually"
                                    }}
                                </p>
                                <p class="mt-1 leading-5 text-[#1769B0]/80 dark:text-cyan-300/70">
                                    {{ previewInstruction }}
                                </p>
                            </div>
                        </div>


                        <div
                            class="flex min-h-[480px] flex-1 items-stretch justify-stretch rounded-xl border border-dashed border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-[#09111F]">
                            <div class="min-h-[440px] w-full preview-grid" :style="previewStyle"
                                @click="handleImportedItemClick">
                                <div v-if="useImportedContent" class="contents preview-import-scope"
                                    v-html="processedImportedHTML"></div>

                                <template v-else>
                                    <button v-for="item in gridItems" :key="item" type="button"
                                        :style="getItemStyle(item)" @click="selectItem(item)"
                                        class="relative flex min-h-[60px] items-center justify-center border border-[#1769B0]/30 bg-gradient-to-br from-[#123B7A] to-[#1769B0] text-xs font-semibold text-white shadow-sm transition hover:scale-[1.01] hover:from-[#1769B0] hover:to-[#00A8C7]"
                                        :class="{
                                            'ring-2 ring-cyan-400 ring-offset-2 ring-offset-white dark:ring-cyan-400 dark:ring-offset-[#09111F]':
                                                selectedItem === item,
                                        }">
                                        {{ item }}

                                        <span v-if="selectedItem === item"
                                            class="absolute right-2 top-2 rounded-md bg-white/20 px-1.5 py-0.5 text-[9px] uppercase tracking-wide">
                                            Selected
                                        </span>
                                    </button>
                                </template>
                            </div>
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
                                repeat({{ columns }}, 1fr)
                            </span>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Generated Code -->

            <section class="mt-8">
                <div class="mb-4 flex items-center gap-3">
                    <div
                        class="flex size-9 items-center justify-center rounded-xl bg-cyan-50 text-[#1769B0] dark:bg-cyan-950/40 dark:text-cyan-300">
                        <Code2 class="size-4" />
                    </div>

                    <div>
                        <h2 class="text-lg font-semibold">Generated Code</h2>

                        <p class="text-sm text-slate-500 dark:text-slate-400">
                            HTML and CSS update automatically as you build your layout.
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

                                <span class="text-sm font-medium"> Markup </span>
                            </div>

                            <button type="button" @click="copyCode('html')"
                                class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-[#1769B0] dark:border-slate-700">
                                <Check v-if="copied === 'html'" class="size-3.5" />

                                <Copy v-else class="size-3.5" />

                                {{ copied === "html" ? "Copied" : "Copy" }}
                            </button>
                        </div>

                        <pre
                            class="min-h-[280px] overflow-x-auto bg-[#050B14] p-5 font-mono text-xs leading-6 text-slate-300">
                <code>{{ generatedHTML }}</code>
            </pre>
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

                                <span class="text-sm font-medium"> Styles </span>
                            </div>

                            <button type="button" @click="copyCode('css')"
                                class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-[#1769B0] dark:border-slate-700">
                                <Check v-if="copied === 'css'" class="size-3.5" />

                                <Copy v-else class="size-3.5" />

                                {{ copied === "css" ? "Copied" : "Copy" }}
                            </button>
                        </div>

                        <pre
                            class="min-h-[280px] overflow-x-auto bg-[#050B14] p-5 font-mono text-xs leading-6 text-slate-300">
                <code>{{ generatedCSS }}</code>
            </pre>
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

                        <h3 class="text-lg font-bold">Take your grid with you.</h3>

                        <p class="mt-1 max-w-xl text-sm leading-6 text-cyan-50/80">
                            Export a complete HTML file with your generated CSS included.
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
.preview-grid>.preview-import-scope {
    display: contents;
}

.preview-grid>.preview-import-scope>[data-grid-item] {
    box-sizing: border-box;
    min-width: 0;
    min-height: 60px;
    padding: var(--grid-item-padding);
    background: var(--grid-item-background);
    color: var(--grid-item-color);
    border-radius: var(--grid-item-radius);
    text-align: var(--grid-item-text-align);
    cursor: pointer;
    overflow-wrap: anywhere;
}

.preview-grid>.preview-import-scope>[data-grid-item]:hover {
    outline: 2px solid rgb(34 211 238 / 0.45);
    outline-offset: 2px;
}

.preview-grid>.preview-import-scope>[data-grid-item] img {
    max-width: 100%;
    height: auto;
}

.preview-grid>.preview-import-scope>[data-grid-item] video {
    max-width: 100%;
    height: auto;
}

.preview-grid>.preview-import-scope>[data-grid-item] iframe {
    max-width: 100%;
}

.preview-grid {
    min-width: 0;
}

.preview-grid>.preview-import-scope {
    min-width: 0;
}
</style>

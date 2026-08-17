<template>
    <footer
        class="border-t border-slate-200 bg-white dark:border-gray-800 dark:bg-gray-950"
    >
        <div
            class="mx-auto flex min-h-16 max-w-[1400px] flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7"
        >
            <!-- Brand -->
            <div class="flex items-center gap-3">
                <div
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-[#167fa8] dark:bg-cyan-950/40 dark:text-cyan-400"
                >
                    <span
                        class="text-[10px] font-bold tracking-tight"
                    >
                        EGD
                    </span>
                </div>

                <div class="leading-tight">
                    <p
                        class="text-xs font-semibold text-[#10233f] dark:text-gray-200"
                    >
                        CSS Builder
                    </p>

                    <p
                        class="text-[10px] text-slate-400 dark:text-gray-500"
                    >
                        Build faster. Style smarter.
                    </p>
                </div>
            </div>

            <!-- Tool Features -->
            <div
                class="hidden items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-gray-500 md:flex"
            >
                <span>CSS Tools</span>

                <span class="text-slate-300 dark:text-gray-700">
                    •
                </span>

                <span>Live Preview</span>

                <span class="text-slate-300 dark:text-gray-700">
                    •
                </span>

                <span>Code Ready</span>
            </div>

            <!-- Status -->
            <div class="flex items-center gap-3">
                <div
                    class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                >
                    <span class="relative flex h-1.5 w-1.5">
                        <span
                            class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
                        ></span>

                        <span
                            class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"
                        ></span>
                    </span>

                    <span
                        class="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
                    >
                        All systems ready
                    </span>
                </div>

                <span
                    class="hidden text-[10px] text-slate-400 dark:text-gray-500 sm:inline"
                >
                    © 2026 EGD
                </span>
            </div>
        </div>
    </footer>
</template>
<script setup lang="ts">
// The @jasy/nuxt story: one install, render a PDF on the client or on a server route. Inner {{ }} in the
// code strings are literal text (rendered via {{ }}), not Vue.
const clientCode = `<script setup>
const { open, download } = usePdf(Invoice)
<\/script>

<template>
  <button @click="open">View PDF</button>
</template>`;

const serverCode = `// server/api/invoice/[id].get.ts
export default definePdfHandler((e) =>
  Document([
    Page([
      Text(\`Invoice #\${getRouterParam(e, "id")}\`),
    ]),
  ]),
)`;

const points = [
  {
    icon: "i-lucide-wand-sparkles",
    title: "Zero config",
    text: "Add it to modules. Components and the render helpers are auto-imported - no wiring, no imports.",
  },
  {
    icon: "i-lucide-split",
    title: "Client or server",
    text: "Render in the browser with usePdf, or stream from a Nitro route with definePdfHandler. Same vocabulary.",
  },
  {
    icon: "i-lucide-zap",
    title: "Nitro caching, lean bundle",
    text: "Cache a route per path + query in one option. jimp stays server-side - the browser bundle stays small.",
  },
];
</script>

<template>
  <section class="relative border-t border-brand-100 dark:border-white/10">
    <div class="mx-auto max-w-368 px-5 py-20 sm:px-8 sm:py-24">
      <div class="flex flex-wrap items-center gap-3">
        <p class="spec-label flex items-center gap-2 text-brand-600 dark:text-brand-300">
          <UIcon name="i-simple-icons-nuxtdotjs" class="size-4 text-emerald-500" />
          @jasy/nuxt · the Nuxt module
        </p>
        <span
          class="spec-label rounded-full bg-accent-400/15 px-2.5 py-1 text-brand-700 ring-1 ring-inset ring-accent-400/40 dark:text-accent-300"
          >new · on npm</span
        >
      </div>

      <h2
        class="mt-4 font-display text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl dark:text-white"
      >
        Drop it into
        <span class="relative whitespace-nowrap">
          Nuxt
          <svg
            class="absolute -bottom-1.5 left-0 w-full"
            height="10"
            viewBox="0 0 120 10"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M2 7 C 36 2, 84 2, 118 6"
              stroke="#f3dc29"
              stroke-width="4"
              stroke-linecap="round"
            />
          </svg> </span
        >.
      </h2>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-brand-900/70 dark:text-white/65">
        One install, zero config. Author PDFs as components and render them right in the browser, or
        stream them from a server route - your choice, the same components and helpers on both
        sides.
      </p>

      <div class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
        <NuxtLink
          to="/docs/nuxt"
          class="group inline-flex items-center gap-1.5 font-semibold text-brand-700 transition-colors hover:text-brand-900 dark:text-brand-300 dark:hover:text-white"
        >
          Read the Nuxt guide
          <UIcon
            name="i-lucide-arrow-right"
            class="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </NuxtLink>
        <code
          class="rounded bg-brand-50 px-2 py-1 font-mono text-sm text-brand-700 dark:bg-white/10 dark:text-brand-200"
          >npx nuxi module add @jasy/nuxt</code
        >
      </div>

      <!-- two ways, side by side -->
      <div class="mt-12 grid gap-6 lg:grid-cols-2">
        <div
          class="overflow-hidden rounded-2xl border border-brand-200/70 bg-white/70 shadow-sm dark:border-white/10 dark:bg-white/5"
        >
          <div
            class="flex items-center gap-2 border-b border-brand-100 px-4 py-2.5 dark:border-white/10"
          >
            <UIcon name="i-lucide-globe" class="size-4 text-brand-400 dark:text-brand-300" />
            <span class="font-mono text-xs text-brand-600 dark:text-brand-300">in the browser</span>
          </div>
          <pre
            class="h-full overflow-x-auto bg-brand-900 p-5 font-mono text-[0.8rem] leading-relaxed text-white/90 dark:bg-black/30"
          ><code>{{ clientCode }}</code></pre>
        </div>

        <div
          class="overflow-hidden rounded-2xl border border-brand-200/70 bg-white/70 shadow-sm dark:border-white/10 dark:bg-white/5"
        >
          <div
            class="flex items-center gap-2 border-b border-brand-100 px-4 py-2.5 dark:border-white/10"
          >
            <UIcon name="i-lucide-server" class="size-4 text-brand-400 dark:text-brand-300" />
            <span class="font-mono text-xs text-brand-600 dark:text-brand-300"
              >on a server route</span
            >
          </div>
          <pre
            class="h-full overflow-x-auto bg-brand-900 p-5 font-mono text-[0.8rem] leading-relaxed text-white/90 dark:bg-black/30"
          ><code>{{ serverCode }}</code></pre>
        </div>
      </div>

      <!-- the points -->
      <ul class="mt-10 grid gap-8 sm:grid-cols-3">
        <li v-for="p in points" :key="p.title" class="group">
          <div
            class="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 transition-colors group-hover:bg-accent-400/20 group-hover:text-brand-700 dark:bg-white/5 dark:text-brand-300 dark:ring-white/10 dark:group-hover:text-accent-300"
          >
            <UIcon :name="p.icon" class="size-6" />
          </div>
          <h3 class="mt-4 font-display text-lg font-bold text-brand-900 dark:text-white">
            {{ p.title }}
          </h3>
          <p class="mt-1 leading-relaxed text-brand-900/65 dark:text-white/60">{{ p.text }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

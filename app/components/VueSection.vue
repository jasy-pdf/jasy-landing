<script setup lang="ts">
// The Vue authoring story. The inner {{ }} in `code` are literal text (rendered via {{ code }}), not Vue.
const code = `<Document>
  <Page :gap="12">
    <Text :size="30" bold>{{ invoice.title }}</Text>

    <Row
      v-for="line in invoice.lines"
      :key="line.id"
      :justify="'between'"
    >
      <Text>{{ line.name }}</Text>
      <Text bold>{{ line.total }} €</Text>
    </Row>
  </Page>
</Document>`;

const points = [
  {
    icon: "i-lucide-component",
    title: "Components & props",
    text: "Author a document the way you build an app - reusable components, props and slots.",
  },
  {
    icon: "i-lucide-repeat",
    title: "v-for, v-if, computed",
    text: "Your reactive data drives the page; loops, conditions and computed values just work.",
  },
  {
    icon: "i-lucide-globe",
    title: "Renders in the browser",
    text: "The isomorphic engine turns the component tree into a PDF client-side - no server required.",
  },
];
</script>

<template>
  <section class="relative border-t border-brand-100 dark:border-white/10">
    <div class="mx-auto max-w-368 px-5 py-20 sm:px-8 sm:py-24">
      <div class="flex flex-wrap items-center gap-3">
        <p class="spec-label text-brand-600 dark:text-brand-300">@jasy/vue · PDFs as Vue components</p>
        <span
          class="spec-label rounded-full bg-accent-400/15 px-2.5 py-1 text-brand-700 ring-1 ring-inset ring-accent-400/40 dark:text-accent-300"
          >new · on npm</span
        >
      </div>

      <h2
        class="mt-4 font-display text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl dark:text-white"
      >
        Your PDF is a
        <span class="relative whitespace-nowrap">
          Vue component
          <svg
            class="absolute -bottom-1.5 left-0 w-full"
            height="10"
            viewBox="0 0 200 10"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M2 7 C 60 2, 140 2, 198 6" stroke="#f3dc29" stroke-width="4" stroke-linecap="round" />
          </svg> </span
        >.
      </h2>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-brand-900/70 dark:text-white/65">
        Author a document the way you build an app - components, props, slots and your reactive data -
        then render it to a real PDF, right in the browser. Real layout and pagination underneath, fully
        typed props, and a familiar feel if you have reached for
        <code class="rounded bg-brand-50 px-1.5 py-0.5 font-mono text-sm text-brand-700 dark:bg-white/10 dark:text-brand-200"
          >@react-pdf/renderer</code
        >
        on the React side.
      </p>

      <div class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
        <NuxtLink
          to="/docs/vue"
          class="group inline-flex items-center gap-1.5 font-semibold text-brand-700 transition-colors hover:text-brand-900 dark:text-brand-300 dark:hover:text-white"
        >
          Read the Vue guide
          <UIcon
            name="i-lucide-arrow-right"
            class="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </NuxtLink>
        <code
          class="rounded bg-brand-50 px-2 py-1 font-mono text-sm text-brand-700 dark:bg-white/10 dark:text-brand-200"
          >pnpm add @jasy/vue@alpha vue</code
        >
      </div>

      <div class="mt-12 grid gap-8 lg:grid-cols-2 lg:items-center">
        <!-- the code -->
        <div
          class="overflow-hidden rounded-2xl border border-brand-200/70 bg-white/70 shadow-sm dark:border-white/10 dark:bg-white/5"
        >
          <div
            class="flex items-center gap-2 border-b border-brand-100 px-4 py-2.5 dark:border-white/10"
          >
            <UIcon name="i-lucide-file-code" class="size-4 text-brand-400 dark:text-brand-300" />
            <span class="font-mono text-xs text-brand-600 dark:text-brand-300">Invoice.vue</span>
          </div>
          <pre
            class="overflow-x-auto bg-brand-900 p-5 font-mono text-[0.8rem] leading-relaxed text-white/90 dark:bg-black/30"
          ><code>{{ code }}</code></pre>
          <div
            class="border-t border-brand-100 px-4 py-3 font-mono text-xs text-brand-600 dark:border-white/10 dark:text-brand-300"
          >
            const bytes = await renderToPdf(Invoice)
            <span class="text-brand-400 dark:text-white/45">// → a PDF, right in the browser</span>
          </div>
        </div>

        <!-- the points -->
        <ul class="space-y-6">
          <li v-for="p in points" :key="p.title" class="group flex items-start gap-5">
            <div
              class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 transition-colors group-hover:bg-accent-400/20 group-hover:text-brand-700 dark:bg-white/5 dark:text-brand-300 dark:ring-white/10 dark:group-hover:text-accent-300"
            >
              <UIcon :name="p.icon" class="size-6" />
            </div>
            <div>
              <h3 class="font-display text-lg font-bold text-brand-900 dark:text-white">{{ p.title }}</h3>
              <p class="mt-1 leading-relaxed text-brand-900/65 dark:text-white/60">{{ p.text }}</p>
            </div>
          </li>
        </ul>
      </div>

    </div>
  </section>
</template>

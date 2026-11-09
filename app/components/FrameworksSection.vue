<script setup lang="ts">
// The banner under the hero: one engine, a binding per framework, each in that framework's own idiom.
const { t } = useI18n();
const to = useLocalizedTo();

const frameworks = [
  {
    name: "Vue",
    pkg: "@jasy/vue",
    icon: "i-simple-icons-vuedotjs",
    color: "text-emerald-500",
    idiom: '<Text :size="24">',
    docs: "/docs/vue",
  },
  {
    name: "React",
    pkg: "@jasy/react",
    icon: "i-simple-icons-react",
    color: "text-sky-400",
    idiom: "<Text size={24}>",
    docs: "/docs/react",
  },
  {
    name: "Angular",
    pkg: "@jasy/angular",
    icon: "i-simple-icons-angular",
    color: "text-rose-500",
    idiom: "pdfResource()",
    docs: "/docs/angular",
  },
  {
    name: "Nuxt",
    pkg: "@jasy/nuxt",
    icon: "i-simple-icons-nuxtdotjs",
    color: "text-emerald-400",
    idiom: "usePdf()",
    docs: "/docs/nuxt",
  },
];

const facts = computed(() => [
  t("home.frameworks.fact1"),
  t("home.frameworks.fact2"),
  t("home.frameworks.fact3"),
  t("home.frameworks.fact4"),
]);
</script>

<template>
  <section class="relative overflow-hidden bg-brand-900 text-white dark:bg-black/40">
    <div
      class="blueprint pointer-events-none absolute inset-0 opacity-[0.07] invert"
      aria-hidden="true"
    />

    <div class="relative mx-auto max-w-368 px-5 py-14 sm:px-8 sm:py-16">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:items-center">
        <div>
          <p class="spec-label text-accent-400">{{ t("home.frameworks.label") }}</p>
          <h2 class="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {{ t("home.frameworks.h2Before") }}
            <span class="text-accent-400">{{ t("home.frameworks.h2Highlight") }}</span>
          </h2>
          <p class="mt-4 max-w-xl leading-relaxed text-white/70">
            {{ t("home.frameworks.lead") }}
          </p>
        </div>

        <ul class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <li v-for="f in frameworks" :key="f.name">
            <NuxtLink
              :to="to(f.docs)"
              class="group flex h-full flex-col rounded-2xl bg-white/5 p-4 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/10 hover:ring-accent-400/50"
            >
              <UIcon :name="f.icon" :class="['size-8', f.color]" />
              <span class="mt-3 font-display text-lg font-bold">{{ f.name }}</span>
              <span class="font-mono text-xs text-white/55">{{ f.pkg }}</span>
              <code
                class="mt-3 self-start whitespace-nowrap rounded bg-black/30 px-2 py-1 font-mono text-[0.68rem] text-accent-300 sm:text-xs"
                >{{ f.idiom }}</code
              >
            </NuxtLink>
          </li>
        </ul>
      </div>

      <ul
        class="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6 font-mono text-sm text-white/75"
      >
        <li v-for="fact in facts" :key="fact" class="flex items-center gap-2">
          <UIcon name="i-lucide-check" class="size-4 text-accent-400" />
          {{ fact }}
        </li>
      </ul>
    </div>
  </section>
</template>

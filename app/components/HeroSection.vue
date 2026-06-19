<script setup lang="ts">
const installCmd = "pnpm add @jasy/pdf";
const copied = ref(false);

async function copyInstall() {
  try {
    await navigator.clipboard.writeText(installCmd);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1600);
  } catch {
    // Clipboard blocked (insecure context) — leave the command visible to select manually.
  }
}

const pills = ["no chromium", "no jvm", "AFM + TrueType", "real pagination", "EN-16931", "MIT"];
</script>

<template>
  <section id="top" class="relative overflow-hidden">
    <div class="blueprint blueprint-fade pointer-events-none absolute inset-0" aria-hidden="true" />

    <div class="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
      <div
        class="absolute left-6 top-24 size-3 border-l-2 border-t-2 border-brand-300 dark:border-brand-400/60"
      />
      <div
        class="absolute right-6 top-24 size-3 border-r-2 border-t-2 border-brand-300 dark:border-brand-400/60"
      />
    </div>

    <div class="relative mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:pb-28">
      <div class="max-w-3xl">
        <p class="spec-label text-brand-600 dark:text-brand-300">
          @jasy/pdf <span class="text-brand-400">·</span> declarative pdf engine
          <span class="text-brand-400">·</span> pure typescript
        </p>

        <h1
          class="mt-5 font-display text-[2.6rem] font-bold leading-[1.04] tracking-tight text-brand-900 sm:text-6xl dark:text-white"
        >
          Create
          <span class="relative whitespace-nowrap">
            PDFs
            <svg
              class="absolute -bottom-1.5 left-0 w-full"
              height="10"
              viewBox="0 0 200 10"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M2 7 C 60 2, 140 2, 198 6"
                stroke="#f3dc29"
                stroke-width="4"
                stroke-linecap="round"
              />
            </svg>
          </span>
          easier than ever.
        </h1>

        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-brand-900/70 dark:text-white/65">
          A declarative, component-based PDF engine in pure TypeScript — write components, get
          paper.
          <span class="font-medium text-brand-900 dark:text-white"
            >ZUGFeRD &amp; XRechnung compliant</span
          >, with no headless browser and no Java underneath.
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <UButton
            to="#features"
            size="lg"
            color="primary"
            trailing-icon="i-lucide-arrow-down"
            class="font-medium"
          >
            See how it works
          </UButton>
          <UButton
            to="https://github.com/jasy-pdf"
            target="_blank"
            size="lg"
            color="neutral"
            variant="outline"
            icon="i-simple-icons-github"
            class="font-medium"
          >
            GitHub
          </UButton>

          <button
            type="button"
            class="group inline-flex items-center gap-2 rounded-lg border border-brand-200 bg-white/60 px-3.5 py-2 font-mono text-sm text-brand-800 transition-colors hover:border-brand-400 dark:border-white/10 dark:bg-white/5 dark:text-brand-100"
            @click="copyInstall"
          >
            <span class="text-brand-400">$</span>
            <span>{{ installCmd }}</span>
            <UIcon
              :name="copied ? 'i-lucide-check' : 'i-lucide-copy'"
              class="size-4 text-brand-400 transition group-hover:text-brand-600"
            />
          </button>
        </div>
      </div>

      <div class="mt-14 lg:mt-20">
        <HeroDemo />
      </div>

      <ul class="mt-12 flex flex-wrap items-center gap-x-2.5 gap-y-2 lg:mt-16">
        <li
          v-for="pill in pills"
          :key="pill"
          class="spec-label rounded-full border border-brand-200/80 bg-white/50 px-3 py-1 text-brand-700 dark:border-white/10 dark:bg-white/5 dark:text-brand-200"
        >
          {{ pill }}
        </li>
      </ul>
    </div>
  </section>
</template>

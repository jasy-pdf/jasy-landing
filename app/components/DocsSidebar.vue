<script setup lang="ts">
// The docs section tree, shared by the desktop sidebar and the mobile collapsible menu.
type NavItem = { path: string; title: string; children?: NavItem[] };
defineProps<{ sections: NavItem[] }>();
</script>

<template>
  <div class="space-y-5 text-sm">
    <div v-for="section in sections" :key="section.path">
      <!-- A section with children is a group: a non-clickable title, every page listed below. -->
      <template v-if="section.children?.length">
        <p class="font-semibold text-default">{{ section.title }}</p>
        <ul class="mt-2 space-y-1 border-l border-default">
          <li v-for="child in section.children" :key="child.path">
            <NuxtLink
              :to="child.path"
              class="-ml-px block border-l border-transparent py-1 pl-4 text-muted transition-colors hover:text-default"
              active-class="!border-primary font-medium !text-primary"
            >
              {{ child.path === section.path ? "Overview" : child.title }}
            </NuxtLink>
          </li>
        </ul>
      </template>
      <!-- A standalone page (Introduction, CLI) stays a clickable link. -->
      <NuxtLink v-else :to="section.path" class="block font-semibold text-default">
        {{ section.title }}
      </NuxtLink>
    </div>
  </div>
</template>

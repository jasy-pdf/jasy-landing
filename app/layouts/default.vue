<template>
  <div class="flex min-h-dvh flex-col">
    <TheHeader />
    <main class="flex-1">
      <slot />
    </main>
    <TheFooter />
    <CookieNotice />
  </div>
</template>

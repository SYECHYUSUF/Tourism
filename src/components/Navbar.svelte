<script lang="ts">
  import { page } from "$app/stores";
  import {
    Compass,
    LogOut,
    Menu,
    X,
    ChevronDown,
    User,
    Heart,
    ShieldCheck
  } from "lucide-svelte";
  import LangSwitcher from "$components/LangSwitcher.svelte";
  import { t } from "$lib/i18n";
  import { onMount } from "svelte";
  import { hasStoredPrefs } from "$lib/prefs";
  import type { AppUser } from "$lib/types";

  export let user: AppUser | null = null;

  let scrolled = false;
  let isHome = false;
  let mobileMenuOpen = false;
  let userDropdownOpen = false;
  let userDropdownRef: HTMLDivElement | null = null;
  let hasPrefs = false;

  $: activeUser = $page.data.user || user;
  $: isHome = $page.url.pathname === "/" || $page.url.pathname === "/home";

  function updateHasPrefs() {
    if (typeof window === "undefined") return;
    hasPrefs = Boolean(
      $page.data?.hasSavedPrefs ||
      hasStoredPrefs() ||
      $page.url.pathname === "/results" ||
      $page.url.searchParams.has("categories")
    );
  }

  // Track scroll on the client
  function handleScroll() {
    scrolled = window.scrollY > 40;
  }

  function handleClickOutside(event: MouseEvent) {
    if (
      userDropdownOpen &&
      userDropdownRef &&
      !userDropdownRef.contains(event.target as Node)
    ) {
      userDropdownOpen = false;
    }
  }

  onMount(() => {
    handleScroll();
    updateHasPrefs();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClickOutside);
    };
  });

  // Close mobile and user menu on page navigation, update prefs status
  $: if ($page.url.pathname || $page.data) {
    mobileMenuOpen = false;
    userDropdownOpen = false;
    updateHasPrefs();
  }

  $: clear = isHome && !scrolled && !mobileMenuOpen;
</script>

<header
  class={`${isHome ? "fixed" : "sticky"} inset-x-0 top-0 z-30 border-b transition-colors duration-300 ${clear ? "border-transparent bg-transparent text-white" : "border-line bg-canvas/90 text-ink backdrop-blur"}`}
>
  <div
    class="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 lg:px-10"
  >
    <!-- Logo -->
    <a
      href={activeUser ? "/home" : "/"}
      class="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight"
    >
      <Compass size={22} class={clear ? "text-white" : "text-brand"} />
      Jelajah
    </a>

    <!-- Desktop nav -->
    <nav class="hidden items-center gap-8 md:flex">
      {#if activeUser}
        <a
          href="/home"
          class={`text-base font-semibold transition ${clear ? "text-white/85 hover:text-white" : "text-slate-600 hover:text-brand"} ${$page.url.pathname === "/home" ? (clear ? "!text-white font-bold" : "!text-brand font-bold") : ""}`}
        >
          {$t.nav.home}
        </a>
        <a
          href="/find"
          class={`text-base font-semibold transition ${clear ? "text-white/85 hover:text-white" : "text-slate-600 hover:text-brand"} ${$page.url.pathname === "/find" ? (clear ? "!text-white font-bold" : "!text-brand font-bold") : ""}`}
        >
          {$t.nav.preferences}
        </a>
        {#if hasPrefs}
          <a
            href="/results"
            class={`text-base font-semibold transition ${clear ? "text-white/85 hover:text-white" : "text-slate-600 hover:text-brand"} ${$page.url.pathname === "/results" ? (clear ? "!text-white font-bold" : "!text-brand font-bold") : ""}`}
          >
            {$t.nav.explore}
          </a>
        {/if}
        {#if activeUser.role === "admin"}
          <a
            href="/admin"
            class={`text-base font-semibold transition ${clear ? "text-white/85 hover:text-white" : "text-slate-600 hover:text-brand"} ${$page.url.pathname.startsWith("/admin") ? (clear ? "!text-white font-bold" : "!text-brand font-bold") : ""}`}
          >
            {$t.nav.admin}
          </a>
        {/if}
      {:else}
        <a
          href="/#how"
          class={`text-base font-semibold transition ${clear ? "text-white/85 hover:text-white" : "text-slate-600 hover:text-brand"}`}
        >
          {$t.nav.howItWorks}
        </a>
        <a
          href="/find"
          class={`text-base font-semibold transition ${clear ? "text-white/85 hover:text-white" : "text-slate-600 hover:text-brand"} ${$page.url.pathname === "/find" ? (clear ? "!text-white font-bold" : "!text-brand font-bold") : ""}`}
        >
          {$t.nav.preferences}
        </a>
        {#if hasPrefs}
          <a
            href="/results"
            class={`text-base font-semibold transition ${clear ? "text-white/85 hover:text-white" : "text-slate-600 hover:text-brand"} ${$page.url.pathname === "/results" ? (clear ? "!text-white font-bold" : "!text-brand font-bold") : ""}`}
          >
            {$t.nav.explore}
          </a>
        {/if}
      {/if}
    </nav>

    <!-- Right actions -->
    <div class="flex items-center gap-3">
      <LangSwitcher {clear} />

      {#if activeUser}
        <!-- User dropdown -->
        <div class="relative hidden sm:block" bind:this={userDropdownRef}>
          <button
            type="button"
            on:click={() => (userDropdownOpen = !userDropdownOpen)}
            class={`flex items-center gap-2 border px-3 py-1.5 text-xs font-bold transition rounded-sm ${clear ? "border-white/40 bg-white/10 text-white hover:bg-white/20" : "border-line bg-white hover:border-slate-400 text-ink shadow-sm"}`}
            aria-expanded={userDropdownOpen}
            aria-haspopup="true"
          >
            <User size={15} class={clear ? "text-emerald-300" : "text-brand"} />
            <span class="max-w-[130px] truncate">{activeUser.name || 'User'}</span>
            <ChevronDown size={14} class={`transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {#if userDropdownOpen}
            <div
              class="absolute right-0 mt-2 w-56 border border-line bg-white py-2 text-ink shadow-xl rounded-sm z-50 animate-in fade-in slide-in-from-top-1"
            >
              <div class="border-b border-line px-4 py-2">
                <p class="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  {$t.nav.signedInAs ?? 'Masuk sebagai'}
                </p>
                <p class="truncate text-sm font-bold text-ink">{activeUser.name}</p>
                {#if activeUser.email}
                  <p class="truncate text-xs text-slate-soft">{activeUser.email}</p>
                {/if}
              </div>

              <div class="py-1">
                <a
                  href="/wishlist"
                  on:click={() => (userDropdownOpen = false)}
                  class="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold transition hover:bg-slate-50 hover:text-brand"
                >
                  <Heart size={16} class="text-rose-500 fill-rose-500/20" />
                  <span>{$t.nav.wishlist}</span>
                </a>

                {#if activeUser.role === 'admin'}
                  <a
                    href="/admin"
                    on:click={() => (userDropdownOpen = false)}
                    class="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                  >
                    <ShieldCheck size={16} />
                    <span>{$t.nav.admin}</span>
                  </a>
                {/if}
              </div>

              <div class="border-t border-line pt-1">
                <form method="POST" action="/logout">
                  <button
                    type="submit"
                    class="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    <span>{$t.nav.signOut}</span>
                  </button>
                </form>
              </div>
            </div>
          {/if}
        </div>
      {:else}
        <a
          href="/login"
          class={`mono hidden sm:inline-block px-5 py-2.5 text-xs sm:text-[13px] uppercase tracking-wider font-bold transition ${clear ? "bg-white text-ink hover:bg-brand hover:text-white" : "bg-ink text-white hover:bg-brand"}`}
        >
          Login/Sign In
        </a>
      {/if}

      <!-- Mobile menu toggle button -->
      <button
        type="button"
        on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
        aria-label="Toggle navigation menu"
        class={`grid h-9 w-9 place-items-center border md:hidden transition ${clear ? "border-white/40 text-white" : "border-line text-ink"}`}
      >
        {#if mobileMenuOpen}
          <X size={18} />
        {:else}
          <Menu size={18} />
        {/if}
      </button>
    </div>
  </div>

  <!-- Mobile dropdown menu -->
  {#if mobileMenuOpen}
    <div
      class="border-b border-line bg-canvas/98 px-5 py-6 text-ink shadow-xl backdrop-blur md:hidden"
    >
      <div class="flex flex-col space-y-4">
        {#if activeUser}
          <div class="border-b border-line pb-3">
            <p class="text-xs text-slate-soft uppercase tracking-wider">
              {$t.nav.signedInAs ?? 'Masuk sebagai'}
            </p>
            <p class="font-bold text-ink text-base">{activeUser.name}</p>
            <div class="mt-2 flex flex-col gap-1 border-t border-line pt-2">
              <a
                href="/wishlist"
                class="flex items-center gap-2 py-1 text-sm font-bold text-rose-600 hover:text-rose-700"
              >
                <Heart size={15} class="fill-rose-500/20" />
                {$t.nav.wishlist}
              </a>
            </div>
          </div>
          <a
            href="/home"
            class="text-base font-semibold py-1.5 hover:text-brand"
            >{$t.nav.home}</a
          >
          <a
            href="/find"
            class="text-base font-semibold py-1.5 hover:text-brand"
            >{$t.nav.preferences}</a
          >
          {#if hasPrefs}
            <a
              href="/results"
              class="text-base font-semibold py-1.5 hover:text-brand"
              >{$t.nav.explore}</a
            >
          {/if}
          {#if activeUser.role === "admin"}
            <a
              href="/admin"
              class="text-base font-bold py-1.5 text-emerald-deep"
              >{$t.nav.admin}</a
            >
          {/if}
          <form method="POST" action="/logout">
            <button
              type="submit"
              class="flex w-full items-center gap-2 border-t border-line pt-4 text-left font-bold text-red-600"
            >
              <LogOut size={16} />
              {$t.nav.signOut}
            </button>
          </form>
        {:else}
          <a
            href="/#how"
            class="text-base font-semibold py-1.5 hover:text-brand"
            >{$t.nav.howItWorks}</a
          >
          <a
            href="/find"
            class="text-base font-semibold py-1.5 hover:text-brand"
            >{$t.nav.preferences}</a
          >
          {#if hasPrefs}
            <a
              href="/results"
              class="text-base font-semibold py-1.5 hover:text-brand"
              >{$t.nav.explore}</a
            >
          {/if}
          <a
            href="/login"
            class="mt-2 block bg-brand py-3 text-center text-base font-bold text-white shadow-sm"
          >
            Login/Sign In
          </a>
        {/if}
      </div>
    </div>
  {/if}
</header>

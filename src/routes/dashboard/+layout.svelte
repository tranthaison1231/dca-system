<script lang="ts">
  import Logo from "$lib/components/Logo.svelte";
  import SignedIn from "clerk-sveltekit/client/SignedIn.svelte";
  import UserButton from "clerk-sveltekit/client/UserButton.svelte";
  import { Settings } from "lucide-svelte";
</script>

<div class="border-b py-3">
  <div class="flex justify-between max-w-7xl mx-auto px-3">
    <a class="flex items-center gap-2" href="/dashboard">
      <Logo />
      <span class="text-xl font-medium">CoinInvest</span>
    </a>
    <div class="flex gap-3">
      <a href="/dashboard/portfolio-setting">
        <Settings size={30} />
      </a>
      <SignedIn>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonPopoverFooter: "hidden",
              userButtonPopoverActionButton__manageAccount: "hidden",
            },
          }}
        />
      </SignedIn>
    </div>
  </div>
</div>
<div class="max-w-7xl py-5 w-full mx-auto px-3">
  <slot />
</div>

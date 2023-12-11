<script lang="ts">
  import Logo from "$lib/components/icons/Logo.svelte";
  import SignedIn from "clerk-sveltekit/client/SignedIn.svelte";
  import UserButton from "clerk-sveltekit/client/UserButton.svelte";
  import InfinityScrollText from "./InfinityScrollText.svelte";
</script>

<div class="border-b py-3">
  <div class="flex justify-end px-6">
    <div class="flex w-full">
      <a class="block md:hidden" href="/dashboard">
        <Logo />
      </a>

      <InfinityScrollText />
      <div class="flex gap-3 ml-3">
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
</div>

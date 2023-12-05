<script lang="ts">
  import Logo from "$lib/components/Logo.svelte";
  import SignedIn from "clerk-sveltekit/client/SignedIn.svelte";
  import UserButton from "clerk-sveltekit/client/UserButton.svelte";
</script>

<div class="border-b py-3">
  <div class="flex justify-end px-4">
    <div class="flex gap-3 justify-between md:justify-end n w-full">
      <a class="block md:hidden" href="/dashboard">
        <Logo />
      </a>
      <div class="flex gap-3">
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

<script lang="ts">
  import SignIn from "clerk-sveltekit/client/SignIn.svelte";
</script>

<div
  class="h-screen flex items-center justify-center [&_.cl-card>div:nth-child(4)]:hidden"
>
  <SignIn
    redirectUrl="/dashboard"
    appearance={{
      elements: {
        headerTitle: "text-center",
        headerSubtitle: "hidden",
        footer: "hidden",
      },
    }}
  />
</div>

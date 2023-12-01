<script lang="ts">
  import SignIn from "clerk-sveltekit/client/SignIn.svelte";
</script>

<div class="h-screen flex items-center justify-center">
  <SignIn redirectUrl="/dashboard" />
</div>

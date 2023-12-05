<script lang="ts">
  import Header from "./Header.svelte";
  import Sidebar from "./Sidebar.svelte";
  import TabBar from "./TabBar.svelte";
</script>

<div class="w-full flex">
  <div class="hidden md:block">
    <Sidebar />
  </div>
  <div class="w-full">
    <Header />
    <div class="p-6 overflow-y-scroll w-full h-[calc(100vh-118px)]">
      <slot />
    </div>
    <div class="block md:hidden">
      <TabBar />
    </div>
  </div>
</div>

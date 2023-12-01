<script lang="ts">
  export let value: number | undefined = undefined;
</script>

<div class="w-20 bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700">
  <div
    class="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500"
    style={`width: ${value}%`}
  ></div>
</div>

<script lang="ts">
  export let style = "";
  export let pauseOnHover = false;
  export let pauseOnClick = false;
  export let direction = "left";
  export let speed = 100;

  export let gap = "0px";

  let containerWidth;
  let marqueeWidth;

  $: duration =
    marqueeWidth < containerWidth
      ? containerWidth / speed
      : marqueeWidth / speed;
</script>

<div
  {style}
  class="flex w-full overflow-x-hidden flex-row relative"
  bind:clientWidth={containerWidth}
  style:--gap={gap}
  style:--direction={direction === "left" ? "normal" : "reverse"}
  style:--duration={duration + "s"}
  style:--pause-on-hover={pauseOnHover ? "paused" : "running"}
  style:--pause-on-click={pauseOnClick ? "paused" : "running"}
>
  <div class="marquee" bind:clientWidth={marqueeWidth}>
    <slot />
  </div>
  <div class="marquee" data-testid="marquee-slot">
    <slot />
  </div>
</div>

<style>
  .marquee {
    flex: 0 0 auto;
    min-width: 100%;
    z-index: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--gap, 0);
    animation: scroll var(--duration) linear infinite;
    animation-play-state: var(--play);
    animation-direction: var(--direction);
    padding-right: var(--gap, 0);
  }

  @keyframes scroll {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
</style>

<script lang="ts">
  import * as Table from ".";
  import { get } from "lodash-es";

  type T = $$Generic;

  export let columns: Table.Column[];
  export let loading = false;
  export let dataSource: T[] = [];
</script>

<Table.Root>
  <Table.Header>
    <Table.Row class="uppercase font-bold">
      {#each columns as column}
        <Table.Head class={column.titleClass}>{column.title}</Table.Head>
      {/each}
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#if loading}
      {#each { length: 8 } as _}
        <Table.Row>
          {#each columns as _}
            <Table.Cell>
              <div class="w-full h-6 animate-pulse bg-gray-200 rounded-full" />
            </Table.Cell>
          {/each}
        </Table.Row>
      {/each}
    {:else if !dataSource.length}
      <Table.Row>
        <Table.Cell class="font-bold text-center h-96 text-gray-400" colspan={3}
          >Empty
        </Table.Cell>
      </Table.Row>
    {:else}
      {#each dataSource as source}
        <Table.Row>
          {#each columns as column}
            {@const value = get(source, column.dataIndex)}
            <Table.Cell class={column.cellClass}>
              <slot name="cell" {source} {column} {value} />
            </Table.Cell>
          {/each}
        </Table.Row>
      {/each}
    {/if}
  </Table.Body>
</Table.Root>

<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { createTransactionSchema } from "$lib/utils/schema";
  import type { ExtendCurrency } from "$lib/utils/type";
  import { createMutation } from "@tanstack/svelte-query";
  import { Plus } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import { superForm, superValidateSync } from "sveltekit-superforms/client";
  import type * as z from "zod";
  import * as Select from "$lib/components/ui/select";
  import type { Selected } from "bits-ui";

  export let open = false;
  export let currency: ExtendCurrency;

  async function createTransaction(
    data: z.infer<typeof createTransactionSchema>
  ) {
    const res = await fetch(`/api/currencies/${currency.id}/transactions`, {
      method: "POST",
      body: JSON.stringify({
        ...data,
        timestamp: data.timestamp.toISOString(),
      }),
    });
    const json = await res.json();
    if (!(res.status === 200)) {
      throw new Error(json.message);
    }
    return json;
  }

  const createTransactionMutate = createMutation({
    mutationFn: createTransaction,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Transaction has been created!");
    },
  });

  const { form, errors, constraints, enhance, reset } = superForm(
    superValidateSync(
      {
        price: currency.price,
        amount: 0.01,
        timestamp: new Date(),
        type: "BUY",
      },
      createTransactionSchema
    ),
    {
      id: `create-transaction-${currency.id}`,
      SPA: true,
      validators: createTransactionSchema,
      taintedMessage: false,
      onUpdate: async ({ form }) => {
        if (form.valid) {
          $createTransactionMutate.mutate(form.data);
        }
      },
    }
  );

  function handleSelectedChange(
    selected: Selected<"SELL" | "BUY"> | undefined
  ) {
    if (selected?.value) {
      $form.type = selected.value;
    }
  }
</script>

<Dialog.Root bind:open onOpenChange={() => reset()}>
  <Dialog.Trigger>
    <Plus />
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[500px]">
    <Dialog.Header>
      <Dialog.Title>Add Transaction</Dialog.Title>
    </Dialog.Header>
    <form method="POST" use:enhance>
      <Label label="Type" required></Label>
      <Select.Root
        selected={{
          label: $form.type,
          value: $form.type,
        }}
        onSelectedChange={handleSelectedChange}
      >
        <Select.Trigger class="w-full mt-2">
          <Select.Value placeholder="Select type" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="SELL" label="SELL">SELL</Select.Item>
          <Select.Item value="BUY" label="BUY">BUY</Select.Item>
        </Select.Content>
      </Select.Root>
      {#if $errors.type}<span class="mt-1 w-full text-error"
          >{$errors.type}</span
        >{/if}
      <Label label="Price per coin" required class="mt-4">
        <Input
          type="number"
          step="any"
          min="0"
          bind:value={$form.price}
          {...$constraints.price}
        />
      </Label>
      {#if $errors.price}<span class="mt-1 w-full text-error"
          >{$errors.price}</span
        >{/if}
      <Label label="Amount" required class="mt-4">
        <Input
          type="number"
          step="any"
          min="0"
          max={currency.amount}
          bind:value={$form.amount}
          {...$constraints.amount}
        />
        <svelte:fragment slot="extra">
          {#if $form.type === "SELL"}
            <span class="text-gray-500">
              Balance: {currency.amount}
            </span>
          {/if}
        </svelte:fragment>
      </Label>
      {#if $errors.amount}<span class="mt-1 w-full text-error"
          >{$errors.amount}</span
        >{/if}
      <Label label="Total Spent" class="mt-4">
        <Input disabled value={$form.price * $form.amount} />
      </Label>
      <Label label="Date" required class="mt-4">
        <Input
          type="datetime-local"
          bind:value={$form.timestamp}
          {...$constraints.timestamp}
        />
      </Label>
      {#if $errors.timestamp}<span class="mt-1 w-full text-error"
          >{$errors.timestamp}</span
        >{/if}
      <Dialog.Footer class="mt-5">
        <Dialog.Close>
          <Button variant="outline">Cancel</Button>
        </Dialog.Close>
        <Button type="submit" loading={$createTransactionMutate.isPending}
          >Submit
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>

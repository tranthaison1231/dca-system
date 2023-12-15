<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { updateCurrencySchema } from "$lib/utils/schema";
  import type * as z from "zod";
  import { Edit } from "lucide-svelte";
  import { superForm, superValidateSync } from "sveltekit-superforms/client";
  import type { Currency } from "@prisma/client";
  import { toast } from "svelte-sonner";

  export let currency: Currency;
  export let open = false;

  const queryClient = useQueryClient();

  const updateCurrencyMutate = createMutation({
    mutationFn: async (data: z.infer<typeof updateCurrencySchema>) =>
      fetch(`/api/currencies/${currency.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  });

  const { form, errors, constraints, enhance } = superForm(
    superValidateSync(
      {
        amount: Number(currency.amount),
      },
      updateCurrencySchema,
    ),
    {
      SPA: true,
      id: currency.id,
      validators: updateCurrencySchema,
      taintedMessage: false,
      onUpdate: async ({ form }) => {
        if (form.valid) {
          try {
            const result = await $updateCurrencyMutate.mutateAsync(form.data);
            if (result.status === 200) {
              queryClient.invalidateQueries({ queryKey: ["currencies"] });
              toast.success("Currency has been updated!");
              open = false;
            }
          } catch (error) {
            toast.error("Something went wrong");
          }
        }
      },
    },
  );
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>
    <button><Edit /></button>
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Edit currency</Dialog.Title>
    </Dialog.Header>
    <form method="POST" use:enhance>
      <Label label="Coin">
        <div class="flex gap-2 items-center">
          <img
            src={currency?.url}
            alt={currency.name}
            class="w-5 h-5 object-cover"
          />
          <span>{currency?.name}</span>
        </div>
      </Label>
      <Label label="Amount" required class="mt-4">
        <Input
          type="number"
          step="any"
          min="0"
          bind:value={$form.amount}
          {...$constraints.amount}
        />
      </Label>
      {#if $errors.amount}<span class="mt-1 w-full text-error"
          >{$errors.amount}</span
        >{/if}
      <Dialog.Footer class="mt-5">
        <Button type="submit" loading={$updateCurrencyMutate.isPending}
          >Save</Button
        >
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>

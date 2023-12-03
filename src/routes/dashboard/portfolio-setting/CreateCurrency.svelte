<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { updateCurrencySchema } from "$lib/utils/schema";
  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { toast } from "svelte-sonner";
  import { superForm, superValidateSync } from "sveltekit-superforms/client";
  import type * as z from "zod";

  export let open = false;

  const queryClient = useQueryClient();

  const createCurrencyMutate = createMutation({
    mutationFn: async (data: z.infer<typeof updateCurrencySchema>) =>
      fetch(`/api/currencies`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });

  const { form, errors, constraints, enhance } = superForm(
    superValidateSync(updateCurrencySchema),
    {
      SPA: true,
      validators: updateCurrencySchema,
      taintedMessage: false,
      onUpdate: async ({ form }) => {
        if (form.valid) {
          try {
            const result = await $createCurrencyMutate.mutateAsync(form.data);
            if (result.status === 200) {
              queryClient.invalidateQueries({ queryKey: ["currencies"] });
              toast.success("Currency has been created!");
              open = false;
            }
          } catch (error) {
            toast.error("Something went wrong");
          }
        }
      },
    }
  );
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>
    <Button>Create</Button>
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Create new currency</Dialog.Title>
    </Dialog.Header>
    <form method="POST" use:enhance>
      <Label>Name</Label>
      <Input bind:value={$form.symbol} {...$constraints.symbol} />
      {#if $errors.symbol}<span class="mt-1 col-span-3 text-red-500"
          >{$errors.symbol}</span
        >{/if}
      <div class="mt-4">
        <Label>Amount</Label>
        <Input
          type="number"
          step="any"
          bind:value={$form.amount}
          {...$constraints.amount}
        />
        {#if $errors.amount}<span class="mt-1 w-full text-red-500"
            >{$errors.amount}</span
          >{/if}
      </div>
      <Dialog.Footer class="mt-5">
        <Button type="submit" loading={$createCurrencyMutate.isPending}
          >Save</Button
        >
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>

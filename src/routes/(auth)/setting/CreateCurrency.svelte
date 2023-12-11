<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { updateCurrencySchema } from "$lib/utils/schema";
  import type { Currency } from "@prisma/client";
  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { toast } from "svelte-sonner";
  import { superForm, superValidateSync } from "sveltekit-superforms/client";
  import type * as z from "zod";
  import CryptoSearch from "./CoinSearch.svelte";

  export let open = false;
  let coin: Partial<Currency> | null = null;

  const queryClient = useQueryClient();

  async function createCurrency(data: z.infer<typeof updateCurrencySchema>) {
    const res = await fetch(`/api/currencies`, {
      method: "POST",
      body: JSON.stringify({
        ...data,
        ...coin,
      }),
    });
    const json = await res.json();
    if (!(res.status === 200)) {
      throw new Error(json.message);
    }
    return json;
  }

  const createCurrencyMutate = createMutation({
    mutationFn: createCurrency,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Currency has been created!");
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
      open = false;
      reset();
      coin = null;
    },
  });

  const { enhance, reset } = superForm(
    superValidateSync(updateCurrencySchema),
    {
      id: "create-currency",
      SPA: true,
      validators: updateCurrencySchema,
      taintedMessage: false,
      onUpdate: async ({ form }) => {
        if (!coin) toast.error("Please select a coin");
        if (form.valid && coin) {
          $createCurrencyMutate.mutate(form.data);
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
      <Dialog.Title>Add currency</Dialog.Title>
    </Dialog.Header>
    <form method="POST" use:enhance>
      <div class="flex flex-col">
        <Label label="Coin" class="mb-2" required />
        <CryptoSearch bind:value={coin} />
      </div>
      <Dialog.Footer class="mt-5">
        <Button type="submit" loading={$createCurrencyMutate.isPending}
          >Save</Button
        >
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>

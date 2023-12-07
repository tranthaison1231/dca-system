<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { updateProfileSchema } from "$lib/utils/schema";
  import type { User } from "@prisma/client";
  import { createMutation, createQuery } from "@tanstack/svelte-query";
  import { toast } from "svelte-sonner";
  import { superForm, superValidateSync } from "sveltekit-superforms/client";

  const meResult = createQuery<{ user: User }>({
    queryKey: ["me"],
    queryFn: async () => (await fetch("/api/users/me")).json(),
  });

  const updateProfileMutate = createMutation({
    mutationFn: async (data: { amount: number }) =>
      fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast.success("Profile has been updated!");
      $meResult.refetch();
    },
  });

  const { form, errors, constraints, enhance } = superForm(
    superValidateSync(updateProfileSchema),
    {
      id: "profile",
      SPA: true,
      validators: updateProfileSchema,
      taintedMessage: false,
      onUpdate: async ({ form }) => {
        if (form.valid) {
          $updateProfileMutate.mutate(form.data);
        }
      },
    }
  );

  $: form.set({
    amount: Number($meResult.data?.user.amount),
  });

  $: userAttributes = $meResult.data?.user.attributes;
</script>

<form
  class="border p-5 col-span-3 md:col-span-1 rounded-md shadow-xl"
  method="POST"
  use:enhance
>
  <h2 class="text-xl font-medium">Profile</h2>
  <div class="mt-4 flex flex-col gap-4">
    <Label label="Name">
      <Input
        disabled
        value={`${userAttributes?.["last_name"] ?? ""} ${
          userAttributes?.["first_name"] ?? ""
        }`}
      />
    </Label>
    <Label label="Email">
      <Input
        disabled
        value={`${
          userAttributes?.["email_addresses"][0]["email_address"] ?? ""
        }`}
      />
    </Label>
    <Label label="Amount">
      <Input
        type="number"
        min={0}
        bind:value={$form.amount}
        {...$constraints.amount}
      />
    </Label>
    {#if $errors.amount}<span class="mt-1 w-full text-error"
        >{$errors.amount}</span
      >{/if}
  </div>
  <Button class="mt-4" type="submit" loading={$updateProfileMutate.isPending}
    >Update</Button
  >
</form>

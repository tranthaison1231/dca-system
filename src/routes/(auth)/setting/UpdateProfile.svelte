<script lang="ts">
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

  const { enhance } = superForm(superValidateSync(updateProfileSchema), {
    id: "profile",
    SPA: true,
    validators: updateProfileSchema,
    taintedMessage: false,
    onUpdate: async ({ form }) => {
      if (form.valid) {
        $updateProfileMutate.mutate(form.data);
      }
    },
  });

  $: userAttributes = $meResult.data?.user?.attributes as {
    first_name: string;
    last_name: string;
    email_addresses: {
      email_address: string;
    }[];
  };
</script>

<form
  class="border p-4 col-span-3 md:col-span-1 rounded-md shadow-xl"
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
          userAttributes?.["email_addresses"][0]?.["email_address"] ?? ""
        }`}
      />
    </Label>
  </div>
</form>

<script lang="ts">
  import { createBooking } from "../lib/booking";

  export let walkId: string;

  let name = "";
  let email = "";
  let message = "";
  let loading = false;

  async function submitBooking() {
    loading = true;
    message = "";

    try {
      await createBooking({
        walkId,
        name,
        email,
      });

      message = "Booking received. Thank you!";

      name = "";
      email = "";

    } catch (error) {
      message =
        error instanceof Error
          ? error.message
          : "Something went wrong";
    }

    loading = false;
  }
</script>


<form
  class="space-y-4"
  on:submit|preventDefault={submitBooking}
>

  <label class="block">
    <span class="text-sm text-stone-700">
      Name
    </span>

    <input
      class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
      bind:value={name}
      required
    />
  </label>


  <label class="block">
    <span class="text-sm text-stone-700">
      Email
    </span>

    <input
      class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
      type="email"
      bind:value={email}
      required
    />
  </label>


  <button
    class="rounded-lg bg-stone-900 px-4 py-2 text-white disabled:opacity-50"
    disabled={loading}
  >
    {loading ? "Sending..." : "Book walk"}
  </button>

</form>


{#if message}

  <p class="mt-3 text-sm text-stone-600">
    {message}
  </p>

{/if}
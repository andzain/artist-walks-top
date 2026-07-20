<script lang="ts">
  import { actions } from "astro:actions";

  export let walks: { id: string; startsAt: string; seatsRemaining: number }[];
  export let experienceTitle: string;
  export let meetingPoint: string;

  let open = false;
  let selectedDate: string | null = null;
  let selectedWalkId: string | null = null;
  let name = "";
  let email = "";
  let phone = "";
  let message = "";
  let loading = false;

  let viewMonth = new Date();
  viewMonth.setDate(1);

  const minMonth = new Date();
  minMonth.setDate(1);
  const maxMonth = new Date();
  maxMonth.setMonth(maxMonth.getMonth() + 3);
  maxMonth.setDate(1);

  function localDateKey(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  $: walksByDate = walks.reduce((acc, walk) => {
    const key = localDateKey(new Date(walk.startsAt));
    (acc[key] ??= []).push(walk);
    return acc;
  }, {} as Record<string, typeof walks>);

  $: calendarDays = getCalendarDays(viewMonth);

  function getCalendarDays(month: Date) {
    const year = month.getFullYear();
    const m = month.getMonth();
    const startWeekday = new Date(year, m, 1).getDay();
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const days: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, m, d));
    return days;
  }

  function prevMonth() {
    const m = new Date(viewMonth);
    m.setMonth(m.getMonth() - 1);
    if (m.getTime() >= minMonth.getTime()) viewMonth = m;
  }

  function nextMonth() {
    const m = new Date(viewMonth);
    m.setMonth(m.getMonth() + 1);
    if (m.getTime() <= maxMonth.getTime()) viewMonth = m;
  }

  function pickDate(d: Date) {
    const key = localDateKey(d);
    if (!walksByDate[key]) return;
    selectedDate = key;
    selectedWalkId = null;
  }

  async function submitBooking() {
    if (!selectedWalkId) return;
    loading = true;
    message = "";
    const { error } = await actions.createBooking({
      walkId: selectedWalkId,
      name,
      email,
      phone,
      experienceTitle,
      meetingPoint,
    });
    message = error ? error.message : "Booking confirmed! Check your email.";
    if (!error) {
      name = "";
      email = "";
      phone = "";
      selectedWalkId = null;
      selectedDate = null;
      setTimeout(() => { open = false; message = ""; }, 3000);
    }
    loading = false;
  }
</script>

<button on:click={() => (open = true)} class="rounded-lg bg-stone-900 px-4 py-2 text-white">
  Book this walk
</button>

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    role="dialog"
    aria-modal="true"
    on:click|self={() => (open = false)}
    on:keydown={(e) => e.key === "Escape" && (open = false)}
  >
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

      <div class="flex items-center justify-between mb-4">
        <button on:click={prevMonth} disabled={viewMonth.getTime() <= minMonth.getTime()} class="px-2 py-1 text-lg disabled:opacity-30">‹</button>
        <span class="font-semibold">
          {viewMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        </span>
        <button on:click={nextMonth} disabled={viewMonth.getTime() >= maxMonth.getTime()} class="px-2 py-1 text-lg disabled:opacity-30">›</button>
      </div>

      <div class="grid grid-cols-7 gap-1 text-center text-xs text-stone-400 mb-1">
        {#each ["Su","Mo","Tu","We","Th","Fr","Sa"] as d}
          <span>{d}</span>
        {/each}
      </div>

      <div class="grid grid-cols-7 gap-1 text-center text-sm">
        {#each calendarDays as day}
          {#if day}
            {@const key = localDateKey(day)}
            {@const available = !!walksByDate[key]}
            <button
              class="rounded-full py-1 w-full"
              class:bg-stone-900={selectedDate === key}
              class:text-white={selectedDate === key}
              class:text-stone-300={!available}
              class:cursor-not-allowed={!available}
              class:hover:bg-stone-100={available && selectedDate !== key}
              disabled={!available}
              on:click={() => pickDate(day)}
            >
              {day.getDate()}
            </button>
          {:else}
            <span></span>
          {/if}
        {/each}
      </div>

      {#if selectedDate}
        <div class="mt-4 space-y-2">
          <p class="text-sm font-medium text-stone-700">Available times</p>
          {#each walksByDate[selectedDate] as walk}
            <button
              class="w-full rounded-lg border px-3 py-2 text-left text-sm"
              class:border-stone-900={selectedWalkId === walk.id}
              class:bg-stone-50={selectedWalkId === walk.id}
              on:click={() => (selectedWalkId = walk.id)}
            >
              {new Date(walk.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              — {walk.seatsRemaining} spots left
            </button>
          {/each}
        </div>
      {/if}

      {#if selectedWalkId}
        <form class="mt-4 space-y-2" on:submit|preventDefault={submitBooking}>
          <input placeholder="Name" bind:value={name} required class="w-full rounded-lg border px-3 py-2 text-sm" />
          <input type="email" placeholder="Email" bind:value={email} required class="w-full rounded-lg border px-3 py-2 text-sm" />
          <input type="tel" placeholder="Phone" bind:value={phone} required class="w-full rounded-lg border px-3 py-2 text-sm" />
          <button disabled={loading} class="w-full rounded-lg bg-stone-900 px-4 py-2 text-white text-sm">
            {loading ? "Sending..." : "Confirm booking"}
          </button>
        </form>
      {/if}

      {#if message}
        <p class="mt-3 text-sm" class:text-green-600={!message.includes("error")} class:text-red-600={message.includes("error")}>
          {message}
        </p>
      {/if}

    </div>
  </div>
{/if}
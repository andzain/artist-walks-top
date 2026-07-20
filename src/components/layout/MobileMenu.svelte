<script>
  import { navigation } from "@/config/navigation";

  let open = false;

  function toggle() {
    open = !open;
  }

  function close() {
    open = false;
  }
</script>

<div class="md:hidden">

  <button
    on:click={toggle}
    aria-label="Toggle menu"
    class="flex h-10 w-10 flex-col items-center justify-center gap-1"
  >
    <span
      class={`block h-0.5 w-6 bg-stone-900 transition-all duration-300 ${
        open ? "translate-y-1.5 rotate-45" : ""
      }`}
    ></span>

    <span
      class={`block h-0.5 w-6 bg-stone-900 transition-all duration-300 ${
        open ? "opacity-0" : ""
      }`}
    ></span>

    <span
      class={`block h-0.5 w-6 bg-stone-900 transition-all duration-300 ${
        open ? "-translate-y-1.5 -rotate-45" : ""
      }`}
    ></span>
  </button>

  {#if open}
    <nav class="absolute left-0 right-0 top-16 border-b bg-white shadow-sm">
      <ul class="flex flex-col">

        {#each navigation as item}
          <li>
            <a href={item.href} on:click={close} class="block border-t px-6 py-4">
              {item.title}
            </a>
          </li>
        {/each}

        <li class="border-t p-6">
          <a href="/book" class="inline-flex rounded-lg bg-stone-900 px-5 py-3 text-white" on:click={close}>
            Book
          </a>
        </li>

      </ul>
    </nav>
  {/if}

</div>
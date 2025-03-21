<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';

	import { freezeContext } from './context.js';

	interface Props {
		frozen: boolean;
		children: Snippet<[]>;
	}

	const { frozen, children }: Props = $props();

	const isFrozen = $derived(!!frozen);

	// As a precaution, prevents lingering `useEventHandler` from being called
	let destroyed = false;
	onDestroy(() => {
		destroyed = true;
	});

	freezeContext.set({
		frozen() {
			return destroyed || isFrozen;
		}
	});
</script>

{@render children()}

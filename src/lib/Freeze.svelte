<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';

	import { freezeContext } from './context.js';
	import { useIsFrozen } from './effect.svelte.js';

	interface Props {
		frozen: boolean;
		children: Snippet<[]>;
	}

	const { frozen, children }: Props = $props();

	const parentIsFrozen = useIsFrozen();
	const isFrozen = $derived(parentIsFrozen() || !!frozen);

	// As a precaution, allows lingering `useEventHandler` to pass through.
	let alive = true;
	onDestroy(() => {
		alive = false;
	});

	freezeContext.set({
		frozen() {
			return alive && isFrozen;
		},
	});
</script>

{@render children()}

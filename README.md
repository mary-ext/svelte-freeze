# svelte-freeze

Provides freeze-like functionality.

## What is this?

Svelte currently lacks an equivalent to React's Suspense boundaries. While Suspense is often
associated with data fetching, it serves another crucial purpose: preventing unnecessary updates in
UI components that aren't currently visible to users, while preserving their local state.

This is particularly valuable for mobile apps relying on stack navigation, where screens are pushed
onto a stack but previous screens remain in memory. Without this freezing capability, these hidden
screens would continue processing updates and performing potentially expensive computations, even
though users can't see them.

svelte-freeze attempts to address this by providing freeze-aware effects and event handlers for
library and app developers to use.

> [!NOTE]  
> Unlike React's Suspense, svelte-freeze doesn't hide elements from DOM. UI components remain
> visible but any reactive effects and handlers are frozen. You'll need to handle the visibility of
> frozen components yourself.

## Quick start

#### 1. Replace reactive effects with freeze-aware versions

Instead of using Svelte's built-in `$effect()` and `$effect.pre()` functions, import and use the
freeze-aware alternatives:

```svelte
<script>
	import { createEffect } from 'svelte-freeze';

	let count = $state(0);

	onMount(() => {
		const interval = setInterval(() => {
			count += 1;
		}, 3_000);

		return () => clearInterval(interval);
	});

	createEffect(() => {
		console.log(count);
	});
</script>
```

#### 2. Control component freezing

Wrap components in `<Freeze>` to control their frozen state:

```svelte
<script>
	import { Freeze } from 'svelte-freeze';

	let frozen = $state(false);
</script>

<Freeze {frozen}>
	<Component />
</Freeze>
```

When `frozen` is true, all freeze-aware effects within the component tree will stop executing,
preserving resources while maintaining component state.

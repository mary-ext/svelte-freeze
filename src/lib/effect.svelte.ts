import { untrack } from 'svelte';

import { useIsFrozen } from './context.js';

/**
 * Runs code right before the DOM is updated
 */
export const createRenderEffect = (fn: () => void | (() => void)): void => {
	const frozen = useIsFrozen();

	$effect.pre(() => {
		// We don't want effects to rerun upon freezing
		if (untrack(frozen)) {
			// Now that we know, track the frozen state so we can get unfrozen
			frozen();

			return;
		}

		fn();
	});
};

/**
 * Runs code right after the DOM is updated
 */
export const createEffect = (fn: () => void | (() => void)): void => {
	const frozen = useIsFrozen();

	$effect(() => {
		// We don't want effects to rerun upon freezing
		if (untrack(frozen)) {
			// Now that we know, track the frozen state so we can get unfrozen
			frozen();

			return;
		}

		return fn();
	});
};

/**
 * Wraps a function so it respects the freeze state.
 *
 * When the associated component tree is frozen, any calls made to it will
 * be stored, and it will be called once the tree is unfrozen.
 *
 * @param fn The function to wrap
 * @returns A wrapped version of the function
 */
export const createEventHandler = <A extends any[]>(fn: (...args: A) => void): ((...args: A) => void) => {
	const frozen = useIsFrozen();

	let storedArgs: A | undefined;

	// We can't use `createRenderEffect` here because this effect isn't tracking
	// any states other than `frozen()`.
	$effect.pre(() => {
		if (!frozen() && storedArgs !== undefined) {
			const args = storedArgs;
			storedArgs = undefined;

			untrack(() => fn(...args));
		}
	});

	return (...args) => {
		// Don't track freeze state
		if (untrack(frozen)) {
			storedArgs = args;
			return;
		}

		// Clear out stored args
		storedArgs = undefined;

		fn(...args);
	};
};

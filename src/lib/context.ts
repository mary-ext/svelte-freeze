import { Context } from 'runed';

export interface FreezeContext {
	frozen: () => boolean;
}

export const freezeContext = new Context<FreezeContext>('svelte-freeze');

const DEFAULT_FREEZE_CONTEXT: FreezeContext = {
	frozen: () => false,
};

/**
 * Provides access to the current freeze state.
 */
export const useIsFrozen = (): (() => boolean) => {
	const { frozen } = freezeContext.getOr(DEFAULT_FREEZE_CONTEXT);

	return frozen;
};

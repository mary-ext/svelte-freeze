import { Context } from 'runed';

export interface FreezeContext {
	frozen: () => boolean;
}

export const DEFAULT_FREEZE_CONTEXT: FreezeContext = {
	frozen: () => false
};

export const freezeContext = new Context<FreezeContext>('svelte-freeze');

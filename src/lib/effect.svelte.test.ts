import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createEffect, createEventHandler, createRenderEffect } from './effect.svelte.js';

let frozen = $state(false);
let cleanup: (() => void) | undefined;

vi.mock(import('./context.js'), async (importOriginal) => {
	const orig = await importOriginal();
	return {
		...orig,
		useIsFrozen() {
			return () => frozen;
		},
	};
});

afterEach(() => {
	if (cleanup !== undefined) {
		cleanup();
		cleanup = undefined;
	}
});

describe('createRenderEffect', () => {
	it('should work', async () => {
		const snapshots: number[] = [];
		let count = $state(0);

		cleanup = $effect.root(() => {
			createRenderEffect(() => {
				snapshots.push(count);
			});
		});

		expect(snapshots).toEqual([0]);

		count = 2;
		await tick();

		expect(snapshots).toEqual([0, 2]);

		frozen = true;
		count = 4;
		await tick();

		expect(snapshots).toEqual([0, 2]);

		frozen = false;
		count = 6;
		await tick();

		expect(snapshots).toEqual([0, 2, 6]);
	});
});

describe('createEffect', () => {
	it('should work', async () => {
		const snapshots: number[] = [];
		let count = $state(0);

		cleanup = $effect.root(() => {
			createEffect(() => {
				snapshots.push(count);
			});
		});

		expect(snapshots).toEqual([]);

		await tick();

		expect(snapshots).toEqual([0]);

		count = 2;
		await tick();

		expect(snapshots).toEqual([0, 2]);

		frozen = true;
		count = 4;
		await tick();

		expect(snapshots).toEqual([0, 2]);

		frozen = false;
		count = 6;
		await tick();

		expect(snapshots).toEqual([0, 2, 6]);
	});
});

describe('createEventHandler', () => {
	it('should work', async () => {
		let mock = vi.fn<(arg: number) => void>();
		let call!: (arg: number) => void;

		cleanup = $effect.root(() => {
			call = createEventHandler(mock);
		});

		expect(mock).not.toHaveBeenCalled();

		call(2);
		expect(mock).toHaveBeenCalledTimes(1);
		expect(mock).toHaveBeenCalledWith(2);

		frozen = true;
		await tick();

		call(4);
		expect(mock).toHaveBeenCalledTimes(1);
		expect(mock).toHaveBeenCalledWith(2);

		frozen = false;
		await tick();

		expect(mock).toHaveBeenCalledTimes(2);
		expect(mock).toHaveBeenCalledWith(4);
	});
});

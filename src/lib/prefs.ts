/**
 * prefs.ts — Preference persistence (sessionStorage).
 * Keeps business logic out of components.
 */

import type { Prefs } from './types';

export const DEFAULT_PREFS: Prefs = {
	categories: ['Culinary', 'Beach'],
	min: 25000,
	max: 500000,
	radius: 20,
	priority: 'balanced',
	origin: 'Seminyak'
};

export function loadPrefs(): Prefs {
	if (typeof sessionStorage === 'undefined') return DEFAULT_PREFS;
	try {
		return { ...DEFAULT_PREFS, ...JSON.parse(sessionStorage.getItem('prefs') || '{}') };
	} catch {
		return DEFAULT_PREFS;
	}
}

export function savePrefs(p: Prefs): void {
	if (typeof sessionStorage === 'undefined') return;
	sessionStorage.setItem('prefs', JSON.stringify(p));
}

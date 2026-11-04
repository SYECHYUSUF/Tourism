import { writable } from 'svelte/store';

export interface UserSession {
	id?: string;
	name: string;
	email: string;
	role: 'admin' | 'user' | string;
}

function createUserStore() {
	const { subscribe, set } = writable<UserSession | null>(null);

	return {
		subscribe,
		init(initialUser?: any) {
			if (initialUser?.email) {
				set(initialUser);
				return;
			}
			if (typeof localStorage !== 'undefined') {
				try {
					const s = JSON.parse(localStorage.getItem('session') || 'null');
					if (s?.email) {
						set(s);
						return;
					}
				} catch {}
			}
		},
		login(u: UserSession) {
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem('session', JSON.stringify(u));
			}
			if (typeof document !== 'undefined') {
				document.cookie = `session=${encodeURIComponent(JSON.stringify(u))}; path=/; max-age=604800; SameSite=Lax`;
			}
			set(u);
		},
		logout() {
			if (typeof localStorage !== 'undefined') {
				localStorage.removeItem('session');
			}
			if (typeof document !== 'undefined') {
				document.cookie = 'session=; path=/; max-age=0; SameSite=Lax';
			}
			set(null);
		}
	};
}

export const userStore = createUserStore();

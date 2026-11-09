import { describe, expect, it } from 'vitest';
import { inBali, isHttpUrl, list, slugify } from './validation';
import { pathFromPublicUrl } from './storage';

describe('slugify', () => {
	it('membuat slug aman', () => {
		expect(slugify('Warung Nusantara — Ubud!')).toBe('warung-nusantara-ubud');
		expect(slugify('Café Été')).toBe('cafe-ete');
		expect(slugify('***')).toBe('tempat');
	});
});

describe('list', () => {
	it('memecah koma/baris baru dan membuang duplikat', () => {
		const f = new FormData();
		f.set('tags', 'Halal, Keluarga\nHalal, ,Lokal');
		expect(list(f, 'tags')).toEqual(['Halal', 'Keluarga', 'Lokal']);
	});
});

describe('inBali / isHttpUrl', () => {
	it('memeriksa koordinat Bali', () => {
		expect(inBali(-8.65, 115.2)).toBe(true);
		expect(inBali(-6.2, 106.8)).toBe(false); // Jakarta
	});
	it('hanya http/https', () => {
		expect(isHttpUrl('https://maps.google.com')).toBe(true);
		expect(isHttpUrl('javascript:alert(1)')).toBe(false);
	});
});

describe('pathFromPublicUrl', () => {
	it('mengambil path objek dari public URL', () => {
		const url = 'https://x.supabase.co/storage/v1/object/public/review-photos/abc/1.jpg';
		expect(pathFromPublicUrl(url, 'review-photos')).toBe('abc/1.jpg');
		expect(pathFromPublicUrl('https://images.unsplash.com/p.jpg', 'review-photos')).toBeNull();
	});
});

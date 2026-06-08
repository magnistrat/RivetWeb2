import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import type { DrupalNode, DrupalTag } from './types';
import { getArticles, getTags } from './api/drupal';


const drupalPosts = defineCollection({
	loader: async () => {
		const articles = await getArticles();
		const taglist = await getTags();
		const tagMap = new Map(taglist.map((tag) => [String(tag.id), tag.name]));
	
		const entries = articles.map((article: DrupalNode) => {
			const id = String(article.drupal_internal__nid ?? article.id ?? article.title ?? Math.random());
		    return [
				id,
				{
					id,
					alias: article.path?.alias ?? '',
					body: article.body?.value ?? '',
					collection: 'drupalPosts',
					// Flattened fields to match collection schema
					title: article.title ?? '',
					description: article.field_seo_description ?? 'X',
					author: article.uid?.display_name ?? article.uid?.name ?? '',
					featuredImage: article.field_image?.uri?.url ?? undefined,
					publishDate: new Date(article.created),
					draft: article.status !== true,
					slug: article.slug ?? '',
					articletaglist: article.field_tags?.map((tag) => tagMap.get(String(tag.id)) ?? tag.name ?? '').filter(Boolean) ?? [],
					category: article.field_category?.name ?? '',
				} as unknown as DrupalNode,
			];
		});
		return Object.fromEntries(entries);
	},
	schema: z.object({
		title: z.string(),
		author: z.string(),
		featuredImage: z.string().optional(),
		publishDate: z.coerce.date(),
		draft: z.boolean().default(false),
		body: z.string(),
		alias: z.string(),
		slug: z.string(),
		description: z.string(),
		articletaglist: z.array(z.string()).optional(),	
	}),
});

const drupalTags = defineCollection({
	loader: async () => {
		const articles = await getTags();
	
		const entries = articles.map((article: DrupalTag) => {
			const id = String(article.id ?? article.title ?? Math.random());
		    return [
				id,
				{
					id,
					name: article.name ?? '',
				} as unknown as DrupalNode,
			];
		});
		return Object.fromEntries(entries);
	},
	schema: z.object({
		name: z.string(),
	}),
});



export const collections = { drupalPosts, drupalTags };

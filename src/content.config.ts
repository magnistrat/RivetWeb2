import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import type { DrupalNode } from './types';
import { getArticles } from './api/drupal';


const drupalPosts = defineCollection({
	loader: async () => {
		const articles = await getArticles();
	
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
					author: article.uid?.display_name ?? article.uid?.name ?? '',
					featuredImage: article.field_image?.uri?.url ?? undefined,
					publishDate: new Date(article.created),
					draft: article.status !== true,
					slug: article.slug ?? '',
			/*		tags: article.field_tags ?? [],
					category: article.field_category?.name ?? '',
			*/	} as unknown as DrupalNode,
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
		tags: z.array(z.string()).optional(),	
	
		}),
});

export const collections = { drupalPosts };

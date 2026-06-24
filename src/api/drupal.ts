import {Jsona, type TJsonApiBody} from "jsona";
import {DrupalJsonApiParams} from "drupal-jsonapi-params";
import type {DrupalImage, DrupalNode, Tags} from "../types.ts";


// Get the Drupal Base Url.
export const baseUrl: string = import.meta.env.DRUPAL_BASE_URL;

/**
 * Fetch url from Drupal.
 *
 * @param url
 *
 * @return Promise<TJsonaModel | TJsonaModel[]> as Promise<any>
 */
export const fetchUrl = async (url: string): Promise<any> => {
    const request: Response = await fetch(url);
    const json: string | TJsonApiBody = await request.json();
    const dataFormatter: Jsona = new Jsona();
    return dataFormatter.deserialize(json);
}

/**
 * Get all published articles.
 *
 * @return Promise<DrupalNode[]>
 */
export const getArticles = async (): Promise<DrupalNode[]> => {
    const params: DrupalJsonApiParams = new DrupalJsonApiParams();
    params
        .addFields("node--article", [
            "title",
            "path",
            "body",
            "created",
            "alias",
            "slug",
            "status",
            "field_tags",
            "field_image",
         ])
        .addFilter("status", "1");
    const path: string = params.getQueryString();   
    return await fetchUrl(baseUrl + '/jsonapi/node/risk_article?' + path);   
}

/**
 * Get all tags.
 *
 * @return Promise<DrupalNode[]>
 */
export const getTags = async (): Promise<Tags[]> => {
    const params: DrupalJsonApiParams = new DrupalJsonApiParams();

    // Request only the `name` field for the `tags` vocabulary
    params.addFields("taxonomy_term--tags", ["name"]);

    const path: string = params.getQueryString();
    return await fetchUrl(baseUrl + '/jsonapi/taxonomy_term/tags?' + path);
}

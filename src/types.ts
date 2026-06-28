export interface Path {
    alias: string
    pid: number
    langcode: string
}

export interface DrupalImage {
    type: string;
    id: string;
    resourceIdObjMeta: {
    alt: string,
    title: string,
    width: number,
    height: number,
    drupal_internal__target_id: number
    }
}    

export interface Tags {
    id : string
    name : string
    target_id : Number
}

export interface DrupalNode extends Record<string, any> {
    id: string
    type: string
    langcode: string
    field_seo_description: string
    field_hero_image_tag: string
    field_imagealt: string
    slug: string
    status: boolean
    drupal_internal__nid: number
    drupal_internal__vid: number
    changed: string
    created: Date
    title: string
    body?: {
        value: string
        format: string  
    }
    default_langcode: boolean
    sticky: boolean
    path: Path
    field_tags?: Tags[]
}   


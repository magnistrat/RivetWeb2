export interface Path {
    alias: string
    pid: number
    langcode: string
}

export interface DrupalNode extends Record<string, any> {
    id: string
    type: string
    langcode: string
    field_slug: string
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
   
    field_tags?: string[]
}   
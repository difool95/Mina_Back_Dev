/** What the scanner saw: a physical product, a person, or a flat design. */
export type BrandMemoryKind = 'product' | 'model' | 'design'

/** What a brand memory is filed under. The scanner picks one; the user can change it. */
export type BrandMemoryCategory = 'logo' | 'illustration' | 'model' | 'product'

/** The scanner's reading of a brand memory's picture. */
export interface BrandMemoryScan {
  kind: BrandMemoryKind
  name: string
  description: string
  tags: string[]
  aliases: string[]
  category: BrandMemoryCategory
}

/** The scanner's whole answer: its reading, and whether the picture is one of the four categories at all. */
export interface BrandMemoryScanAnswer extends BrandMemoryScan {
  is_brand_asset: boolean
}

/** How a brand memory was made: added by the user, or saved from a picture a Create used. */
export type BrandMemoryOrigin = 'upload' | 'create'

/** One picture of a brand memory. */
export interface BrandMemoryItem {
  url: string
  roles: string[]
  origin: BrandMemoryOrigin
  aliases: string[]
  has_face: boolean
  has_person: boolean
}

/**
 * picked brand memories that the user has selected in the studio, with their names and the URLs of their pictures.
 */
export interface PickedBrandMemoryPictures {
  id: string
  name: string
  images: string[]
}

/** A brand memory's `mg_mma_vars`. Kept identical to the frontend's. */
export interface BrandMemoryVars extends BrandMemoryScan {
  /** The pictures' URLs, the first being the cover. `source_urls` and `asset_items` follow it. */
  images: string[]
  origin: BrandMemoryOrigin
  /** Only with `origin` "create": the upload its picture was copied from, so a later Create sending it again saves no second memory. */
  source_upload_url?: string
  /** True once the scanner has read the picture. */
  scanning: boolean
  thumb_url: string
  use_count: number
  sort_order: number
  asset_items: BrandMemoryItem[]
  source_urls: string[]
  last_used_at: string
  /** Whether Mina reads this memory when creating. */
  memory_enabled: boolean
}

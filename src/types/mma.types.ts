/** Where the output is meant to go, read off the ratio the user picked in the studio. */
export type MmaPlatform = 'tiktok' | 'instagram-post' | 'print' | 'square'

export interface StillGenerationRequest {
  /** The browser tab's studio session; a new one means a new "Mina Studio session" row. */
  studioSessionId: string
  platform: MmaPlatform
  isCreative: boolean
  ip: string
  userAgent: string
}

export interface StillGenerationResult {
  generationId: string
  credits: number
}

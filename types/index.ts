// A single editable field definition for the property editor
export type FieldDef =
  | { type: 'text'; key: string; label: string; placeholder?: string }
  | { type: 'textarea'; key: string; label: string; placeholder?: string }
  | { type: 'color'; key: string; label: string }
  | { type: 'number'; key: string; label: string; min?: number; max?: number; step?: number }
  | { type: 'select'; key: string; label: string; options: { label: string; value: string }[] }
  | { type: 'url'; key: string; label: string; placeholder?: string }

// The block types available in the builder
export type BlockType =
  | 'hero'
  | 'features'
  | 'testimonial'
  | 'text'
  | 'cta'
  | 'footer'

// A single block on the canvas
export type Block = {
  id: string
  type: BlockType
  props: Record<string, unknown>
}

// A saved project in Firestore
export type Project = {
  id: string
  userId: string
  name: string
  blocks: Block[]
  createdAt: number // Unix timestamp ms
  updatedAt: number
}

// Auth user shape used in the app
export type AppUser = {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

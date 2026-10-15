/// <reference types="astro/client" />

namespace App {
  interface Locals { lexiconPage?: { rootPath: string; chineseIndexable: boolean; titleLanguage?: string }; skillMapTitleParts?: { text: string; lang?: string }[] }
  interface Locals { publicationNotes?: { coverage?: { translated: number; total: number; missing: number; draft: number; stale: number }; englishShareImages: boolean } }
}

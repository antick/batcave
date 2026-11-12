/** Serialized blog post: dates as ISO strings for React island props */
export interface SerializedPost {
  id: string;
  title: string;
  description: string;
  pubDate: string; // ISO string (Date is not serializable across island boundary)
  tags: string[];
}

export interface ThemeImage {
  light: string;
  dark: string;
  alt: string;
}

export interface DirectoryEntry {
  title: string;
  description?: string;
  category: string;
  url: string;
}

export interface ContentCategory {
  id: string;
  label: string;
  description: string;
  icon?: string;
  tags?: string[];
}

export interface PromptEntry {
  slug: string;
  title: string;
  description: string;
  category: string;
  useCase: string;
  tags: string[];
  details: string[];
  promptText: string;
}

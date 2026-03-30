export interface Project {
  id: string
  title: string
  slug: string
  description: string
  image_url: string | null
  project_url: string | null
  repo_url: string | null
  technologies: string[]
  sort_order: number
  status: 'active' | 'archived'
  created_at: string
  updated_at: string
}

export interface CreateProjectPayload {
  title: string
  description: string
  imageUrl?: string | null
  projectUrl?: string | null
  repoUrl?: string | null
  technologies: string[]
  sortOrder?: number
  status: 'active' | 'archived'
}

export type UpdateProjectPayload = CreateProjectPayload

export interface ProjectFilters {
  title?: string
  status?: string
}

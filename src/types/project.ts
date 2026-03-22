export interface Project {
  id: string
  title: string
  slug: string
  description: string
  image_url: string | null
  project_url: string | null
  repo_url: string | null
  technologies: string[]
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
  status: 'active' | 'archived'
}

export interface UpdateProjectPayload extends CreateProjectPayload {}

export interface ProjectFilters {
  title?: string
  status?: string
}

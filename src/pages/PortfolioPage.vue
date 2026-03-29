<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { visitService } from '@/services/visitService'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useSeo } from '@/composables/useSeo'
import NavBar from '@/components/portfolio/NavBar.vue'
import HeroSection from '@/components/portfolio/HeroSection.vue'
import AboutSection from '@/components/portfolio/AboutSection.vue'
import SkillsSection from '@/components/portfolio/SkillsSection.vue'
import ExperienceSection from '@/components/portfolio/ExperienceSection.vue'
import ProjectsSection from '@/components/portfolio/ProjectsSection.vue'
import ContactSection from '@/components/portfolio/ContactSection.vue'
import FooterSection from '@/components/portfolio/FooterSection.vue'

useScrollReveal()
useSeo()

const activeSection = ref('hero')
const scrolled = ref(false)

const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'contact']

let observer: IntersectionObserver

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  visitService.register('/').catch(() => {})

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeSection.value = entry.target.id
      })
    },
    { threshold: 0.45 },
  )
  sections.forEach((id) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })

  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  observer.disconnect()
  window.removeEventListener('scroll', onScroll)
})

function onScroll() {
  scrolled.value = window.scrollY > 40
}
</script>

<template>
  <div id="main-content">
    <NavBar :active-section="activeSection" :scrolled="scrolled" />
    <HeroSection />
    <AboutSection />
    <SkillsSection />
    <ExperienceSection />
    <ProjectsSection />
    <ContactSection />
    <FooterSection />
  </div>
</template>

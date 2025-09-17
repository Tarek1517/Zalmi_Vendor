<script setup>
import BannerSection from "@/components/Dashboard/BannerSection.vue";
import ProfileHeader from "@/components/Dashboard/ProfileHeader.vue";
import SidebarNav from "@/components/Dashboard/SidebarNav.vue";
</script>

<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50">
      <BannerSection />
      <section class="container mx-auto px-4 md:px-6 pb-16 -mt-16 lg:-mt-28">
        <ProfileHeader />
        <div class="flex flex-col lg:flex-row gap-8 mb-12">
          <!-- Sidebar -->
          <div class="lg:w-64 shrink-0">
            <SidebarNav />
          </div>

          <!-- Main Content -->
          <div class="flex-1">
            <router-view />
          </div>
        </div>
      </section>
    </div>
  </AppLayout>
</template>


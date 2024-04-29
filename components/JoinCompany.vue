<script setup>
// neccessary imports
import { ref, onMounted } from 'vue';
import axios from 'axios';

// State variables
const companyOptions = ref([]);
const isLoading = ref(true);

// Fetch company names from API
const fetchCompanyNames = async () => {
  try {
    const response = await axios.get('/companyinfo');
    companyOptions.value = response.data.data;
  } catch (error) {
    console.error('Error fetching company options:', error);
  } finally {
    isLoading.value = false;
  }
};

// toast messages
const showMore = ()=>{
  useNuxtApp().$toast.warning("Please Login to See More...")
}

// Call fetchCompanyNames when component is mounted
onMounted(fetchCompanyNames);
</script>

<!-- template -->
<template>
  <div class="company-container">
    <!-- heading -->
    <h1 class="text-h4 text-center mb-4 header-title">
      Join Most Well Known <span class="text-primary">Companies</span> Around The World
    </h1>

    <!-- Display loading message until data is loaded -->
    <VRow>
      <VCol cols="12" v-if="isLoading" class="text-center loading-section">
        <VProgressCircular indeterminate color="primary" size="50" />
        <p class="loading-text">Loading company information...</p>
      </VCol>

      <!-- Display companies once data is loaded -->
      <template v-else>
        <VCol
          v-for="(company, index) in companyOptions"
          :key="index"
          cols="12"
          sm="6"
          md="3"
          class="d-flex justify-center mb-4"
        >
          <VCard
            outlined
            class="elevation-3 hoverable card"
            transition="scale-transition"
          >
            <!-- Company image with a subtle hover transition -->
            <VImg
              :src="`http://127.0.0.1:8000/storage/logos/${company.logo}`"
              height="200px"
              width="350px"
              aspect-ratio="1.5"
              class="company-image"
            ></VImg>

            <!-- Company title centered in the card -->
            <VCardTitle class="justify-center card-title">{{ company.name }}</VCardTitle>
          </VCard>
        </VCol>
      </template>

      <!-- "Show More" link aligned to the right -->
      <VCol cols="12" class="d-flex justify-end show-more-col">
        <VBtn
          class="show-more-link"
          @click="showMore"
          text
        >
          Show More &rarr;
        </VBtn>
      </VCol>
    </VRow>
  </div>
</template>

<!-- style -->
<style scoped>
.company-container {
  background: linear-gradient(to bottom, #e6f3fd, #f5f5f5); /* Gradient background */
  padding: 1.25rem;
}

/* Padding for the loading section */
.loading-section {
  padding: 2.5rem 0;
}

/* Styling for loading text */
.loading-text {
  font-size: 1.1rem; 
  font-weight: 500; /* Medium font weight */
  color: #2196f3; /* Blue color */
}

/* Card styling with box shadow and transition */
.card {
  border-radius: 0.5rem; 
  box-shadow: 0 0.375rem 1rem rgba(0, 0, 0, 0.1); 
  transition: all 0.3s; /* Transition time */
}

/* Card hover effect with shadow and translation */
.card:hover {
  box-shadow: 0 0.5rem 1.25rem rgba(0, 0, 0, 0.3); /* Converted from 8px and 20px */
  transform: translateY(-0.25rem); 
}

/* Company image transition */
.company-image {
  transition: transform 0.3s; /* Transition time */
}

/* Hover effect for company image */
.company-image:hover {
  transform: scale(1.1); /* Scaling on hover */
}

/* Card title with specific font size and transformation */
.card-title {
  font-size: 1.3rem; 
  font-weight: bold; /* Bold font weight */
  letter-spacing: 0.05em; 
  text-transform: uppercase; /* Uppercase transformation */
}

/* Header title with specific font size and font weight */
.header-title {
  font-size: 2rem; 
  font-weight: 600; /* Semi-bold font weight */
}

/* Padding for show-more column */
.show-more-col {
  padding-top: 1rem; 
}

/* Link style for 'show more' with transition */
.show-more-link {
  color: #1565c0; /* Blue color */
  text-transform: none; /* No text transformation */
  text-decoration: none; /* No underline */
  transition: color 0.3s; /* Transition time */
}

/* Hover effect for 'show more' link */
.show-more-link:hover {
  color: #0d47a1; /* Darker blue on hover */
}
</style>

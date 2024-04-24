<script setup>
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
const showMore = ()=>{
  useNuxtApp().$toast.warning("Please Login to See More...")
}

// Call fetchCompanyNames when component is mounted
onMounted(fetchCompanyNames);
</script>

<template>
  <div class="company-container">
    <h1 class="text-h4 text-center mb-4 header-title">
      Join Most Well Known <span class="text-primary">Companies</span> Around The World
    </h1>

    <!-- Display loading message until data is loaded -->
    <v-row>
      <v-col cols="12" v-if="isLoading" class="text-center loading-section">
        <v-progress-circular indeterminate color="primary" size="50" />
        <p class="loading-text">Loading company information...</p>
      </v-col>

      <!-- Display companies once data is loaded -->
      <template v-else>
        <v-col
          v-for="(company, index) in companyOptions"
          :key="index"
          cols="12"
          sm="6"
          md="3"
          class="d-flex justify-center mb-4"
        >
          <v-card
            outlined
            class="elevation-3 hoverable card"
            transition="scale-transition"
          >
            <!-- Company image with a subtle hover transition -->
            <v-img
              :src="`http://127.0.0.1:8000/storage/logos/${company.logo}`"
              height="200px"
              width="350px"
              aspect-ratio="1.5"
              class="company-image"
            ></v-img>

            <!-- Company title centered in the card -->
            <v-card-title class="justify-center card-title">{{ company.name }}</v-card-title>
          </v-card>
        </v-col>
      </template>

      <!-- "Show More" link aligned to the right -->
      <v-col cols="12" class="d-flex justify-end show-more-col">
        <v-btn
          class="show-more-link"
          @click="showMore"
          text
        >
          Show More &rarr;
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.company-container {
  background: linear-gradient(to bottom, #e6f3fd, #f5f5f5);
  padding: 20px;
}

.loading-section {
  padding: 40px 0;
}

.loading-text {
  font-size: 1.1em;
  font-weight: 500;
  color: #2196f3;
}

.card {
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  transform: translateY(-4px);
}

.company-image {
  transition: transform 0.3s;
}

.company-image:hover {
  transform: scale(1.1);
}

.card-title {
  font-size: 1.3em;
  font-weight: bold;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.header-title {
  font-size: 2em;
  font-weight: 600;
}

.show-more-col {
  padding-top: 16px;
}

.show-more-link {
  color: #1565c0;
  text-transform: none;
  text-decoration: none;
  transition: color 0.3s;
}

.show-more-link:hover {
  color: #0d47a1;
}
</style>

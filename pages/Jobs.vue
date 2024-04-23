<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const companyOptions = ref([]);
const isLoading = ref(false);
const jobsOptions = ref([]);

const handleLogout = () => {
  localStorage.removeItem("authToken");
  router.push("/");
};

const fetchCompanyInfo = async () => {
  try {
    const response = await axios.get("/companyinfo");
    const companies = response.data.data;
    companyOptions.value = companies.map((company) => ({
      name: company.name,
      logo: `http://127.0.0.1:8000/storage/logos/${company.logo}`,
    }));
  } catch (error) {
    console.error("Error fetching companies:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchJobsWitCompany = async () => {
  try {
    const response = await axios.get("/jobsInfo");
    jobsOptions.value = response.data;
    console.log(jobsOptions.value);
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
};

const handleApply = (id) =>{
  console.log(id);
} 

onMounted(() => {
  fetchCompanyInfo();
  fetchJobsWitCompany();
});
</script>

<template>
  <v-app>
    <v-toolbar app color="primary" dark dense>
      <v-toolbar-title>JOB FINDER</v-toolbar-title>
      <v-spacer />
      <v-btn @click="handleLogout" text>
        <v-icon left>mdi-logout</v-icon>LOGOUT
      </v-btn>
    </v-toolbar>

    <v-container fluid>
      <v-row>
        <!-- Company List -->
        <v-col cols="12" v-if="isLoading" class="text-center loading-section">
          <v-progress-circular indeterminate color="primary" size="50" />
          <p class="loading-text">Loading company information...</p>
        </v-col>

        <v-col v-else cols="2" class="company-list">
          <v-card class="company-card">
            <v-list dense>
              <v-list-subheader>COMPANIES WORKING WITH US</v-list-subheader>
              <v-divider />
              <v-list-item
                v-for="(company, index) in companyOptions"
                :key="index"
                class="company-item"
              >
                <v-list-item-avatar>
                  <v-img
                    :src="company.logo"
                    class="round-logo"
                    height="40"
                    width="40"
                    cover
                  />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="company-name">
                    {{ company.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <!-- Job Cards -->
        <v-col cols="10" class="job-list">
          <v-row dense>
            <v-col
              v-for="(job, index) in jobsOptions"
              :key="index"
              cols="12"
              md="6"
              lg="4"
              class="mb-4"
            >
              <v-card class="job-card" elevation="3" hover>
                <!-- Company and Job Information -->
                <v-card-title>
                  <v-row no-gutters align="center">
                    <v-col cols="2">
                      <v-img
                        :src="`http://127.0.0.1:8000/storage/logos/${job.company.logo}`"
                        class="round-logo"
                        height="40"
                        width="40"
                        cover
                      />
                    </v-col>
                    <v-col cols="7" class="company-name">
                      {{ job.company.name }}
                    </v-col>
                    <v-col cols="3" class="text-right">
                      <v-icon>mdi-map-marker</v-icon>{{ job.company.address }}
                    </v-col>
                  </v-row>
                </v-card-title>

                <v-card-subtitle>
                  <v-row no-gutters align="center">
                    <v-col cols="6">
                      <v-icon>mdi-sort-calendar-ascending</v-icon> {{ job.posted_date }}
                    </v-col>
                    <v-col cols="6">
                      <v-icon>mdi-sort-calendar-descending</v-icon> {{ job.expiry_date }}
                    </v-col>
                  </v-row>
                </v-card-subtitle>

                <!-- Job Details -->
                <v-card-text>
                  <h1 class="job-title">{{ job.title }}</h1>
                  <v-row>
                    <v-col cols="6">Type: {{ job.employment_type }}</v-col>
                    <v-col cols="6">
                      Skills Required: {{ job.skills_required }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      Experience Required: {{ job.experience_required }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-icon>mdi-currency-rupee</v-icon>{{ job.salary }}
                    </v-col>
                  </v-row>
                </v-card-text>

                <!-- Apply Button -->
                <v-card-actions>
                  <v-btn
                    color="primary"
                    class="apply-button"
                    @click="handleApply(job.id)"
                  >
                    APPLY
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<style scoped>
.company-list {
  padding: 16px;
  background-color: #f0f5fa;
}

.company-card {
  padding: 10px;
  background-color: white;
}

.company-item {
  padding: 10px;
  transition: background-color 0.2s;
}

.company-item:hover {
  background-color: #e0f7fa;
}

.round-logo {
  border-radius: 50%;
}

.company-name {
  color: #3f51b5;
  font-weight: bold;
}

.job-list {
  padding: 16px;
}

.job-card {
  transition: box-shadow 0.3s;
  border-radius: 8px;
}

.job-card:hover {
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
}

.job-title {
  color: #3f51b5;
  font-weight: bold;
}

.apply-button {
  text-transform: uppercase;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const companyOptions = ref([]);
const isLoading = ref(false);
const jobsOptions = ref([]);
const applyDialog = ref(false);
const email = ref("");
const resume = ref(null);
const form = ref(null);

// Form validity tracking
const isFormValid = ref(false);
const jobApplicationStatus = ref({});

// Track if all required fields are filled
const isSubmitEnabled = computed(() => {
  return email.value.trim() !== "" && resume.value !== null;
});

const handleLogout = () => {
  if (process.client) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("appliedJobs");
  }
  router.push("/");
};

const fetchCompanyInfo = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get("/companyinfo");
    companyOptions.value = response.data.data.map((company) => ({
      name: company.name,
      logo: `http://127.0.0.1:8000/storage/logos/${company.logo}`,
    }));
  } catch (error) {
    console.error("Error fetching companies:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchJobsWithCompany = async () => {
  try {
    const response = await axios.get("/jobsInfo");
    jobsOptions.value = response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
};

const dialogClear = () => {
  resume.value = null;
};

const closeDialog = () => {
  applyDialog.value = false;
  dialogClear();
};

const handleApply = (id) => {
  applyDialog.value = true;
  if (process.client) {
    localStorage.setItem("jobId", id);
  }
};

const submitApplication = async () => {
  if (form.value) {
    const isValid = await form.value.validate();
    const job_descriptions_id = localStorage.getItem("jobId");
    if (isValid) {
      const formData = new FormData();
      formData.append("email", email.value);
      formData.append("job_descriptions_id", job_descriptions_id);
      formData.append("resume", resume.value);

      // Token handling
      const token = localStorage.getItem("authToken") || "";

      try {
        await axios.post(
          "/userJobDetails",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        jobApplicationStatus.value[job_descriptions_id] = true;
        console.log("Application submitted successfully");
        closeDialog();
      } catch (error) {
        console.error("Error submitting application:", error);
      }
    }
  }
};

onMounted(() => {
  if (process.client) {
    email.value = localStorage.getItem("userEmail") || "";
    // Retrieve applied jobs from local storage
    const appliedJobs = localStorage.getItem("appliedJobs");
    if (appliedJobs) {
      jobApplicationStatus.value = JSON.parse(appliedJobs);
    }
  }
  fetchCompanyInfo();
  fetchJobsWithCompany();
});

// Save the applied jobs to local storage when the state changes
watch(
  jobApplicationStatus,
  (newVal) => {
    if (process.client) {
      localStorage.setItem("appliedJobs", JSON.stringify(newVal));
    }
  },
  { deep: true }
);
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
                      <v-icon>mdi-sort-calendar-ascending</v-icon
                      >{{ job.posted_date }}
                    </v-col>
                    <v-col cols="6">
                      <v-icon>mdi-sort-calendar-descending</v-icon
                      >{{ job.expiry_date }}
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
                    :disabled="jobApplicationStatus[job.id]"
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

    <!-- Apply dialog -->
    <v-dialog v-model="applyDialog" max-width="400" persistent>
      <v-card>
        <v-card-title>Apply for Job</v-card-title>
  
        <v-card-text>
          <!-- Form with validation -->
          <v-form ref="form" v-model="isFormValid" lazy-validation>
            <!-- Email field with validation -->
            <v-text-field
              v-model="email"
              label="Email"
              disabled
              required
            />
  
            <!-- File input field with validation -->
            <v-file-input
              v-model="resume"
              label="Upload Resume"
              required
              accept=".pdf,.doc,.docx"
            />
          </v-form>
        </v-card-text>
  
        <v-card-actions>
          <!-- Cancel button -->
          <v-btn text @click="closeDialog">Cancel</v-btn>
  
          <!-- Apply button with correct validation -->
          <v-btn
            color="primary"
            @click="submitApplication"
            :disabled="!isSubmitEnabled" 
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

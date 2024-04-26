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
const myjobStatusDialog = ref(false);
const jobStatus = ref([]);

// Form validity tracking
const isFormValid = ref(false);
const jobApplicationStatus = ref({});

// Track if all required fields are filled
const isSubmitEnabled = computed(() => {
  return email.value.trim() !== "" && resume.value !== null;
});

const openMyJobStatusDailog = () => {
  myjobStatusDialog.value = true;
};

const closeMyJobStatusDailog = () => {
  myjobStatusDialog.value = false;
};

const handleLogout = () => {
  if (process.client) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("appliedJobs");
    localStorage.removeItem("user_id");
  }
  useNuxtApp().$toast.success("LogOut Successfully...");
  setTimeout(function () {
    router.push("/");
  }, 1500);
};

const fetchCompanyInfo = async () => {
  isLoading.value = true;
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.get("/companyinfo", {
      headers: {
        Authorization: `Bearer${token}`,
      },
    });
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

const fetchJobStatus = async () => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      console.error("User ID not found in local storage");
      return;
    }

    const response = await axios.get("/jobsStatus", {
      params: {
        user_id: userId,
      },
    });

    jobStatus.value = response.data;
    console.log(jobStatus.value);
  } catch (error) {
    console.error("Error fetching job status:", error);
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
        await axios.post("/userJobDetails", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        jobApplicationStatus.value[job_descriptions_id] = true;
        useNuxtApp().$toast.success("Application submitted successfully");
        closeDialog();
      } catch (error) {
        useNuxtApp().$toast.error("You have already apply for this job");
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
  fetchJobStatus();
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
  <v-app style="background-color: #f0f5fa">
    <!-- navbar section starts -->
    <nav class="navbar">
      <div class="logo">
        <span>Job<span style="font-size: x-large">FINDER</span></span>
      </div>
      <div class="links">
        <VBtn class="login-btn" @click="handleLogout">
          <v-icon>mdi mdi-logout</v-icon> LOGOUT</VBtn
        >
      </div>
    </nav>
    <!-- navbar section ends  -->

    <v-container fluid>
      <v-row>
        <!-- Company List -->
        <v-col cols="12" v-if="isLoading" class="text-center loading-section">
          <v-progress-circular indeterminate color="primary" size="50" />
          <p class="loading-text">Loading company information...</p>
        </v-col>

        <!-- vlist section starts -->
        <v-col v-if="!isLoading" cols="2">
          <v-list nav :lines="false" style="background-color: transparent">
            <v-list-header class="font-weight-black"
              >Companies Associated with Us</v-list-header
            >
            <v-divider />

            <v-list-item
              v-for="(company, index) in companyOptions"
              :key="index"
              class="company-list-item"
            >
              <template #prepend>
                <v-img
                  :src="company.logo"
                  contain
                  height="40"
                  width="40"
                  class="company-avatar"
                />
              </template>

              <v-list-item-title class="company-name text-uppercase">
                {{ company.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
        <!-- vlist section ends -->

        <v-col cols="10" class="job-list">
          <!-- my job button -->
          <v-row class="mb-1">
            <v-col>
              <div class="demo-space-x float-right">
                <VBtn
                  variant="tonal"
                  rounded="lg"
                  color="primary"
                  @click="openMyJobStatusDailog"
                >
                  My Job Status
                </VBtn>
              </div>
            </v-col>
          </v-row>
          <!-- my job button ends -->

          <!-- vdialog for showing jobs status starts-->
          <VDialog
            v-model="myjobStatusDialog"
            fullscreen
            :scrim="false"
            transition="dialog-bottom-transition"
            class="my-job-status-dialog"
          >
            <!-- Dialog Content -->
            <VCard>
              <!-- Toolbar -->
              <div>
                <VToolbar color="primary">
                  <VBtn icon variant="plain" @click="closeMyJobStatusDailog">
                    <VIcon color="white" icon="mdi mdi-close-circle" />
                  </VBtn>

                  <VToolbarTitle class="text-h5">My Job Status</VToolbarTitle>
                  <VSpacer />
                </VToolbar>
              </div>

              <div>
                <V-row dense>
                  <v-col
                    v-for="(status, index) in jobStatus"
                    :key="index"
                    cols="12"
                    md="6"
                    lg="4"
                  >
                    <v-card class="job-status-card">
                      <v-card-title class="card-title">
                        Position Applied For: {{ status.job_title }}
                      </v-card-title>

                      <v-card-subtitle class="card-subtitle">
                        Company Applied In: {{ status.company_name }}
                      </v-card-subtitle>

                      <div class="demo-space-x">
                        <!-- Success chip for 'Approved' -->
                        <VChip
                          color="success"
                          class="status-chip"
                          v-if="status.status === 'A'"
                        >
                          Approved
                        </VChip>

                        <!-- Error chip for 'Rejected' -->
                        <VChip
                          color="error"
                          class="status-chip"
                          v-if="status.status === 'R'"
                        >
                          Rejected
                        </VChip>

                        <!-- Primary chip for 'Pending' -->
                        <VChip
                          label="Pending"
                          color="primary"
                          class="status-chip"
                          v-if="status.status === 'P'"
                        >
                          Pending
                        </VChip>
                      </div>
                    </v-card>
                  </v-col>
                </V-row>
              </div>
            </VCard>
          </VDialog>
          <!-- vdialog for showing jobs status ends-->

          <v-row dense>
            <v-col
              v-for="(job, index) in jobsOptions"
              :key="index"
              cols="12"
              md="6"
              lg="4"
              class="mb-4"
            >
              <v-card class="job-card h-100 rounded-xl mx-auto" hover>
                <!-- Company and Job Information -->
                <v-card-title>
                  <v-row no-gutters align="center" class="mt-2">
                    <v-col cols="2" class="pl-8">
                      <v-img
                        :src="`http://127.0.0.1:8000/storage/logos/${job.company.logo}`"
                        class="company-avatar"
                        height="40"
                        width="40"
                        cover
                      />
                    </v-col>
                    <v-col cols="7" class="company-name-title">
                      {{ job.company.name }}
                    </v-col>
                    <v-col cols="3" class="text-uppercase font-weight-light">
                      <v-icon>mdi-map-marker</v-icon>{{ job.company.address }}
                    </v-col>
                  </v-row>
                </v-card-title>

                <v-divider></v-divider>

                <!-- posted on expiry on  -->
                <v-card-subtitle>
                  <v-row no-gutters align="center" class="mt-3">
                    <v-col cols="5" class="pl-10">
                      Posted On :{{ job.posted_date }}
                    </v-col>
                    <v-col cols="7" class="pl-10">
                      Expiry On :{{ job.expiry_date }}
                    </v-col>
                  </v-row>
                </v-card-subtitle>

                <!-- Job Details -->
                <v-card-text>
                  <h1 class="job-title">{{ job.title }}</h1>
                  <v-row>
                    <!-- job employment type -->
                    <v-col cols="6" class="mt-2 pl-12">
                      <div class="demo-space-x">
                        <VChip color="success">
                          {{ job.employment_type }}
                        </VChip>
                      </div></v-col
                    >
                    <!-- skills required -->
                    <v-col cols="6" class="mt-2 pl-3">
                      <div class="demo-space-x">
                        <VChip :label="false" color="primary">
                          {{ job.skills_required }}
                        </VChip>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4" class="pl-10 font-weight-black text-subtitle-1">
                      <v-icon>mdi-currency-rupee</v-icon>{{ job.salary }}
                    </v-col>
                    <v-col cols="8"  class="text-uppercase font-italic font-weight-thin pl-12 pt-4">
                      {{ job.experience_required }}
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
        <v-card-title class="d-flex justify-center">Apply for Job</v-card-title>

        <v-card-text>
          <!-- Form with validation -->
          <v-form ref="form" v-model="isFormValid" lazy-validation>
            <!-- Email field with validation -->
            <v-text-field v-model="email" label="Email" disabled variant="outlined" />

            <!-- File input field with validation -->
            <v-file-input
              v-model="resume"
              label="Upload Resume"
              required
              accept=".pdf,.doc,.docx"
              variant="outlined"
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
/* navbar styling starts */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #070707;
  color: white;
}

.logo span {
  font-size: 1.2rem;
}

.links button {
  margin-left: 10px;
  padding: 8px 16px;
  cursor: pointer;
}
/* navbar styling ends */

/* vlisting starts */
.company-avatar {
  border-radius: 50%;
}

.company-list-item {
  transition: background-color 0.3s;
  padding: 12px 16px;
  cursor: pointer;
  align-items: center;
}

.company-list-item:hover {
  background-color: #e3f2fd;
}

.company-name {
  font-weight: bold;
  color: #3f51b5;
  padding-left: 10px;
  transition: all 0.3s;
}

.company-name-title {
  font-weight: bold;
  font-size: 35px;
  color: #070707;
}

.company-name:hover {
  color: #1a237e;
}

/* Job list styling */
.job-list {
  padding: 16px;
}

/* Job cards with subtle hover effect */
.job-card {
  transition: box-shadow 0.3s;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.job-card:hover {
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
}

/* Job title with specific color */
.job-title {
  color: rgb(53, 46, 53);
  font-weight: bold;
  padding-left: 40px;
}

/* Apply button uppercase styling */
.apply-button {
  text-transform: uppercase;
  width:100vw;
}

/* Job status chips */
.job-status-card {
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 16px; 
  background-color: #fafafa; 
  margin-bottom: 16px;
}

/* Title and subtitle styling */
.card-title {
  font-weight: bold;
  color: #3f51b5; 
}

.card-subtitle {
  color: #757575;
  margin-bottom: 8px; 
  font-size: 1.2rem;
}

/* Chip container styling */
.status-chips {
  display: flex; 
  gap: 8px; 
  margin-top: 8px; 
}

/* Specific chip styling */
.status-chip {
  font-weight: bold; 
  border-radius: 50px; 
  padding: 6px 12px; 
}

/* Chip color adjustments for better visibility */
.status-chip[color="success"] {
  background-color: #4caf50; 
}

.status-chip[color="error"] {
  background-color: #f44336; 
}

.status-chip[color="primary"] {
  background-color: #2196f3;
}
</style>

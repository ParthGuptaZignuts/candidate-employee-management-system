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
  fetchJobStatus();
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
  <VApp style="background-color: #f0f5fa">
    <!-- navbar section starts -->
    <nav class="navbar">
      <div class="logo">
        <span>Job<span style="font-size: x-large">FINDER</span></span>
      </div>
      <div class="links">
        <VBtn class="login-btn" @click="handleLogout">
          <VIcon>mdi mdi-logout</VIcon> LOGOUT</VBtn
        >
      </div>
    </nav>
    <!-- navbar section ends  -->

    <VContainer fluid>
      <VRow>
        <!-- Company List -->
        <VCol cols="12" v-if="isLoading" class="text-center loading-section">
          <VProgressCircular indeterminate color="primary" size="50" />
          <p class="loading-text">Loading company information...</p>
        </VCol>

        <!-- vlist section starts -->
        <VCol v-if="!isLoading" cols="2">
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
                <VImg
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
        </VCol>
        <!-- vlist section ends -->

        <VCol cols="10" class="job-list">
          <!-- my job button -->
          <VRow class="mb-1">
            <VCol>
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
            </VCol>
          </VRow>
          <!-- my job button ends -->

          <!-- vdialog for showing jobs status starts-->
          <VDialog
            v-model="myjobStatusDialog"
            fullscreen
            :scrim="false"
            transition="dialog-bottom-transition"
          >
            <!-- Dialog Content -->
            <VCard>
              <!-- Toolbar -->
              <div>
                <VToolbar class="navbar">
                  <VBtn icon variant="plain" @click="closeMyJobStatusDailog">
                    <VIcon color="white" icon="mdi mdi-close-circle" />
                  </VBtn>

                  <VToolbarTitle class="text-h5">Job Status</VToolbarTitle>
                  <VSpacer />
                </VToolbar>
              </div>

              <div>
                <VRow dense>
                  <VCol
                    v-for="(status, index) in jobStatus"
                    :key="index"
                    cols="12"
                    md="6"
                    lg="4"
                  >
                    <VCard class="job-status-card">
                      <VCardTitle class="card-title">
                        Position Applied For: {{ status.job_title }}
                      </VCardTitle>

                      <VCardSubTitle class="card-subtitle">
                        Company Applied In: {{ status.company_name }}
                      </VCardSubTitle>

                      <VCardSubTitle class="card-subtitle">
                        <VRow class="d-flex mt-2">
                          <VCol>
                            <VChip variant="tonal" color="info">
                              <VIcon start icon="mdi-pin" />
                              {{ status.company_location }}
                            </VChip>
                          </VCol>
                          <VCol>
                            <VChip variant="tonal" color="error">
                              <VIcon start icon="mdi-clock-time-eight" />
                              {{ status.job_expiry }}
                            </VChip>
                          </VCol>
                          <VCol>
                            <VChip variant="tonal" color="success">
                              <VIcon start icon="mdi mdi-currency-inr" />
                              {{ status.job_salary }}
                            </VChip>
                          </VCol>
                        </VRow>
                      </VCardSubTitle>

                      <div class="demo-space-x mt-5 text-uppercase">
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
                    </VCard>
                  </VCol>
                </VRow>
              </div>
            </VCard>
          </VDialog>
          <!-- vdialog for showing jobs status ends-->

          <!-- job cards starts -->
          <VRow dense>
            <VCol
              v-for="(job, index) in jobsOptions"
              :key="index"
              cols="12"
              md="6"
              lg="4"
              class="mb-4"
            >
              <VCard class="job-card h-100 rounded-xl mx-auto" hover>
                <!-- Company and Job Information -->
                <VCardTitle>
                  <VRow no-gutters align="center" class="mt-2">
                    <VCol cols="2" class="pl-8">
                      <VImg
                        :src="`http://127.0.0.1:8000/storage/logos/${job.company.logo}`"
                        class="company-avatar"
                        height="40"
                        width="40"
                        cover
                      />
                    </VCol>
                    <VCol cols="7" class="company-name-title">
                      {{ job.company.name }}
                    </VCol>
                    <VCol cols="3" class="text-uppercase font-weight-light">
                      <VIcon>mdi-map-marker</VIcon>{{ job.company.address }}
                    </VCol>
                  </VRow>
                </VCardTitle>

                <v-divider></v-divider>

                <!-- posted on expiry on  -->
                <VCardSubTitle>
                  <VRow no-gutters align="center" class="mt-3">
                    <VCol cols="5" class="pl-10">
                      Posted On :{{ job.posted_date }}
                    </VCol>
                    <VCol cols="7" class="pl-10">
                      Expiry On :{{ job.expiry_date }}
                    </VCol>
                  </VRow>
                </VCardSubTitle>

                <!-- Job Details -->
                <VCard-text>
                  <h1 class="job-title">{{ job.title }}</h1>
                  <VRow>
                    <!-- job employment type -->
                    <VCol cols="6" class="mt-2 pl-12">
                      <div class="demo-space-x">
                        <VChip color="success">
                          {{ job.employment_type }}
                        </VChip>
                      </div></VCol
                    >
                    <!-- skills required -->
                    <VCol cols="6" class="mt-2 pl-3">
                      <div class="demo-space-x">
                        <VChip :label="false" color="primary">
                          {{ job.skills_required }}
                        </VChip>
                      </div>
                    </VCol>
                  </VRow>
                  <VRow>
                    <VCol
                      cols="5"
                      class="pl-6 font-weight-black text-subtitle-1"
                    >
                      <VIcon>mdi-currency-rupee</VIcon>{{ job.salary }}
                    </VCol>
                    <VCol
                      cols="7"
                      class="text-uppercase font-italic font-weight-thin pl-8 pt-4"
                    >
                      {{ job.experience_required }}
                    </VCol>
                  </VRow>
                </VCard-text>

                <!-- Apply Button -->
                <VCard-actions>
                  <VBtn
                    color="primary"
                    class="apply-button"
                    @click="handleApply(job.id)"
                    :disabled="jobApplicationStatus[job.id]"
                  >
                    APPLY
                  </VBtn>
                </VCard-actions>
              </VCard>
            </VCol>
          </VRow>
          <!-- job cards ends -->
        </VCol>
      </VRow>
    </VContainer>

    <!-- Apply dialog -->
    <v-dialog v-model="applyDialog" max-width="400" persistent>
      <VCard>
        <VCardTitle class="d-flex justify-center">Apply for Job</VCardTitle>

        <VCard-text>
          <!-- Form with validation -->
          <v-form ref="form" v-model="isFormValid" lazy-validation>
            <!-- Email field with validation -->
            <v-text-field
              v-model="email"
              label="Email"
              disabled
              variant="outlined"
            />

            <!-- File input field with validation -->
            <v-file-input
              v-model="resume"
              label="Upload Resume"
              required
              accept=".pdf,.doc,.docx"
              variant="outlined"
            />
          </v-form>
        </VCard-text>

        <VCard-actions>
          <!-- Cancel button -->
          <VBtn text @click="closeDialog">Cancel</VBtn>

          <!-- Apply button with correct validation -->
          <VBtn
            color="primary"
            @click="submitApplication"
            :disabled="!isSubmitEnabled"
          >
            Submit
          </VBtn>
        </VCard-actions>
      </VCard>
    </v-dialog>
  </VApp>
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
  width: 100vw;
}

/* Job status chips */
.job-status-card {
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 16px;
  background-color: #fafafa;
  margin-bottom: 16px;
  text-align: center;
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
  text-transform: capitalize;
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

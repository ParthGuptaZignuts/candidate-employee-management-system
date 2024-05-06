<script setup>
// imports of required modules
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// ref variables
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
const isFormValid = ref(false);
const jobApplicationStatus = ref({});

// Track if all required fields are filled
const isSubmitEnabled = computed(() => {
  return email.value.trim() !== "" && resume.value !== null;
});

// my job status dialog opening function
const openMyJobStatusDailog = () => {
  myjobStatusDialog.value = true;
  fetchJobStatus();
};

// my job status dialog closing function
const closeMyJobStatusDailog = () => {
  myjobStatusDialog.value = false;
};

// logout function
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

// fetch company information
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

// fetch the jobs with company information
const fetchJobsWithCompany = async () => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.get("/jobsInfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    jobsOptions.value = response.data.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
};

// fetch my job status information
const fetchJobStatus = async () => {
  try {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("authToken");

    if (!userId) {
      console.error("User ID not found in local storage");
      return;
    }

    const response = await axios.get("/jobsStatus", {
      
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        user_id: userId,
      },

    });

    jobStatus.value = response.data.data;
    console.log(jobStatus.value);

  } catch (error) {
    console.error("Error fetching job status:", error);
  }
};

// upload resume clear dialog
const dialogClear = () => {
  resume.value = null;
};

// upload resume close dialog
const closeDialog = () => {
  applyDialog.value = false;
  dialogClear();
};

// hand apply function
const handleApply = (id) => {
  applyDialog.value = true;
  // for client local storage using process.client
  if (process.client) {
    localStorage.setItem("jobId", id);
  }
};

// submit application function
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
</script>

<template>
  <VApp style="background-color: #f0f5fa">
    <!-- navbar section starts -->
    <nav class="navbar">
      <!-- title -->
      <div class="logo">
        <span>Job<span style="font-size: x-large">FINDER</span></span>
      </div>
      <!-- logout button -->
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
          <v-list :lines="false" nav style="background-color: transparent">
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
            :scrim="false"
            fullscreen
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
                    <!-- job title -->
                    <VCard class="job-status-card">
                      <VCardTitle class="card-title">
                        Position Applied For: {{ status.job_title }}
                      </VCardTitle>

                      <!-- company name -->
                      <VCardSubTitle class="card-subtitle">
                        Company Applied In: {{ status.company_name }}
                      </VCardSubTitle>

                      <!-- company location -->
                      <VCardSubTitle class="card-subtitle">
                        <VRow class="d-flex mt-2">
                          <VCol>
                            <VChip variant="tonal" color="info">
                              <VIcon start icon="mdi-pin" />
                              {{ status.company_location }}
                            </VChip>
                          </VCol>
                          <VCol>
                            <!-- job expiry -->
                            <VChip variant="tonal" color="error">
                              <VIcon start icon="mdi-clock-time-eight" />
                              {{ status.job_expiry }}
                            </VChip>
                          </VCol>
                          <VCol>
                            <!-- job status -->
                            <VChip variant="tonal" color="success">
                              <VIcon start icon="mdi mdi-currency-inr" />
                              {{ status.job_salary }}
                            </VChip>
                          </VCol>
                        </VRow>
                      </VCardSubTitle>

                      <div class="demo-space-x mt-5 text-uppercase">
                          <VChip 
                          color="info"
                          class="status-chip">
                            <a :href="`http://127.0.0.1:8000/storage/${status.resume}`" target="_blank">View Resume</a>
                          </VChip>
                      </div>

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

    <!-- Apply dialog starts-->
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
    <!-- Apply dialog ends -->
  </VApp>
</template>

<!-- style -->
<style scoped>
/* Navbar styling starts */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 1.25rem;
  background-color: #070707; /* Very dark background */
  color: white; /* White text color */
}

/* Logo span with a specific font size */
.logo span {
  font-size: 1.2rem;
}

/* Button styling with margin and padding */
.links button {
  margin-left: 0.625rem;
  padding: 0.5rem 1rem; /* Converted from 8px and 16px (8/16, 16/16) */
  cursor: pointer; /* Pointer cursor */
}
/* Navbar styling ends */

/* Company avatar with a circular border */
.company-avatar {
  border-radius: 50%; /* Circular border */
}

/* Company list item with hover transition */
.company-list-item {
  transition: background-color 0.3s; /* Smooth transition */
  padding: 0.75rem 1rem; /* Converted from 12px and 16px (12/16, 16/16) */
  cursor: pointer; /* Pointer cursor */
  align-items: center; /* Align vertically */
}

/* Hover effect for company list item */
.company-list-item:hover {
  background-color: #e3f2fd; /* Light blue on hover */
}

/* Company name with bold font and color transition */
.company-name {
  font-weight: bold; /* Bold font weight */
  color: #3f51b5; /* Blue color */
  padding-left: 0.625rem;
  transition: all 0.3s; /* Smooth transition */
}

/* Title for company with large font size */
.company-name-title {
  font-weight: bold; /* Bold font weight */
  font-size: 2.1875rem;
  color: #070707; /* Dark color */
}

/* Hover effect for company name */
.company-name:hover {
  color: #1a237e; /* Dark blue on hover */
}

/* Job list with padding */
.job-list {
  padding: 1rem;
}

/* Job card with hover effect and border radius */
.job-card {
  transition: box-shadow 0.3s; /* Smooth transition */
  border-radius: 0.5rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

/* Hover effect for job card */
.job-card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

/* Job title with specific color and padding */
.job-title {
  color: rgb(53, 46, 53); /* Custom color */
  font-weight: bold; /* Bold font weight */
  padding-left: 2.5rem;
}

/* Apply button with uppercase text transformation */
.apply-button {
  text-transform: uppercase; /* Uppercase text */
  width: 100vw; /* Full viewport width */
}

/* Job status chips */
.job-status-card {
  border-radius: 0.5rem;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);
  padding: 1rem;
  background-color: #fafafa; /* Light grey */
  margin-bottom: 1rem; /* Converted from 16px (16/16) */
  text-align: center; /* Center-align text */
}

/* Title and subtitle styling */
.card-title {
  font-weight: bold; /* Bold font weight */
  color: #3f51b5; /* Blue color */
}

/* Card subtitle with margin and specific font size */
.card-subtitle {
  color: #757575; /* Grey color */
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  text-transform: capitalize; /* Capitalized text */
}

/* Chip container with gap and margin */
.status-chips {
  display: flex; /* Flex layout */
  gap: 0.5rem;
  margin-top: 0.5rem;
}

/* Specific chip styling with border radius and padding */
.status-chip {
  font-weight: bold; /* Bold font weight */
  border-radius: 3.125rem; /* Rounded chip */
  padding: 0.375rem 0.75rem;
}

/* Chip color adjustments for success, error, and primary colors */
.status-chip[color="success"] {
  background-color: #4caf50; /* Green for success */
}

.status-chip[color="error"] {
  background-color: #f44336; /* Red for error */
}

.status-chip[color="primary"] {
  background-color: #2196f3; /* Blue for primary */
}
</style>

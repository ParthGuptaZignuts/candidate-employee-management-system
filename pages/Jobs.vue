<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const companyOptions = ref([]);
const isLoading = ref(false);
const handleLogout = () => {
  // Remove token from local storage
  localStorage.removeItem("authToken");

  // You can also perform other logout tasks here, like redirecting or resetting the app state
  console.log("Logged out and token deleted");

  router.push("/");
};


const fetchCompanyNames = async () => {
  try {
    const response = await axios.get('/companyinfo');
    companyOptions.value = response.data.data.name;
  } catch (error) {
    console.error('Error fetching company options:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchCompanyNames);
</script>

<template>
  <VApp>
    <VToolbar app color="custom-navbar">
      <VToolbarTitle>JOB FINDER</VToolbarTitle>
      <VSpacer></VSpacer>
      <VToolbarItems class="hidden-xs-only">
        <VBtn @click="handleLogout">
          <VIcon>mdi mdi-logout</VIcon>
          <div class="titleHide">LOGOUT</div>
        </VBtn>
      </VToolbarItems>
    </VToolbar>

    <!-- Main content area -->
    <div class="content-area">
    <VRow>
        <VCol cols="2">
            <VList/>   
        </VCol>  
        
        <VCol cols="10">
            <VRow>
            <v-card
            height="300px"
            width="300px">
                <v-card-title primary-title>
                    title
                </v-card-title>
                <v-card-subtitle>
                    subtitle
                </v-card-subtitle>
            </v-card>
            <v-card
            height="300px"
            width="300px">
                <v-card-title primary-title>
                    title
                </v-card-title>
                <v-card-subtitle>
                    subtitle
                </v-card-subtitle>
            </v-card>
            <v-card
            height="300px"
            width="300px">
                <v-card-title primary-title>
                    title
                </v-card-title>
                <v-card-subtitle>
                    subtitle
                </v-card-subtitle>
            </v-card>
            <v-card
            height="300px"
            width="300px">
                <v-card-title primary-title>
                    title
                </v-card-title>
                <v-card-subtitle>
                    subtitle
                </v-card-subtitle>
            </v-card>
        </VRow>
        </VCol>
    </VRow>
    </div>
  </VApp>
</template>

<style scoped>

.content-area {
  background-color: #f0f5fa; 
  height: 100vh; 
  overflow: auto;
}

</style>

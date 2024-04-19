<script setup>
// import
import { ref, computed } from "vue";

// contants
const loginModal = ref(false);
const loginFormData = ref({
  email: "",
  password: "",
});

const signupModal = ref(false);
const signupFormData = ref({
  first_name: "",
  last_name:"",
  email: "",
  phone:"",
  dob:"",
  city:"",
  password: "",
});

// function to open login modal
const openLoginModal = () => {
  loginModal.value = true;
};

// function to close login modal
const closeLoginModal = () => {
  loginModal.value = false;
  LoginResetForm();
};

// function handle login submissions
const LoginSubmitForm = () => {
  // Handle form submission here
};

// function handle login reset
const LoginResetForm = () => {
  loginFormData.value.email = "";
  loginFormData.value.password = "";
};

// function to open sign up modal
const openSignupModal = () => {
  signupModal.value = true;
};

// function to close sign up modal
const closeSignupModal = () => {
  signupModal.value = false;
  SignupResetForm();
};

// function handle signup submission 
const SignupSubmitForm = () => {
  // Handle form submission here
};

// function handle siggnup reset
const SignupResetForm = () => {
  signupFormData.value.first_name = "";
  signupFormData.value.last_name = "";
  signupFormData.value.email = "";
  signupFormData.value.phone = "";
  signupFormData.value.dob = "";
  signupFormData.value.city = "";
  signupFormData.value.password = "";
};

// Computed property to check if all required fields are filled
const isLoginFormValid = computed(() => {
  return loginFormData.value.email.trim() !== "" && loginFormData.value.password.trim() !== "";
});

const isSignupFormValid = computed(() => {
  const formData = signupFormData.value;
  return (
    formData.first_name.trim() !== "" &&
    formData.last_name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.dob.trim() !== "" &&
    formData.city.trim() !== "" &&
    formData.password.trim() !== ""
  );
});
</script>

<template>
  <nav class="navbar">
    <div class="logo">
      <span>Job<span style="font-size:x-large;">FINDER</span></span>
    </div>
    <div class="links">
      <VBtn class="login-btn" @click="openLoginModal">LOGIN</VBtn>
      <VBtn class="signup-btn" @click="openSignupModal">SIGN UP</VBtn>
    </div>
  </nav>

  <!-- LOGIN  -->
  <VDialog
    persistent
    max-width="600px"
    height="330px"
    scrollable=false
    transition="dialog-top-transition"
    v-model="loginModal"
  >
    <VCard class="login-card">
      <VBtn icon @click="closeLoginModal" class="close-btn" elevation="0">
        <VIcon>mdi-close</VIcon>
      </VBtn>
      <VCardTitle class="login-title">LOGIN</VCardTitle>
      <VCardText>
        <VForm @submit.prevent="LoginSubmitForm">
          <VRow>
            <VCol cols="12">
              <VTextField
                prepend-inner-icon="mdi mdi-email-outline"
                label="Email"
                type="email"
                placeholder="Email"
                outlined
                dense
                required
                v-model="loginFormData.email"
              ></VTextField>
            </VCol>
            <VCol cols="12">
              <VTextField
                prepend-inner-icon="mdi mdi-lock"
                label="Password"
                type="password"
                placeholder="Password"
                outlined
                dense
                required
                v-model="loginFormData.password"
              ></VTextField>
            </VCol>
            <VCol cols="12">
              <VBtn   color="primary" class="submit-btn" @click="LoginSubmitForm"
              :disabled="!isLoginFormValid"
                >Submit</VBtn
              >
              <VBtn color="grey" @click="LoginResetForm" class="reset-btn"
                >Reset</VBtn
              >
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>

<!-- SIGNUP -->
<VDialog
  persistent
  max-width="600px"
  height="640px"
  scrollable=false
  transition="dialog-bottom-transition"
  v-model="signupModal"
>
  <VCard class="login-card">
    <VBtn icon @click="closeSignupModal" class="close-btn" elevation="0">
      <VIcon>mdi-close</VIcon>
    </VBtn>
    <VCardTitle class="login-title">SIGNUP</VCardTitle>
    <VCardText>
      <VForm @submit.prevent="SignupSubmitForm">
        <VRow>
          <!-- First Name -->
          <VCol cols="12" sm="6">
            <VTextField
              prepend-inner-icon="mdi mdi-account"
              label="First Name"
              type="text"
              placeholder="First Name"
              outlined
              dense
              required
              v-model="signupFormData.first_name"
            ></VTextField>
          </VCol>
          <!-- Last Name -->
          <VCol cols="12" sm="6">
            <VTextField
              prepend-inner-icon="mdi mdi-account"
              label="Last Name"
              type="text"
              placeholder="Last Name"
              outlined
              dense
              required
              v-model="signupFormData.last_name"
            ></VTextField>
          </VCol>
          <!-- Email -->
          <VCol cols="12">
            <VTextField
              prepend-inner-icon="mdi mdi-email-outline"
              label="Email"
              type="email"
              placeholder="Email"
              outlined
              dense
              required
              v-model="signupFormData.email"
            ></VTextField>
          </VCol>
          <!-- Phone Number -->
          <VCol cols="12" sm="6">
            <VTextField
              prepend-inner-icon="mdi mdi-phone"
              label="Phone Number"
              type="number"
              placeholder="Phone Number"
              outlined
              dense
              required
              v-model="signupFormData.phone"
            ></VTextField>
          </VCol>
          <!-- Date of Birth (DOB) -->
          <VCol cols="12" sm="6">
            <VTextField
              prepend-inner-icon="mdi mdi-calendar"
              label="Date of Birth"
              type="date"
              placeholder="Date of Birth"
              outlined
              dense
              required
              v-model="signupFormData.dob"
            ></VTextField>
          </VCol>
          <!-- City -->
          <VCol cols="12">
            <VTextField
              prepend-inner-icon="mdi mdi-city"
              label="City"
              type="text"
              placeholder="City"
              outlined
              dense
              required
              v-model="signupFormData.city"
            ></VTextField>
          </VCol>
          <!-- Password -->
          <VCol cols="12">
            <VTextField
              prepend-inner-icon="mdi mdi-lock"
              label="Password"
              type="password"
              placeholder="Password"
              outlined
              dense
              required
              v-model="signupFormData.password"
            ></VTextField>
          </VCol>
          <!-- Submit and Reset Buttons -->
          <VCol cols="12">
            <VBtn color="primary" class="submit-btn" :disabled="!isSignupFormValid" @click="SignupSubmitForm">Submit</VBtn>
            <VBtn color="grey" @click="SignupResetForm" class="reset-btn">Reset</VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</VDialog>

</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #283046;
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

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}

.VDialog__content {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.login-card {
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.login-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-top: 10px;
}

.VTextField {
  width: 100%;
}

.submit-btn {
  transition: background-color 0.3s ease;
  margin-right: 10px;
}

.submit-btn:hover {
  background-color: #45a049 !important;
}

.reset-btn {
  color: #757575;
}
</style>

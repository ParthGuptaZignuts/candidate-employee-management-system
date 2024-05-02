<script setup>
// import the necessities
import { ref, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { emailValidator, requiredValidator } from "../utils/validators";

// Modal visibility
const loginModal = ref(false);
const signupModal = ref(false);

// router
const router = useRouter();

// Form data
const refForm = ref();
const refSignupForm = ref();

// login form data
const loginFormData = ref({
  email: "",
  password: "",
});

// sigup form data
const signupFormData = ref({
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  dob: "",
  city: "",
  password: "",
  password_confirmation: "",
});

// Open/Close modals
const openLoginModal = () => {
  loginModal.value = true;
};

const closeLoginModal = () => {
  loginModal.value = false;
  LoginResetForm();
};

const openSignupModal = () => {
  signupModal.value = true;
};

const closeSignupModal = () => {
  signupModal.value = false;
  SignupResetForm();
};

// Reset functions
const LoginResetForm = () => {
  loginFormData.value.email = "";
  loginFormData.value.password = "";
};

const SignupResetForm = () => {
  signupFormData.value.first_name = "";
  signupFormData.value.last_name = "";
  signupFormData.value.email = "";
  signupFormData.value.phone = "";
  signupFormData.value.dob = "";
  signupFormData.value.city = "";
  signupFormData.value.password = "";
  signupFormData.value.password_confirmation = "";
};

// Form validity checks
const isLoginFormValid = computed(() => {
  return (
    loginFormData.value.email.trim() !== "" &&
    loginFormData.value.password.trim() !== ""
  );
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
    formData.password.trim() !== "" &&
    formData.password_confirmation.trim() !== ""
  );
});

// move to login and signup page
const jumpToSignupPage = () => {
  loginModal.value = false;
  signupModal.value = true;
};

const jumpToSignInPage = () => {
  signupModal.value = false;
  loginModal.value = true;
};

// Handle form submissions
const LoginSubmitForm = async () => {
  try {
    const response = await axios.post("login", loginFormData.value);
    if (response) {
      // Store token in local storage
      localStorage.setItem("authToken", response.data.data.token);
      localStorage.setItem("userEmail", response.data.data.user.email);
      localStorage.setItem("user_id", response.data.data.user.id);
      // Redirect to 'jobs' page
      useNuxtApp().$toast.success("Login In ...");
      setTimeout(function () {
        router.push("/jobs");
      }, 1500);
    }
  } catch (error) {
    useNuxtApp().$toast.error("An Error Occurred...");
    console.error("Error:", Error);
  }
};

const SignupSubmitForm = async () => {
  if (
    signupFormData.value.password !== signupFormData.value.password_confirmation
  ) {
    useNuxtApp().$toast.error("Passwords do not match");
    return;
  }

  if (isSignupFormValid.value) {
    try {
      const response = await axios.post("/register", signupFormData.value);
      if (response) {
        useNuxtApp().$toast.success("Register successfully...");
        closeSignupModal();
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration.");
    }
  }
};
</script>

<!-- template starts -->
<template>
  <!-- navbar -->
  <nav class="navbar">
    <div class="logo">
      <!-- heading -->
      <span>Job<span style="font-size: x-large">FINDER</span></span>
    </div>
    <!-- login and signup div -->
    <div class="links">
      <VBtn class="login-btn" @click="openLoginModal">LOGIN</VBtn>
      <VBtn class="signup-btn" @click="openSignupModal">SIGN UP</VBtn>
    </div>
  </nav>

  <!-- LOGIN dialog starts -->
  <VDialog
    v-model="loginModal"
    persistent
    max-width="600px"
    height="330px"
    scrollable="false"
    transition="dialog-top-transition"
  >
    <VCard class="login-card">
      <VBtn icon class="close-btn" elevation="0" @click="closeLoginModal">
        <VIcon>mdi-close</VIcon>
      </VBtn>
      <VCardTitle class="login-title">LOGIN</VCardTitle>
      <VCardText>
        <VForm ref="refForm" @submit.prevent="LoginSubmitForm">
          <VRow>
            <VCol cols="12">
              <!-- email -->
              <VTextField
                v-model="loginFormData.email"
                :rules="[emailValidator, requiredValidator]"
                prepend-inner-icon="mdi mdi-email-outline"
                label="Email"
                type="email"
                placeholder="Email"
                variant="outlined"
              ></VTextField>
            </VCol>
            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="loginFormData.password"
                :rules="[requiredValidator]"
                prepend-inner-icon="mdi mdi-lock"
                label="Password"
                type="password"
                placeholder="Password"
                variant="outlined"
              ></VTextField>
            </VCol>
            <!-- submit button -->
            <VCol cols="12">
              <VBtn
                :disabled="!isLoginFormValid"
                color="primary"
                class="submit-btn"
                @click="LoginSubmitForm"
                >Submit</VBtn
              >
              <!-- reset button -->
              <VBtn color="grey" class="reset-btn" @click="LoginResetForm"
                >Reset</VBtn
              >
              <VBtn color="primary" class="ml-5" @click="jumpToSignupPage"
                >Go To Signup Page</VBtn
              >
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
  <!-- login dialogs ends -->

  <!-- SIGNUP dialog starts-->
  <VDialog
    v-model="signupModal"
    persistent
    scrollable="false"
    max-width="600px"
    height="640px"
    transition="dialog-bottom-transition"
  >
    <VCard class="login-card">
      <VBtn icon class="close-btn" elevation="0" @click="closeSignupModal">
        <VIcon>mdi-close</VIcon>
      </VBtn>
      <!-- heading -->
      <VCardTitle class="login-title">SIGNUP</VCardTitle>
      <VCardText>
        <VForm ref="refSignupForm" @submit.prevent="SignupSubmitForm">
          <VRow>
            <!-- First Name -->
            <VCol cols="12" sm="6">
              <VTextField
                v-model="signupFormData.first_name"
                :rules="[requiredValidator]"
                prepend-inner-icon="mdi mdi-account"
                label="First Name"
                type="text"
                placeholder="First Name"
                variant="outlined"
              ></VTextField>
            </VCol>
            <!-- Last Name -->
            <VCol cols="12" sm="6">
              <VTextField
                v-model="signupFormData.last_name"
                :rules="[requiredValidator]"
                prepend-inner-icon="mdi mdi-account"
                label="Last Name"
                type="text"
                placeholder="Last Name"
                variant="outlined"
              ></VTextField>
            </VCol>
            <!-- Email -->
            <VCol cols="12">
              <VTextField
                v-model="signupFormData.email"
                :rules="[emailValidator, requiredValidator]"
                prepend-inner-icon="mdi mdi-email-outline"
                label="Email"
                type="email"
                placeholder="Email"
                variant="outlined"
              ></VTextField>
            </VCol>
            <!-- Phone Number -->
            <VCol cols="12" sm="6">
              <VTextField
                v-model="signupFormData.phone"
                :rules="[requiredValidator]"
                prepend-inner-icon="mdi mdi-phone"
                label="Phone Number"
                type="number"
                placeholder="Phone Number"
                variant="outlined"
              ></VTextField>
            </VCol>
            <!-- Date of Birth (DOB) -->
            <VCol cols="12" sm="6">
              <VTextField
                v-model="signupFormData.dob"
                :rules="[requiredValidator]"
                prepend-inner-icon="mdi mdi-calendar"
                label="Date of Birth"
                type="date"
                placeholder="Date of Birth"
                variant="outlined"
              ></VTextField>
            </VCol>
            <!-- City -->
            <VCol cols="12">
              <VTextField
                v-model="signupFormData.city"
                :rules="[requiredValidator]"
                prepend-inner-icon="mdi mdi-city"
                label="City"
                type="text"
                placeholder="City"
                variant="outlined"
              ></VTextField>
            </VCol>
            <!-- Password -->
            <VCol cols="12">
              <VTextField
                v-model="signupFormData.password"
                :rules="[requiredValidator]"
                prepend-inner-icon="mdi mdi-lock"
                label="Password"
                type="password"
                placeholder="Password"
                variant="outlined"
              ></VTextField>
            </VCol>

            <!-- Confirmation Password -->
            <VCol cols="12">
              <VTextField
                v-model="signupFormData.password_confirmation"
                :rules="[requiredValidator]"
                prepend-inner-icon="mdi mdi-lock"
                label="Confirm Password"
                type="password"
                placeholder="Password"
                variant="outlined"
              ></VTextField>
            </VCol>
            <!-- Submit and Reset Buttons -->
            <VCol cols="12">
              <VBtn
                :disabled="!isSignupFormValid"
                color="primary"
                class="submit-btn"
                type="submit"
                >Submit</VBtn
              >
              <VBtn color="grey" class="reset-btn" @click="SignupResetForm"
                >Reset</VBtn
              >
              <VBtn color="primary" class="ml-5" @click="jumpToSignInPage"
                >Go To Sign In Page</VBtn
              >
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
  <!-- SIGNUP dialog ends -->
</template>

<!-- style -->
<style scoped>
/* Navbar styling with flex layout and space between items */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 1.25rem;
  background-color: #283046; /* Dark background */
  color: white; /* White text color */
}

/* Logo with a specific font size */
.logo span {
  font-size: 1.2rem;
}

/* Button links with margin and padding */
.links button {
  margin-left: 0.625rem;
  padding: 0.5rem 1rem;
  cursor: pointer; /* Changes cursor to pointer */
}

/* Close button positioned absolutely */
.close-btn {
  position: absolute;
  top: 0.625rem;
  right: 0.625rem;
}

/* Dialog content with max height and overflow control */
.VDialog__content {
  max-height: calc(100vh - 12.5rem);
  overflow-y: auto; /* Enables vertical scrolling */
}

/* Styling for the login card */
.login-card {
  border-radius: 0.5rem;
  box-shadow: 0 0.25rem 0.625rem rgba(0, 0, 0, 0.1);
}

/* Login title with a specific font size, weight, and alignment */
.login-title {
  font-size: 1.5rem; /* Remains in rem */
  font-weight: bold; /* Bold font weight */
  color: #333; /* Dark grey color */
  text-align: center; /* Center-align text */
  margin-top: 0.625rem;
}

/* Full-width text field */
.VTextField {
  width: 100%; /* Full width */
}

/* Styling for the submit button with transition and margin */
.submit-btn {
  transition: background-color 0.3s ease; /* Smooth background-color transition */
  margin-right: 0.625rem;
}

/* Hover effect for the submit button */
.submit-btn:hover {
  background-color: #45a049 !important; /* Changes color on hover */
}

/* Reset button with specific color */
.reset-btn {
  color: #757575; /* Grey color */
}
</style>

<!-- scripts starts -->
<script setup>
// toast message
const browseAction = () => {
  useNuxtApp().$toast.warning("Please Login to See More...");
};
</script>
<!-- scripts ends -->

<!-- template -->
<template>
  <div class="background-image-container">
    <VContainer fluid>
      <VRow class="align-center justify-center" dense>
        <!-- Text section -->
        <VCol cols="12" md="6" lg="6" class="text-wrapper">
          <!-- header -->
          <h1 class="heading">
            Find the Job of <br />
            Your <span class="highlight">DREAMS</span>
          </h1>
          <!-- description -->
          <p class="description">
            Find Your New Job Today! New Job Postings Every Day.<br />
            Just for you, browse the job you want and apply<br />
            wherever you want.
          </p>
          <!-- Call to Action Button -->
          <VBtn
            class="cta-btn"
            color="primary"
            large
            dark
            elevation="2"
            @click="browseAction"
          >
            Browse Jobs
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<!-- style scoped -->
<style scoped>
/* Container for the background image with a linear gradient overlay */
.background-image-container {
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("../assests/background.webp");
  background-size: cover;
  background-position: center;
  padding: 60px 20px;
  color: #333;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  height: 95vh;
}

/* Wrapper for text content, centered with padding */
.text-wrapper {
  text-align: center; /* Center-align the text */
  padding: 1.875rem;
}

/* Heading with large font size, bold weight, and specific line height */
.heading {
  font-size: 4rem;
  font-weight: 800; /* Bold font weight */
  line-height: 1.1; /* Line height slightly larger than font size */
}

/* Class to highlight text with a specific color */
.highlight {
  color: #ff4081; /* Pinkish color for highlights */
}

/* Description text with specific font size, color, and line height */
.description {
  font-size: 1.3rem;
  color: #454444; /* Dark grey color */
  line-height: 1.6; /* Line height to ensure readability */
  font-weight: 400; /* Normal font weight */
}

/* Container for Call-to-Action button with margin at the top */
.cta-btn {
  margin-top: 1.25rem;
}

/* Custom button styling with border-radius and uppercase text transformation */
.VBtn {
  border-radius: 1.5625rem;
  text-transform: uppercase; /* Force text to be uppercase */
}
</style>

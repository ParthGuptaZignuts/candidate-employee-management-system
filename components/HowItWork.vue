<!-- template -->
<template>
  <VRow class="align-items-center">
    <!-- left side div (Contains the descriptions) -->
    <VCol cols="12" sm="6" class="left-col">
      <div class="content">
        <!-- heading -->
        <p class="how-it-works">How It Works</p>
        <!-- title -->
        <h1 class="title">
          QUICK<span> STEPS </span>TO <br />
          GETTING A JOB
        </h1>
        <!-- description -->
        <p class="description">
          Follow the steps given in the timeline to get your DESIRED job.
        </p>
      </div>
    </VCol>

    <VCol cols="12" sm="6" >
      <VTimeline align="start" side="end">
        <!-- Timeline Item: Register -->
        <VTimelineItem dot-color="pink" size="small">
          <VRow align="center" class="timeline-row">
            <VCol cols="12" class="timeline-icon">
              <VIcon icon="mdi-cash-register"></VIcon>
            </VCol>
            <VCol cols="12">
              <strong>Register Yourself</strong>
              <div class="text-caption">
                "Join Us Today! Register to access personalized experiences."
              </div>
            </VCol>
          </VRow>
        </VTimelineItem>

        <!-- Timeline Item: Create Account -->
        <VTimelineItem dot-color="teal-lighten-3" size="small">
          <VRow align="center" class="timeline-row">
            <VCol cols="12" class="timeline-icon">
              <VIcon icon="mdi-account-box-plus-outline"></VIcon>
            </VCol>
            <VCol cols="12">
              <strong>Create an Account</strong>
              <div class="text-caption mb-2">
                "Unlock Exclusive Features! Create your account to start exploring."
              </div>
            </VCol>
          </VRow>
        </VTimelineItem>

        <!-- Timeline Item: Get Job Details -->
        <VTimelineItem dot-color="pink" size="small">
          <VRow align="center" class="timeline-row">
            <VCol cols="12" class="timeline-icon">
              <VIcon icon="mdi-email-outline"></VIcon>
            </VCol>
            <VCol cols="12">
              <strong>Get Job Details</strong>
              <div class="text-caption mb-2">
                "Discover Opportunities Tailored to Your Passion."
              </div>
            </VCol>
          </VRow>
        </VTimelineItem>

        <!-- Timeline Item: Apply -->
        <VTimelineItem dot-color="teal-lighten-3" size="small">
          <VRow align="center" class="timeline-row">
            <VCol cols="12" class="timeline-icon">
              <VIcon icon="mdi-phone-in-talk"></VIcon>
            </VCol>
            <VCol cols="12">
              <strong>Apply</strong>
              <div class="text-caption">
                "Join Our Team! Submit your application to be part of something amazing."
              </div>
            </VCol>
          </VRow>
        </VTimelineItem>
      </VTimeline>
    </VCol>
  </VRow>
</template>

<!-- style -->
<style scoped>
/* Styling for the left column */
.left-col {
  padding: 1.25rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Styling for the content section */
.content {
  text-align: center;
}

/* Styling for 'How It Works' text */
.how-it-works {
  font-size: 1.2rem;
  color: #666; /* Grey color */
  font-weight: 500; /* Medium font weight */
}

/* Styling for the main title */
.title {
  font-size: 2.5rem; /* Originally in em, kept same */
  font-weight: bold; /* Bold font weight */
}

/* Title span with special color */
.title span {
  color: #ff4081; /* Pinkish color */
}

/* Description styling with additional margin-top */
.description {
  font-size: 1rem; /* Originally in em, kept same */
  color: #888; /* Light grey color */
  margin-top: 0.625rem;
}

/* Flex layout for timeline row */
.timeline-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

/* Padding for timeline icon */
.timeline-icon {
  padding-right: 0.625rem; 
}

/* Caption text with smaller font size */
.text-caption {
  font-size: 0.8rem; 
  color: #666; /* Grey color */
}
</style>

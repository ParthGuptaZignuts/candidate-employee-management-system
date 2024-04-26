<template>
  <VRow class="align-items-center">
    <VCol cols="12" sm="6" class="left-col">
      <div class="content">
        <p class="how-it-works">How It Works</p>
        <h1 class="title">
          QUICK<span> STEPS </span>TO <br />
          GETTING A JOB
        </h1>
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

<style scoped>
.left-col {
  padding: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  text-align: center;
}

.how-it-works {
  font-size: 1.2em;
  color: #666;
  font-weight: 500;
}

.title {
  font-size: 2.5em;
  font-weight: bold;
}

.title span {
  color: #ff4081;
}

.description {
  font-size: 1em;
  color: #888;
  margin-top: 10px;
}

.timeline-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.timeline-icon {
  padding-right: 10px;
}

.text-caption {
  font-size: 0.8em;
  color: #666;
}
</style>

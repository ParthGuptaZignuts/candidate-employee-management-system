<template>
  <v-row class="align-items-center">
    <v-col cols="12" sm="6" class="left-col">
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
    </v-col>

    <v-col cols="12" sm="6" >
      <v-timeline align="start" side="end">
        <!-- Timeline Item: Register -->
        <v-timeline-item dot-color="pink" size="small">
          <v-row align="center" class="timeline-row">
            <v-col cols="12" class="timeline-icon">
              <v-icon icon="mdi-cash-register"></v-icon>
            </v-col>
            <v-col cols="12">
              <strong>Register Yourself</strong>
              <div class="text-caption">
                "Join Us Today! Register to access personalized experiences."
              </div>
            </v-col>
          </v-row>
        </v-timeline-item>

        <!-- Timeline Item: Create Account -->
        <v-timeline-item dot-color="teal-lighten-3" size="small">
          <v-row align="center" class="timeline-row">
            <v-col cols="12" class="timeline-icon">
              <v-icon icon="mdi-account-box-plus-outline"></v-icon>
            </v-col>
            <v-col cols="12">
              <strong>Create an Account</strong>
              <div class="text-caption mb-2">
                "Unlock Exclusive Features! Create your account to start exploring."
              </div>
            </v-col>
          </v-row>
        </v-timeline-item>

        <!-- Timeline Item: Get Job Details -->
        <v-timeline-item dot-color="pink" size="small">
          <v-row align="center" class="timeline-row">
            <v-col cols="12" class="timeline-icon">
              <v-icon icon="mdi-email-outline"></v-icon>
            </v-col>
            <v-col cols="12">
              <strong>Get Job Details</strong>
              <div class="text-caption mb-2">
                "Discover Opportunities Tailored to Your Passion."
              </div>
            </v-col>
          </v-row>
        </v-timeline-item>

        <!-- Timeline Item: Apply -->
        <v-timeline-item dot-color="teal-lighten-3" size="small">
          <v-row align="center" class="timeline-row">
            <v-col cols="12" class="timeline-icon">
              <v-icon icon="mdi-phone-in-talk"></v-icon>
            </v-col>
            <v-col cols="12">
              <strong>Apply</strong>
              <div class="text-caption">
                "Join Our Team! Submit your application to be part of something amazing."
              </div>
            </v-col>
          </v-row>
        </v-timeline-item>
      </v-timeline>
    </v-col>
  </v-row>
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

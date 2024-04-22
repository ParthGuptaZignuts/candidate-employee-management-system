<template>
  <v-row class="align-items-center">
    <v-col class="left-col" cols="12" sm="6">
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

    <v-col cols="12" sm="12" md="6" lg="6" xl="6">
      <v-timeline align-center>
        <!-- Use a class for consistent card dimensions -->
        <v-timeline-item dot-color="purple-lighten-2" fill-dot>
          <v-card class="timeline-card">
            <v-card-title class="bg-purple-lighten-2">
              <v-icon
                class="me-4"
                icon="mdi-cash-register"
                size="large"
              ></v-icon>
              <h2 class="font-weight-light">Register Yourself</h2>
            </v-card-title>
            <v-card-text>
              "Join Us Today! Register to access personalized experiences."
            </v-card-text>
          </v-card>
        </v-timeline-item>

        <v-timeline-item dot-color="amber-lighten-1" fill-dot>
          <v-card class="timeline-card">
            <v-card-title class="bg-amber-lighten-1">
              <h2 class="me-4 font-weight-light">Create an Account</h2>
              <v-icon
                icon="mdi-account-box-plus-outline"
                size="large"
              ></v-icon>
            </v-card-title>
            <v-card-text>
              "Unlock Exclusive Features! Create your account to start
              exploring."
            </v-card-text>
          </v-card>
        </v-timeline-item>

        <v-timeline-item dot-color="cyan-lighten-1" fill-dot>
          <v-card class="timeline-card">
            <v-card-title class="bg-cyan-lighten-1">
              <v-icon
                class="me-4"
                icon="mdi-email-outline"
                size="large"
              ></v-icon>
              <h2 class="font-weight-light">Desire Interest Job</h2>
            </v-card-title>
            <v-card-text>
              "Discover Opportunities Tailored to Your Passion."
            </v-card-text>
          </v-card>
        </v-timeline-item>

        <v-timeline-item dot-color="red-lighten-1" fill-dot>
          <v-card class="timeline-card">
            <v-card-title class="bg-red-lighten-1">
              <v-icon
                class="me-4"
                icon="mdi-notebook-heart-outline"
                size="large"
              ></v-icon>
              <h2 class="font-weight-light">Get Job Details</h2>
            </v-card-title>
            <v-card-text>
              "Discover the Role: Explore Job Requirements and Opportunities."
            </v-card-text>
          </v-card>
        </v-timeline-item>

        <v-timeline-item dot-color="green-lighten-1" fill-dot>
          <v-card class="timeline-card">
            <v-card-title class="bg-green-lighten-1">
              <v-icon
                class="me-4"
                icon="mdi-phone-in-talk"
                size="large"
              ></v-icon>
              <h2 class="font-weight-light">Apply</h2>
            </v-card-title>
            <v-card-text>
              "Join Our Team! Submit your application to be part of something amazing."
            </v-card-text>
          </v-card>
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

.v-timeline {
  padding: 10px;
}

.timeline-card {
  width: 400px; 
  height: 90px;
  text-align: center;
  margin: 10px auto;
}

.v-card-title {
  display: flex;
  justify-content: center; /* Center the title and icon */
  align-items: center;
}
</style>

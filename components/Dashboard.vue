<template>
    <div class="background-image-container">
      <v-container fluid>
        <v-row class="align-center justify-center" dense>
          <!-- Text section -->
          <v-col
            cols="12"
            md="6"
            lg="6"
            class="text-wrapper"
          >
            <h1 class="heading">
              Find the Job of <br />
              Your <span class="highlight">DREAMS</span>
            </h1>
            <p class="description">
              Find Your New Job Today! New Job Postings Every Day.<br />
              Just for you, browse the job you want and apply<br />
              wherever you want.
            </p>
            <!-- Call to Action Button -->
            <v-btn
              class="cta-btn"
              color="primary"
              large
              dark
              elevation="2"
            >
              Browse Jobs
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <style scoped>
  .background-image-container {
    background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url("../assests/background.webp");
    background-size: cover;
    background-position: center;
    padding: 60px 20px;
    color: #333;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    height: 95vh;
  }
  
  .text-wrapper {
    text-align: center;
    padding: 30px;
  }
  
  .heading {
    font-size: 4rem;
    font-weight: 800;
    line-height: 1.1;
  }
  
  .highlight {
    color: #ff4081;
  }
  
  .description {
    font-size: 1.3rem;
    color: #454444;
    line-height: 1.6;
    font-weight: 400;
  }
  
  .cta-btn {
    margin-top: 20px;
  }
  
  .v-btn {
    border-radius: 25px;
    text-transform: uppercase; 
  }
  </style>
  
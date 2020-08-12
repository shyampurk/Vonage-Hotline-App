# Vonage Hotline App

This is a web application demonstrating a hotline calling app using the Vonage CPaaS platform. It can initiate in-app calls from a Vonage virtual number to a set of predefined PSTN numbers. 

## Overview

The app is built on Angular and it leverages the Vonage Voice APIs. it supports a click to call feature for dialing PSTN numbers directly from the app.

To make use of this app, you must have

1. A Vonage account: You can sign up for a [free account](https://dashboard.nexmo.com/sign-up)

2. Vonage phone number: Once you log into your account you can purchase a virtual number.

3. Account balance: You must have some accoutn balance on your Vonage account. This is required for billing the calls

## Prerequisites

1. Node.js and npm : Install Node.js and NPM from the [official website](https://nodejs.org/en/).

2. Angular 8 : Install the Angular CLI from npm

          npm install -g @angular/cli
    
3. Ngrok:  Install Ngrok from the [official site](https://ngrok.com/).

4. Nexmo CLI: Install the Nexmo CLI

          npm install -g nexmo-cli@beta

5. Nexmo client : Install the Nexmo client SDK for voice calls

         npm install -g nexmo-client




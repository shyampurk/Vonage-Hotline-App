# Vonage Hotline App

This is a web application demonstrating a hotline calling app using the Vonage CPaaS platform. It can initiate in-app calls from a Vonage virtual number to a set of predefined PSTN numbers. 

## Overview

The app is built on Angular and it leverages the Vonage Voice APIs. it supports a click to call feature for dialing PSTN numbers directly from the app. it has a client and a server component. The client component is the Angular app. The server component is a local Node.js server used for hosting the event webhooks from the Vonage service. 

To make use of this app, you must have

1. A Vonage account: You can sign up for a [free account](https://dashboard.nexmo.com/sign-up)

2. Vonage phone number: Once you log into your account you can purchase a virtual number.

3. Account balance: You must have some accoutn balance on your Vonage account. This is required for billing the calls

## Prerequisites

1. Node.js and npm : Install Node.js and NPM from the [official website](https://nodejs.org/en/).

2. Angular 8 : Install the Angular CLI from npm

          npm install -g @angular/cli
    
3. Ngrok:  Install Ngrok from the [official site](https://ngrok.com/). You will be required to create a free account.

4. Nexmo CLI: Install the Nexmo CLI

          npm install -g nexmo-cli@beta

5. Nexmo client : Install the Nexmo client SDK for voice calls

         npm install -g nexmo-client


## Setup

Clone this repository and switch to the repository root folder.  

Open a terminal and follow the steps below to setup the app as per your Vonage account.

### Step 1: Initialize the Nexmo CLI with your Account credentials

          nexmo setup <YOUR_API_KEY> <YOUR_API_SECRET>
          
You can find the <YOUR_API_KEY> and <YOUR_API_SECRET> on the dashboard under "Getting Started". 
          
### Step 2: Install the client dependencies

Change to the client subdirectory and install the dependencies by running the npm command

          npm install

### Step 3: Install the client dependencies

Change to the server subdirectory and install the dependencies by running the npm command

          npm install

After the execution fo this command, switch bacl to the root directory. 

### Step 4: Run the Ngrok server

Open another terminal and run the Ngrok server to expose the localhost to the Internet.

          ./ngrok http 3000

Make sure that the ngrok binary is in the system path. In case of Windows you may have to use the complete binary file name as ngrok.exe.

Once running you will see session status with two forwarding addressess containning the ngrok.io domain name. This is the public ngrok URL assigned to you.

### Step 5: Create a new Vonage app

To use the hotline app, it has to be registed with a app instance under your Vonage account. Create a new app with the help of Nexmo CLI as follows

          nexmo app:create <APP_NAME> <NGROK_HTTP_URL>/webhooks/answer <NGROK_HTTP_URL>/webhooks/events --keyfile=private.key --type=voice

<APP_NAME> can be any name as long as it is unique within your Account.

<NGROK_HTTP_URL> is the public URL that was assigned by Ngrok in the previous step.

### Step 6: Assign the virtual numebr to app

To intiate a call from the hotline app, it has to be assiciated with a calling number. You can link the Vonage virtual number to your app as follows

          nexmo link:app <VIRTUAL_NUMBER> <APP_ID>

<VIRTUAL_NUMBER> is the VOnage virtual number that you purchased from with your accoutn dashboard. The number should be without the leading '+' character. 

<APP_ID> is the Application id the new app that you created in the last step. You can find the id on your dashboard under "Your Applications" menu. 




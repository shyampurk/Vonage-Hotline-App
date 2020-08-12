# Vonage Hotline App

This is a web application demonstrating a hotline calling app using the Vonage CPaaS platform. It can initiate in-app calls from a Vonage virtual number to a set of predefined PSTN numbers. 

## Overview

The app is built on Angular and it leverages the Vonage Voice APIs. it supports a click to call feature for dialing PSTN numbers directly from the app. it has a client and a server component. The client component is the Angular app. The server component is a local Node.js server used for hosting the event webhooks from the Vonage service. 

To make use of this app, you must have

1. A Vonage account: You can sign up for a [free account](https://dashboard.nexmo.com/sign-up)

2. Vonage phone number: Once you log into your account you can purchase a virtual number.

3. Account balance: You must have some account balance on your Vonage account. You can purchase credits from dashbaord under the "Billing & Payments" submenu. This is required for billing the calls. 

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

### Step 3: Install the server dependencies

Change to the server subdirectory and install the dependencies by running the npm command

          npm install

After the execution fo this command, switch bacl to the root directory. 

### Step 4: Run the Ngrok server (Separate terminal)

Open another terminal and run the Ngrok server to expose the localhost to the Internet.

          ./ngrok http 3000

Make sure that the ngrok binary is in the system path. In case of Windows, you may have to use the complete binary file name as ngrok.exe.

Once running, you will see session status with two forwarding addressess containning the ngrok.io domain name. This is the public ngrok URL assigned to you.

### Step 5: Create a new Vonage app

To use the hotline app, it has to be registed with a app instance under your Vonage account. Create a new app with the help of Nexmo CLI as follows

          nexmo app:create VonageHotlineApp <NGROK_HTTP_URL>/webhooks/answer <NGROK_HTTP_URL>/webhooks/events --keyfile=private.key --type=voice

          <NGROK_HTTP_URL> is the public URL that was assigned by Ngrok in the previous step.

This command also creates a private key for the application that is stored in the file private.key

### Step 6: Assign the virtual number to app

To intiate a call from the hotline app, it has to be associated with a calling number. You can link the Vonage virtual number to your app as follows

          nexmo link:app <VIRTUAL_NUMBER> <APP_ID>

          <VIRTUAL_NUMBER> is the VOnage virtual number that you purchased from with your accoutn dashboard. The number should be without the leading '+' character. 

          <APP_ID> is the Application id the VonageHotlineApp that you created in the last step. You can find the id on your dashboard under "Your Applications" menu. 

### Step 7: Create a user for the app

Create a new user "john". This is used to identify the calling user who owns the app and represents the caller.

          nexmo user:create name="john"
          
### Step 8: Create a JWT token for the user

The JWT token will be used for authenticating the user. 

You can create the token through this [web page](https://developer.nexmo.com/jwt). Open the page and enter the parameters in the left column as follows.

          - Private key : Content fo the private key file generated in step 5
          - Application ID : Application Id of the VonageHotline App
          - Valid For : This is the expiry time of the token. Leave it as default
          - Sub : This is the user "john" that you created in step 7. Enter the username without the quotes.
          - ACL - This is the access control list for the application to access Vonage APIs. Enter the following JSON object as the value
          
          {
            "paths": {
              "/*/users/**": {},
                "/*/conversations/**": {},
                "/*/sessions/**": {},
                "/*/devices/**": {},
                "/*/image/**": {},
                "/*/media/**": {},
                "/*/applications/**": {},
                "/*/push/**": {},
                "/*/knocking/**": {}
            }
          }

The generated JWT token will be displayed on the right column under the heading "Encoded". This token will be valid for 6 hours, after which you have to generate it again.

### Step 9: Create the environment file for server

Create a new file ".env" under the [server](/server) sub directory and add the contents as follows

                    PORT=3000
                    JWT_john=<JWT_TOKEN_JOHN>
                    NEXMO_NUMBER=<YOUR_VIRTUAL_NUMBER>
                    
                    <JWT_TOKEN_JOHN> is the JWT token generated in the last step.
                    <YOUR_VIRTUAL_NUMBER> is the virtual number without the leading '+' character.

### Step 10: Update the callee numbers

Open the [callee contact information file](client/src/app/contacts.json). 

You will see five predefined callee names and a defaul number placeholder "1234" assigned to each fo them. Replace the default number for Bob with your mobile numbers (without the '+' sign). This will be used to test the app to mobile call.   

## Run the app

### Step 1: Run the server

Open a new terminal and switch to the [server](/server) sub directory.

Run the server

          npm start
          
### Step 2: Run the client

Open a new terminal and switch to the [client](/client) sub directory.

Run the client 

          ng serve

This will compile the Angular application. It will take some time to compile and run a local server on http://localhost:4200.

### Step 3: Launch the app

*Note: This step requires the overriding of CORS handling at the browser side. On Chrome, you can use the "Moesif Orign & CORS Changer" extension and enable it while testing this app.*  

Open a browser and launch the app at http://localhost:4200.

Login as john and then you can see the hotline app UI with the buttons for initiatiing the direct calls with pre-defined callees. 

Click on the button representing "Bob" and you should see the button color change from red to amber and then to green as the call initialization proceeds. Wait for a few seconds and you should get a call on the phone number that you configured for Bob.



Pre-requisites
---------------
1. npm - npm.org
2. node.js - node.js 
3. Angular 8
4. ngrok  https://ngrok.com/ (free account available)


Prepare enviroment
-------------------

1> 	Install nexmo client beta
	npm install nexmo-cli@beta   
2>	clone the code and set up the environment 
	git clone <code  path>
	cd Vonage-Hotline-App/client/
	npm install
	cd Vonage-Hotline-App/server/
	npm install
3>	run ngrok on the port number where our server will run ( in our case port 3000)
	./ngrok http 3000
	Important: this creates a tunnel to our local server from outside world so that nexmo can call our local server while making and receiving calls.
	so make sure this is running before the application is run

Set up the nexmo app   		
-----------------------	
1>      Create App
	command: nexmo app:create <app name>   <call answer url>  < call events url>  --keyfile=private.key --type=voice 
 	nexmo app:create HotlineApp http://**************/webhooks/answer http://********.ngrok.io/webhooks/events --keyfile=private.key --type=voice

	Result: Below is the result giving app id, app config and key file ( all are important for further steps)
	Application created: f7c42f66-7f03-441b-b659-adcdcf991023
	No existing config found. Writing to new file.
	Credentials written to G:\*****\*******\Vonage-Hotline-App/.nexmo-app
	Private Key saved to: G:\*****\********\Vonage-Hotline-App/private.key

2>	Link a virtual number to app
	command: nexmo link:app <virtual number> <app id>
	nexmo link:app ********** f7c42f66-7f03-441b-b659-adcdcf991023	
	Result: 
	Number updated

3>	Create a user/s for the application
	command: nexmo user:create name="<user name>"
	nexmo user:create name="john"
	Result: If success will give user id, save it for future use
	User created: USR-cc674b95-0d44-4c49-ba55-928d7d216db1

4>	Create a JWT token for the user, this will be used for authentications
	command: nexmo jwt:generate <private key file path>/private.key sub=<user name> exp=<expiry date> acl='{"paths":{"/*/users/**":{},"/*/conversations/**":{},"/*/sessions/**":{},"/*/devices/**":{},"/*/image/**":{},"/*/media/**":{},"/*/applications/**":{},"/*/push/**":{},"/*/knocking/**":{}}}' application_id=<application id>
	nexmo jwt:generate ./private.key sub=john exp=$(($(date +%s)+86400)) acl='{"paths":{"/*/users/**":{},"/*/conversations/**":{},"/*/sessions/**":{},"/*/devices/**":{},"/*/image/**":{},"/*/media/**":{},"/*/applications/**":{},"/*/push/**":{},"/*/knocking/**":{}}}' application_id=f7c42f66-7f03-441b-b659-adcdcf991023 
	Result:  If success jwt will be generated 
	eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.************************************QtMTFlYS04MjhlLWE3NzlkYTE1ODk2NSIsInN1YiI6ImpvaG4iLCJleHAiOjE1OTY**************************cyI6eyIvKi91c2Vycy8qKiI6e30sIi8qL2NvbnZlcnNhdGlvbnMvKioiOnt9LCIvKi9zZXNzaW9ucy8qKiI6e30sIi8qL2RldmljZXMvKioiOnt9LCIvKi9pbWFnZS8qKiI6e30sIi8qL21lZGlhLyoqIjp7fSwiLyovYXBwbGljYXRpb25zLyoqIjp7fSwiLyovcHVzaC8qKiI6e30sIi8qL2tub2NraW5nLyoqIjp7fX19LCJhcHBsaWNhdGlvbl9pZCI6ImY3YzQyZjY2LTdmMDMtNDQxYi1iNjU5LWFkY2RjZjk5MTAyMyJ9.NVVocwNOs6K7BTzOhDCXytUn99Jm3ziUqLNCkVEUcn3YuNUKIO7WhfxvBOT5p6fAtoL4jof5VqPdsk8IOP_N1YjVBIYUoi77599GGO-EEqWY0cFXpmYyUA2fWLMra44Bnc82dp_6iSg5qJRtP3BGlOY5yTXGQ-UTkLtjybGA925vxQ7Pu095JaToDyg2F53JAvLHM5m-nqV2CvKN8ztUjUD8BB01DMDyMidkGfgHxrTeWtr0B88T9WqoTWXXtn_kVWUY3LCmWdwcDytG6B01ljW_DthtUqf2JSiILAOhmv8S_nNN6oZpd1n5nJ1mEltV_9oi3uCzs6ik832ZuViDCA

5> 	Create second user ( for in app call demos) and create jwt
	nexmo user:create name="Bob"
	User created: USR-101e0f42-b3bf-44a3-94bb-102c0cf10b8c
	nexmo jwt:generate ./private.key sub=Bob exp=$(($(date +%s)+86400)) acl='{"paths":{"/*/users/**":{},"/*/conversations/**":{},"/*/sessions/**":{},"/*/devices/**":{},"/*/image/**":{},"/*/media/**":{},"/*/applications/**":{},"/*/push/**":{},"/*/knocking/**":{}}}' application_id=f7c42f66-7f03-441b-b659-adcdcf991023 
	eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.****************************I6ImVkNWY1ZWEwLWQyNmQtMTFlYS05NzRjLTJmNjMwMjZkYTgyYiIsInN1YiI6IkJvYiIsImV4cCI6MTU5NjIw**********************GhzIjp7Ii8qL3VzZXJzLyoqIjp7fSwiLyovY29udmVyc2F0aW9ucy8qKiI6e30sIi8qL3Nlc3Npb25zLyoqIjp7fSwiLyovZGV2aWNlcy8qKiI6e30sIi8qL2ltYWdlLyoqIjp7fSwiLyovbWVkaWEvKioiOnt9LCIvKi9hcHBsaWNhdGlvbnMvKioiOnt9LCIvKi9wdXNoLyoqIjp7fSwiLyova25vY2tpbmcvKioiOnt9fX0sImFwcGxpY2F0aW9uX2lkIjoiZjdjNDJmNjYtN2YwMy00NDFiLWI2NTktYWRjZGNmOTkxMDIzIn0.XuqNiDa-UvdSdr9ypxXNFI3a9CW89eVbjZIRpuNrcqgQ3f-SqsvQJy6P_F_-dH7meBJW0juDRRBgwGKGER9o8XUmz6CXVF5JOcaZTbfiIywSfeCyGgT_Dhbklu_Cyi63ILP8y3i9bVLMvmpYwhr5GTko89bFQBbKlDUg5-8R1Kg1xRNT1NPoW272sbmbdbMwveqCgjzp8QZ3l_FaLRUT4OTJOJJChnp9ORBI48I5mVT95p7SdwG7jLLczvCvLwIA8wu7-4Qcvvu2tAHjHbDKeYfaKedt11sPgiDNGsOK8_bYNL8LP7_AloY4qN6uR5Ek02-9eaRsfReSp5fPp9OkHg

6>	Update the .env file at ./HotlineApp/server  with jwt and nexmo number as below
	PORT=3000
	JWT_john = eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.************************************QtMTFlYS04MjhlLWE3NzlkYTE1ODk2NSIsInN1YiI6ImpvaG4iLCJleHAiOjE1OTY**************************cyI6eyIvKi91c2Vycy8qKiI6e30sIi8qL2NvbnZlcnNhdGlvbnMvKioiOnt9LCIvKi9zZXNzaW9ucy8qKiI6e30sIi8qL2RldmljZXMvKioiOnt9LCIvKi9pbWFnZS8qKiI6e30sIi8qL21lZGlhLyoqIjp7fSwiLyovYXBwbGljYXRpb25zLyoqIjp7fSwiLyovcHVzaC8qKiI6e30sIi8qL2tub2NraW5nLyoqIjp7fX19LCJhcHBsaWNhdGlvbl9pZCI6ImY3YzQyZjY2LTdmMDMtNDQxYi1iNjU5LWFkY2RjZjk5MTAyMyJ9.NVVocwNOs6K7BTzOhDCXytUn99Jm3ziUqLNCkVEUcn3YuNUKIO7WhfxvBOT5p6fAtoL4jof5VqPdsk8IOP_N1YjVBIYUoi77599GGO-EEqWY0cFXpmYyUA2fWLMra44Bnc82dp_6iSg5qJRtP3BGlOY5yTXGQ-UTkLtjybGA925vxQ7Pu095JaToDyg2F53JAvLHM5m-nqV2CvKN8ztUjUD8BB01DMDyMidkGfgHxrTeWtr0B88T9WqoTWXXtn_kVWUY3LCmWdwcDytG6B01ljW_DthtUqf2JSiILAOhmv8S_nNN6oZpd1n5nJ1mEltV_9oi3uCzs6ik832ZuViDCA
	JWT_Bob = eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.****************************I6ImVkNWY1ZWEwLWQyNmQtMTFlYS05NzRjLTJmNjMwMjZkYTgyYiIsInN1YiI6IkJvYiIsImV4cCI6MTU5NjIw**********************GhzIjp7Ii8qL3VzZXJzLyoqIjp7fSwiLyovY29udmVyc2F0aW9ucy8qKiI6e30sIi8qL3Nlc3Npb25zLyoqIjp7fSwiLyovZGV2aWNlcy8qKiI6e30sIi8qL2ltYWdlLyoqIjp7fSwiLyovbWVkaWEvKioiOnt9LCIvKi9hcHBsaWNhdGlvbnMvKioiOnt9LCIvKi9wdXNoLyoqIjp7fSwiLyova25vY2tpbmcvKioiOnt9fX0sImFwcGxpY2F0aW9uX2lkIjoiZjdjNDJmNjYtN2YwMy00NDFiLWI2NTktYWRjZGNmOTkxMDIzIn0.XuqNiDa-UvdSdr9ypxXNFI3a9CW89eVbjZIRpuNrcqgQ3f-SqsvQJy6P_F_-dH7meBJW0juDRRBgwGKGER9o8XUmz6CXVF5JOcaZTbfiIywSfeCyGgT_Dhbklu_Cyi63ILP8y3i9bVLMvmpYwhr5GTko89bFQBbKlDUg5-8R1Kg1xRNT1NPoW272sbmbdbMwveqCgjzp8QZ3l_FaLRUT4OTJOJJChnp9ORBI48I5mVT95p7SdwG7jLLczvCvLwIA8wu7-4Qcvvu2tAHjHbDKeYfaKedt11sPgiDNGsOK8_bYNL8LP7_AloY4qN6uR5Ek02-9eaRsfReSp5fPp9OkHg
	NEXMO_NUMBER = < your nexmo virtual number>
	


Run the app
------------
1>	Run the server from ./Vonage-Hotline-App/server
	command:
	npm start
	result:
	> client-sdk-hotline-app-server@1.0.0 start G:\******\********\Vonage-Hotline-App\server
	> nodemon server.js

	[nodemon] 1.19.3
	[nodemon] to restart at any time, enter `rs`
	[nodemon] watching dir(s): *.*
	[nodemon] watching extensions: js,mjs,json
	[nodemon] starting `node server.js`

2>	Run the client from ./Vonage-Hotline-App/client
	command:
	ng serve
	result:
	$ ng serve
	10% building 3/3 modules 0 activei ｢wds｣: Project is running at http://localhost:4200/webpack-dev-server/
	i ｢wds｣: webpack output is served from /
	i ｢wds｣: 404s will fallback to //index.html

	chunk {main} main.js, main.js.map (main) 44 kB [initial] [rendered]
	chunk {polyfills} polyfills.js, polyfills.js.map (polyfills) 269 kB [initial] [rendered]
	chunk {runtime} runtime.js, runtime.js.map (runtime) 6.15 kB [entry] [rendered]
	chunk {scripts} scripts.js, scripts.js.map (scripts) 728 kB [entry] [rendered]
	chunk {styles} styles.js, styles.js.map (styles) 974 kB [initial] [rendered]
	chunk {vendor} vendor.js, vendor.js.map (vendor) 4.35 MB [initial] [rendered]
	Date: 2020-07-30T17:33:22.078Z - Hash: 8f7b50f491b780803df6 - Time: 12393ms
	** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
	i ｢wdm｣: Compiled successfully.
	i ｢wdm｣: Compiling...
	
Reference Links 
-------------------
https://developer.nexmo.com/sdk/stitch/javascript/index
https://developer.nexmo.com/voice/voice-api/overview
https://developer.nexmo.com/voice/voice-api/overview#getting-started
https://developer.nexmo.com/concepts/guides/authentication
https://developer.nexmo.com/use-cases/client-sdk-click-to-call
https://developer.nexmo.com/use-cases/contact-center-client-sdk
https://www.nexmo.com/blog/2017/07/04/local-development-nexmo-ngrok-tunnel-dr

	
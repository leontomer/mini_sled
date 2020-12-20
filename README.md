# mini sled exercise

## instructions

1. run npm i both in some-project dir and remote-machine dir
2. in remote-machine dir, run the command: docker build -t "docker-name" .
3. in remote-machine dir, run the command: docker run -it -p 80:80 -p 9229:9229 docker-name
4. in some-project dir, you can now run the tests in the remote machine and get back the results by running "npm run test" to run all the tests or "npm run test one.spec.js two.spec.js ........etc" to run some specific tests.
5. in some-project dir, you can also debug some specific test file by running the command: "npm run test testname DEBUG=true", where testname is one.spec.js or two.spec.js etc... .<br />
   5.1. now a chrome tab will open for you. you need to enter in the url "chrome://inspect/#devices". than go to configure and add the adrress: 127.0.0.1:9229 (or whatever your docker address is, with the 9229 port)<br />
   5.2. refresh the page. and you should see the test you want to debug. click on Open dedicated DevTools for Node and now you can debug your test.

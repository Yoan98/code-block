### Examples files


## docker-compose
There are some .yml files,they can help you build local web,like gitlab,jenkins...
## shell
-  DevOps.sh 

    The script that check your current container whether it's running , then stop container which you choose if that running.
## docker
-  Dockerfile

    A example Dockerfile in here that apply to vue on nginx.
-  .dockerignore
    
    It will exclude some files that is used to Dockerfile in "COPY".
## axios
-  axios.js

    There is a class of  **HttpRequest**  that is based on axios with interceptor, you can do anything when send a request or get a respose before.
- errorHandle.js
    
    In errorHandle.js, you can add some triggered function when some erros happended.
- request.js
    
    In request.js, there is a entry file,you can use HttpRequest class from axios.js and then export instance of that,but you should make a base config(serch on axios official) before.
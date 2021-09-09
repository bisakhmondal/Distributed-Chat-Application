# Multiclient Distributed real-time room based chat application. Supports unicast, multicast & broadcast.

The backend is distributed & horizontally scalable. Technology used in backend Socket.io, redis(cache & pub/sub to maintain consistency among different servers), haproxy (for loadbalancer), mongodb(for persistence).

## Setup


### Running backend
As the architecture itself depends some components for eg. `redis`, `mongodb`, `haproxy`, so for each of use I have provided a [docker-compose.yml](./backend/docker-compose.yml) file in the backend. It will pull respective containers, build the local backend application and run them by openning respective ports.
```shell
# go to backend 
$ cd backend

# build the chatapp image
$ docker build -t chatapp .

$ docker-compose up # pass -d for detached mode

# to stop the services
$ docker-compose down
```

### Running frontend application
The main [app.js](./frontend/src/App.js) contains all the business logic for websocket establishment and respective api calls.
First run the backend services and the proceed to frontend server.
```shell
# for dev server run
$ npm start
# else build the assets and serve it through gserve
$ npm run build && serve ./build
```

## Architecture

![image](https://user-images.githubusercontent.com/41498427/115279105-e6be5680-a163-11eb-9c29-cc7e4738eab0.png)


Thanks,

Bisakh

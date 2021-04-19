## Multiclient room based chat application. Supports unicast, multicast & broadcast.

The backend is distributed & horizontally scalable. Technology used in backend Socket.io, redis(cache & pub/sub to maintain consistency among different servers), haproxy (for loadbalancer), mongodb(for persistence).

### Architecture

![image](https://user-images.githubusercontent.com/41498427/115279105-e6be5680-a163-11eb-9c29-cc7e4738eab0.png)

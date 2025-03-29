This is a simple ui and backend for testing behavior of different http versions.
It sends a stream of random data to the client for given number of requests (and iterations if you want).


## Run

```shell
npm install 
npm run dev # for running in dev mode (hot reloading)
# or
npm run start # for running in build mode
```

## Test
Go to your web browser http://localhost:18443, and open devtools network tab.
Set the throttling to the lowest profile (like 3g).
Ensure, that you see columns: `Size`, `Connection ID` and `Waterfall` (or equivalents).

Click on `http 1.1` and observe results. Then do the same for the `http 2` button.


## Extra
Moreover, one can also simulate unstable network conditions using `tc` inside a docker container:
```shell
docker build -t network-simulator .
docker run -it --privileged -p 18443:18443 -p 28443:28443 network-simulator
```
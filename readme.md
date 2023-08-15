This is a simple ui and backend for testing behavior of different http versions in unstable network conditions (using `tc`)

`docker build -t network-simulator .`
`docker run -it --privileged -p 18443:18443 -p 28443:28443 network-simulator`

for playing without `tc` one can use `npm install && npm run dev`

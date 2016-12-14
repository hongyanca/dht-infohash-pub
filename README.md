# dht-infohash-pub

### Crawl the [DHT network](http://www.bittorrent.org/beps/bep_0005.html) for resource infohashes and publish them using [ØMQ](http://zeromq.org/)

This program wraps [dht-infohash-crawler](https://github.com/homeryan/dht-infohash-crawler) in a Node.js command line executive.    

## Features

- Option to create multiple DHT crawler instances 
- Find peers from the DHT network

## Requirement
Install [ØMQ](http://zeromq.org/intro:get-the-software) for your platform. And then install [ØMQ bindings](https://github.com/JustinTulloss/zeromq.node) for Node.js.  
```
npm install zmq
```
If Node.js is upgraded or downgraded after `npm install zmq`, please run `npm rebuild` to rebuild ØMQ bindings.

If you experience binding problems like `Error: Could not locate the bindings file.`, please change to dht-infohash-pub's directory and run `npm rebuild` to rebuild ØMQ bindings. 
## Install

```
npm install dht-infohash-pub
```

Usage:
```
node dht-infohash-pub.js [options]

  Options:

    -h, --help          output usage information
    -V, --version       output the version number
    -q, --quiet         Do not log infohashes to the console
    -n, --number <n>    Number of crawler instance, default = 2
    -a, --dhtaddr <da>  DHT network listening address, default = 0.0.0.0
    -p, --dhtport <dp>  DHT network listening port, default = 6881
    -k, --kbucket <k>   DHT k-bucket size, default = 128
    --zmqaddr <za>      ØMQ publishing address, default = 0.0.0.0
    --zmqport <zp>      ØMQ publishing port, default = 65534
```
Subscribe to the ØMQ publisher:
```js
const zmq = require('zmq');
const sub = zmq.socket('sub');

sub.on('message', function (...args) {
  console.log(`${args.reduce((prev, curr) => prev+curr)}`);
});
sub.connect('tcp://PUBLISHER_IP_ADDRESS:PUBLISHER_PORT');
sub.subscribe('');
```
Subscribe to the ØMQ publisher, use subscriber side filter:
```js
const zmq = require('zmq');
const sub = zmq.socket('sub');

sub.on('message', function (...args) {
  console.log(`${args.reduce((prev, curr) => prev+curr)}`);
});
sub.connect('tcp://PUBLISHER_IP_ADDRESS:PUBLISHER_PORT');
// Only subscribe to infohashes starting from '89abcdef'
['8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
  .map(letter => sub.subscribe(letter));
```
## License

MIT © [Hong Yan](https://github.com/homeryan).
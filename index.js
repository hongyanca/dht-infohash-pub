const zmq = require('zmq');
const publisher = zmq.socket('pub');
const sub = zmq.socket('sub');
const createCrawler = require('dht-infohash-crawler');
const BASE_PORT = 6881;
const KBUCKET_SIZE = 128;
const DEFAULT_QUEUE_SIZE = 1024;
const PUBLISHER_BIND = 'tcp://0.0.0.0:65534';

publisher.bindSync(PUBLISHER_BIND);

startCrawl(2);

function startCrawl(numOfCrawlers) {
  const recentInfohashes = createInfohashQueue();
  const noc = numOfCrawlers >= 5 ? 5 : numOfCrawlers;
  const crawlers = [];
  for (let index = 0; index < noc; ++index) {
    let crawler = createCrawler({
      address: '0.0.0.0',
      port: BASE_PORT + index,
      kbucketSize: KBUCKET_SIZE,
      name: `crawler-${index+1}`});

    crawler.on('infohash', (infohash, peerId, peerAddress) => {
      if (!recentInfohashes.enqueue(infohash)) return;
      console.log(infohash);
      publisher.send([infohash, ' ', addressObjToString(peerAddress)]);
    });

    crawlers.push(crawler);
  }
}

const addressObjToString = address => `${address.address}:${address.port+''}`;

class InfohashQueue {
  constructor(capacity = DEFAULT_QUEUE_SIZE) {
    this.infohashes = [];
    this.capacity = capacity;
  }

  enqueue (infohashString) {
    if (this.infohashes.includes(infohashString)) return false;
    if (this.infohashes.length >= this.capacity) this.infohashes.shift();
    this.infohashes.push(infohashString);
    return true;
  }
}

const createInfohashQueue = function (capacity) { return new InfohashQueue(capacity); };
import Redis, { Cluster } from 'ioredis';

export interface RedisClient {
  clients: Map<string, Cluster | Redis>;
  size: number;
}

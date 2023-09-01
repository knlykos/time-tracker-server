import { Inject, Injectable } from '@nestjs/common';
import { auth, Client, ClientOptions } from 'cassandra-driver';
import PlainTextAuthProvider = auth.PlainTextAuthProvider;
import { PlantATreeDbConfigOptions } from '@plant43db/plant-a-tree-db/plant-a-tree-db-config-options';
// const client = new cassandra.Client({
//     contactPoints: ['127.0.0.1'],
//     localDataCenter: 'datacenter1',
//     keyspace: 'procare_photos',
//     authProvider: new PainTextAuthProvider('cassandra', 'cassandra')
// });
@Injectable()
export class PlantATreeDbService {
  private client: Client;

  public getConnection(options: PlantATreeDbConfigOptions): Client {
    this.client = new Client(options);
    return this.client;
  }
}

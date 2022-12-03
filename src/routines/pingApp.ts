import { Agenda } from 'agenda/es';
import { Db } from 'mongodb';
import { MongoClient } from "mongodb";
import axios from 'axios';

export class KeepAliveScheduler {
  agenda: Agenda;
  constructor(private db: Db, client: MongoClient) {
    this.agenda = new Agenda({ mongo: client.db("agenda") });
  }

  async start() {
    this.agenda.define('ping app', async (job) => {
      axios.get('https://bandwikibot.herokuapp.com/')
      .then(function (response) {
        // handle success
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    });

    (async () => {
      // IIFE to give access to async/await
      await this.agenda.start();

      await this.agenda.every('29 minutes', 'ping app');
    })();
  }

  async stop() {
    const numRemoved = await this.agenda.cancel({ name: 'ping app' });
  }
}

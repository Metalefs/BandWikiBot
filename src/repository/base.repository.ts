import { Db, ObjectId } from 'mongodb';
import autoIncrement = require("mongo-autoincrement")

export class BaseRepository {
  constructor(protected dbconnection: Db, protected collection) {}

  insert =async (item, increment = true) => {
    if(increment){
      const id = await autoIncrement(this.dbconnection, this.collection, 'id')
      item.id = id;
    }
    const result = await this.dbconnection.collection(this.collection).insertOne(item);
    return result;
  };

  list = async () => {
    return this.dbconnection.collection(this.collection).find().toArray();
  };

  sort = async (sort?) => {
    return this.dbconnection.collection(this.collection).find().sort(sort).toArray();
  };

  find = async (filter) => {
    return this.dbconnection.collection(this.collection).find(filter).toArray();
  };

  findOne = async (filter) => {
    return this.dbconnection.collection(this.collection).findOne(filter);
  };

  findById = async (id) => {
    return this.dbconnection
      .collection(this.collection)
      .findOne({ _id: new ObjectId(id) });
  };

  getByName = async (name) => {
    return this.dbconnection.collection(this.collection).findOne({ name: name });
  };

  emptyCollection = async () => {
    return this.dbconnection.collection(this.collection).deleteMany((x) => x);
  };

  removeByFilter = async (filter) => {
    const result = await this.dbconnection
      .collection(this.collection)
      .deleteOne(filter);
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.", filter);
    } else {
      console.log("No documents matched the query. Deleted 0 documents.", {
        filter,
      });
    }
  };

  removeByName = async (name) => {
    const result = await this.removeByFilter({ name: name });
    return result;
  }

  update = async (filter, fields) => {
    const options = { upsert: true };

    const updateDoc = {
      $set: fields,
    };

    const result = await this.dbconnection
      .collection(this.collection)
      .updateOne(filter, updateDoc, options);

    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    );
  };
}

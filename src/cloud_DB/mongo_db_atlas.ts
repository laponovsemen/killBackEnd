import { Collection, Db, MongoClient } from "mongodb";
import { SETTINGS } from "../settings";
import {
  BlogDBType,
  CommentDBType,
  PostDBType,
  UserDBType,
} from "./mongo_db_types";

let client: MongoClient = {} as MongoClient;
export let db: Db = {} as Db;
export let blogsCollection: Collection<BlogDBType> =
  {} as Collection<BlogDBType>;
export let postsCollection: Collection<PostDBType> =
  {} as Collection<PostDBType>;
export let usersCollection: Collection<UserDBType> =
  {} as Collection<UserDBType>;
export let commentsCollection: Collection<CommentDBType> =
  {} as Collection<CommentDBType>;

export const ConnectMongoDB = async () => {
  try {
    client = new MongoClient(SETTINGS.MONGO_DB_ATLAS);
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    db = client.db(SETTINGS.DB_NAME);

    blogsCollection = db.collection(SETTINGS.BLOGS_COLLECTION);
    postsCollection = db.collection(SETTINGS.POSTS_COLLECTION);
    usersCollection = db.collection(SETTINGS.USERS_COLLECTION);
    commentsCollection = db.collection(SETTINGS.COMMENTS_COLLECTION);

    return true;
  } catch (error) {
    console.log(error);
    await client.close();
    return false;
  }
};

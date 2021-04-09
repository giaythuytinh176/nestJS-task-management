import { User } from '../auth/user.entity';
import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
  } from 'typeorm';
  
  @EventSubscriber()
  export class UserSubscriber implements EntitySubscriberInterface<User> {
    constructor(connection: Connection) {
      connection.subscribers.push(this);
    }
  
    listenTo() {
      return User;
    }
  
    beforeInsert(event: InsertEvent<User>) {
      console.log(`BEFORE USER INSERTED: `, event.entity);
    }
  }
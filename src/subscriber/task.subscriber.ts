import { Task } from "../tasks/task.entity";
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from "typeorm";
import { TransactionCommitEvent } from "typeorm/subscriber/event/TransactionCommitEvent";
import { TransactionRollbackEvent } from "typeorm/subscriber/event/TransactionRollbackEvent";
import { TransactionStartEvent } from "typeorm/subscriber/event/TransactionStartEvent";

@EventSubscriber()
export class TaskSubscriber implements EntitySubscriberInterface {
    constructor(connection: Connection) {
        connection.subscribers.push(this);
      }

    /**
     * Indicates that this subscriber only listen to TASK events.
     */
    listenTo() {
        return Task;
    }

    beforeInsert(event: InsertEvent<Task>) {
        console.log(`BEFORE TASK INSERTED: `, event.entity);
    }

    // /**
    //  * Called after entity is loaded.
    //  */
    // afterLoad(entity: any) {
    //     console.log(`AFTER ENTITY LOADED: `, entity);
    // }

    // /**
    //  * Called before TASK insertion.
    //  */
    // beforeInsert(event: InsertEvent<any>) {
    //     console.log(`BEFORE TASK INSERTED: `, event.entity);
    // }

    // /**
    //  * Called after entity insertion.
    //  */
    // afterInsert(event: InsertEvent<any>) {
    //     console.log(`AFTER ENTITY INSERTED: `, event.entity);
    // }

    // /**
    //  * Called before entity update.
    //  */
    // beforeUpdate(event: UpdateEvent<any>) {
    //     console.log(`BEFORE ENTITY UPDATED: `, event.entity);
    // }

    // /**
    //  * Called after entity update.
    //  */
    // afterUpdate(event: UpdateEvent<any>) {
    //     console.log(`AFTER ENTITY UPDATED: `, event.entity);
    // }

    // /**
    //  * Called before entity removal.
    //  */
    // beforeRemove(event: RemoveEvent<any>) {
    //     console.log(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity);
    // }

    // /**
    //  * Called after entity removal.
    //  */
    // afterRemove(event: RemoveEvent<any>) {
    //     console.log(`AFTER ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity);
    // }

    // /**
    //  * Called before transaction start.
    //  */
    // beforeTransactionStart(event: TransactionStartEvent) {
    //     console.log(`BEFORE TRANSACTION STARTED: `, event);
    // }

    // /**
    //  * Called after transaction start.
    //  */
    // afterTransactionStart(event: TransactionStartEvent) {
    //     console.log(`AFTER TRANSACTION STARTED: `, event);
    // }

    // /**
    //  * Called before transaction commit.
    //  */
    // beforeTransactionCommit(event: TransactionCommitEvent) {
    //     console.log(`BEFORE TRANSACTION COMMITTED: `, event);
    // }

    // /**
    //  * Called after transaction commit.
    //  */
    // afterTransactionCommit(event: TransactionCommitEvent) {
    //     console.log(`AFTER TRANSACTION COMMITTED: `, event);
    // }

    // /**
    //  * Called before transaction rollback.
    //  */
    // beforeTransactionRollback(event: TransactionRollbackEvent) {
    //     console.log(`BEFORE TRANSACTION ROLLBACK: `, event);
    // }

    // /**
    //  * Called after transaction rollback.
    //  */
    // afterTransactionRollback(event: TransactionRollbackEvent) {
    //     console.log(`AFTER TRANSACTION ROLLBACK: `, event);
    // }

}

// @EventSubscriber()
// export class TaskSubscriber implements EntitySubscriberInterface<Task> {
//     constructor(connection: Connection) {
//         connection.subscribers.push(this);
//       }
//     /**
//      * Indicates that this subscriber only listen to TASK events.
//      */
//     listenTo() {
//         return Task;
//     }

//     /**
//      * Called before TASK insertion.
//      */
//     beforeInsert(event: InsertEvent<Task>) {
//         console.log(`BEFORE TASK INSERTED: `, event.entity);
//     }

// }

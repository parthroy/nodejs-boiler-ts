import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    Index,
} from 'sequelize-typescript';
import { dbName } from '../../utils/sql';

@Table({
    paranoid: true,
    tableName: dbName('call_events'),  // Name of the table in the database
    timestamps: true,  // Adds `createdAt` and `updatedAt` fields automatically
})
export default class CallEvent extends Model<CallEvent> {

    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    id!: number;  // Auto-incrementing primary key

    @AllowNull(false)
    @Column({
        type: DataType.UUID,
    })
    @Index  // Indexed column for faster searches
    callId!: string;  // UUID for CallId (indexed, but no foreign key)

    @AllowNull(false)
    @Column({
        type: DataType.ENUM('End', 'Transfer'),  // The event types
    })
    eventType!: 'End' | 'Transfer';  // Event type (End or Transfer)

    @AllowNull(true)
    @Column({
        type: DataType.JSON,
    })
    meta!: {
        outboundCallId?: string;  // Outbound Call ID
        sipTrunkName?: string;  // SIP Trunk Name
        sipTrunkType?: string;  // SIP Trunk Type
        realAgentNumber?: string;  // Real agent number in E.164 format
    };  // Meta field storing additional event information in JSON format
}

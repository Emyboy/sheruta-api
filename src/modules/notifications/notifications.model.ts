import { NotificationTypes } from '@/config';
import { model, Schema, Document, SchemaDefinitionProperty } from 'mongoose';

export interface Notifications {
    _id: string;

    trigger_type: SchemaDefinitionProperty<NotificationTypes>
    seen: boolean;

    user: SchemaDefinitionProperty<string>;
    flat_share_profile: SchemaDefinitionProperty<string>;
    user_settings: SchemaDefinitionProperty<string>;
}

const notificationsSchema: Schema = new Schema<Notifications>(
    {
        trigger_type: {
            type: NotificationTypes,
            enum: NotificationTypes,
            default: NotificationTypes.DEFAULT
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },

    },
    {
        timestamps: true,
    },
);

const notificationsModel = model<Notifications & Document>('Notifications', notificationsSchema);

export default notificationsModel;

import { model, Schema, Document, SchemaDefinitionProperty } from 'mongoose';

export interface UserSettings {
    _id: string;

    receive_marketing_updates: boolean;
    receive_platform_updates: boolean;

    user_info: SchemaDefinitionProperty<string>;
    user: SchemaDefinitionProperty<string>;
}

const userSettingsSchema: Schema = new Schema<UserSettings>(
    {
        receive_marketing_updates: {
            type: Boolean,
            default: true
        },
        receive_platform_updates: {
            type: Boolean,
            default: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
        user_info: {
            type: Schema.Types.ObjectId,
            ref: 'UserInfos',
            required: true,
        },

    },
    {
        timestamps: true,
    },
);

const userSettingModel = model<UserSettings & Document>('UserSettings', userSettingsSchema);

export default userSettingModel;

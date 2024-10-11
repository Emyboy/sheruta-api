import { model, Schema, Document, SchemaDefinitionProperty } from 'mongoose';

export interface UserSettings {
    _id: string;

    receive_marketing_updates: boolean;
    receive_platform_updates: boolean;
    hide_profile: boolean;
    hide_phone_number: boolean;

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
        hide_profile: {
            type: Boolean,
            default: false
        },
        hide_phone_number: {
            type: Boolean,
            default: false
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

const userSettingModel = model<UserSettings & Document>('UserSettings', userSettingsSchema);

export default userSettingModel;

import { model, Schema, Document, SchemaDefinitionProperty } from 'mongoose';

export interface UserSettings {
    _id: string;

    news_letter_updates: boolean;
    flat_share_updates: boolean;

    hide_profile: boolean;
    hide_phone_number: boolean;

    user: SchemaDefinitionProperty<string>;
}

const userSettingsSchema: Schema = new Schema<UserSettings>(
    {
        news_letter_updates: {
            type: Boolean,
            default: true
        },
        flat_share_updates: {
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

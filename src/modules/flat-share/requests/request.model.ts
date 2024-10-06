import { model, Schema, Document, SchemaDefinitionProperty } from 'mongoose';

export interface Requests {
    _id: string;
    description: string;
    bathrooms: number;
    budget: number;
    house_rules: string[];
    living_rooms: number;
    availability_status: 'available' | 'unavailable';
    seeking: boolean;
    service_charge: number;
    image_urls: string[];
    toilets: number;
    user: SchemaDefinitionProperty<string>;
    user_info: SchemaDefinitionProperty<string>;
    user_setting: SchemaDefinitionProperty<string>;
    flat_share_profile: SchemaDefinitionProperty<string>;
    service: SchemaDefinitionProperty<string>;
    location: SchemaDefinitionProperty<string>;
}

const requestsSchema: Schema = new Schema<Requests>(
    {
        description: {
            type: String,
            required: true,
            minlength: 10,
            maxlength: 500,
            trim: true,
        },
        bathrooms: {
            type: Number,
            required: true,
            min: 1,
        },
        budget: {
            type: Number,
            required: true,
            min: 0,
        },
        house_rules: {
            type: [String],
            required: true,
            validate: {
                validator: (arr: string[]) => arr.length > 0,
                message: 'House rules must have at least one rule',
            },
        },
        living_rooms: {
            type: Number,
            required: true,
            min: 1,
        },
        seeking: {
            type: Boolean,
            default: true,
        },
        service_charge: {
            type: Number,
            required: true,
            min: 0,
        },
        image_urls: {
            type: [String],
            validate: {
                validator: (arr: string[]) => arr.every(url => /^https?:\/\/.+\..+/i.test(url)),
                message: 'Each image URL must be a valid URL',
            },
        },
        toilets: {
            type: Number,
            required: true,
            min: 1,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
        service: {
            type: Schema.Types.ObjectId,
            ref: 'Services',
            required: true,
        },
        location: {
            type: Schema.Types.ObjectId,
            ref: 'Locations',
            required: true,
        },
        flat_share_profile: {
            type: Schema.Types.ObjectId,
            ref: 'FlatShareProfiles',
            required: true,
        },
        user_info: {
            type: Schema.Types.ObjectId,
            ref: 'UserInfos',
            required: true,
        },
        user_setting: {
            type: Schema.Types.ObjectId,
            ref: 'UserSettings',
            required: true,
        },
        availability_status: {
            type: String,
            enum: ['available', 'unavailable'],
            default: 'available'
        }
    },
    {
        timestamps: true,
    },
);

const requestsModel = model<Requests & Document>('Requests', requestsSchema);

export default requestsModel;

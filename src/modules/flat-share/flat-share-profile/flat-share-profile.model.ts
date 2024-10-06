import { model, Schema, Document, SchemaDefinitionProperty } from 'mongoose';

export interface FlatShareProfile {
    _id: string;
 
    user_info: SchemaDefinitionProperty<string>;
    user: SchemaDefinitionProperty<string>;
}

const flatShareProfileSchema: Schema = new Schema<FlatShareProfile>(
    {
        
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

const flatShareModel = model<FlatShareProfile & Document>('FlatShareProfiles', flatShareProfileSchema);

export default flatShareModel;

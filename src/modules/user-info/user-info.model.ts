import { model, Schema, Document, SchemaDefinitionProperty } from 'mongoose';

export interface UserInfo {
    _id: string;

    user: SchemaDefinitionProperty<string>;
}

const userInfoSchema: Schema = new Schema<UserInfo>(
    {

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

const userInfoModel = model<UserInfo & Document>('UserInfos', userInfoSchema);

export default userInfoModel;

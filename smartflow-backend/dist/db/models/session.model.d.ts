import mongoose from "mongoose";
export declare const session: mongoose.Model<{
    accessToken?: string | null;
    refreshToken?: string | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    accessToken?: string | null;
    refreshToken?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    accessToken?: string | null;
    refreshToken?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    accessToken?: string | null;
    refreshToken?: string | null;
}, mongoose.Document<unknown, {}, {
    accessToken?: string | null;
    refreshToken?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    accessToken?: string | null;
    refreshToken?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    accessToken?: string | null;
    refreshToken?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    accessToken?: string | null;
    refreshToken?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=session.model.d.ts.map
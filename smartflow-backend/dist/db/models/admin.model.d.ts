import mongoose from "mongoose";
export declare const admin: mongoose.Model<{
    email: string;
    password: string;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    email: string;
    password: string;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    email: string;
    password: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    email: string;
    password: string;
}, mongoose.Document<unknown, {}, {
    email: string;
    password: string;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    email: string;
    password: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    email: string;
    password: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    email: string;
    password: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=admin.model.d.ts.map
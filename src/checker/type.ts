import { AbnormalType } from "../abnormal/types";
import { Primitive } from "../types";

type PrimitiveWorkTreeParam = {
    node: AbnormalType | Primitive;
    pathStack: (string | number)[];
    key: string | number;
};

type ObjectWorkTreeParam = {
    node: Record<string, any> | any[]; // 物件或陣列
    pathStack: (string | number)[];
    key: string | number;
    recurse: () => void
};

export type WalkTreeHandler = {
    handleArray: (param: ObjectWorkTreeParam) => void;
    handleObject: (param: ObjectWorkTreeParam) => void;
    handlePrimitive: (param: PrimitiveWorkTreeParam) => void;
}


export type CheckPrimitiveKeyPresenceParams = {
    source: Record<string, unknown>;
    target: Record<string, unknown>;
    pathStack: (string | number)[];
    key: string | number;
    abnormalKeys: Record<string, any>;
};
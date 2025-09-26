import { AbnormalType } from "../abnormal/types";
import { Primitive } from "../types";

type PrimitiveWorkTreeParam = {
    node: AbnormalType | Primitive;
    pathStack: (string | number)[];
    indexStack: number[];
};

type ObjectWorkTreeParam = {
    node: Record<string, any> | any[]; // 物件或陣列
    pathStack: (string | number)[];
    indexStack: number[];
    recurse: () => void
};

export type WalkTreeHandler = {
    handleArray: (param: ObjectWorkTreeParam) => void;
    handleObject: (param: ObjectWorkTreeParam) => void;
    handlePrimitive: (param: PrimitiveWorkTreeParam) => void;
}

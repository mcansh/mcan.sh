// here until https://github.com/remix-run/remix/pull/3276 is merged

type JsonPrimitives = string | number | boolean | null;
// eslint-disable-next-line @typescript-eslint/ban-types
type NonJsonPrimitives = undefined | Function | symbol;

export type SerializeType<T> = T extends JsonPrimitives
  ? T
  : T extends undefined
  ? undefined
  : T extends { toJSON(): infer U }
  ? U
  : T extends []
  ? []
  : T extends [unknown, ...Array<unknown>]
  ? {
      [k in keyof T]: T[k] extends NonJsonPrimitives
        ? null
        : SerializeType<T[k]>;
    }
  : T extends Array<infer U>
  ? Array<SerializeType<U>>
  : {
      [k in keyof T as T[k] extends NonJsonPrimitives
        ? never
        : k]: SerializeType<T[k]>;
    };

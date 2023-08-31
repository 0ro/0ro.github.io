let str = "Hello, World!" as const; // str is a string

type StringToTuple<S extends string> = S extends `${infer Char}${infer Rest}`
  ? [Char, ...StringToTuple<Rest>]
  : [];

type Length<S extends string> = StringToTuple<S>["length"];

type LengthOfString<T extends string> = T["length"];

type T1 = Length<typeof str>; // number

type HasLength<S extends string, N extends number> = LengthOfString<S> extends N
  ? true
  : false;

type HasLengthMoreThan<
  S extends string,
  N extends number,
> = LengthOfString<S> extends N ? false : true;

type HasLengthLessThan<
  S extends string,
  N extends number,
> = LengthOfString<S> extends N ? false : true;

function getCountryByCode(code: HasLength<string, 2>): string {
  // ...
  return "";
}

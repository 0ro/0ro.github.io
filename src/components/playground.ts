type StringToTuple<S extends string> = S extends `${infer Char}${infer Rest}`
  ? [Char, ...StringToTuple<Rest>]
  : [];

type Length<S extends string> = StringToTuple<S>["length"];

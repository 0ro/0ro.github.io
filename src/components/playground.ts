// check if string is empty
type IsEmpty<S extends string> = IsLength<S, 0>;

// check if string is not empty
type IsNotEmpty<S extends string> = IsLength<S, 0> extends true
  ? false
  : true;

// check if string is shorter than N
type IsShorter<S extends string, N extends number> = IsLength<
  S,
  N
> extends true
  ? true
  : false;

// check if string is longer than N
type IsLonger<S extends string, N extends number> = IsLength<
  S,
  N
> extends true
  ? false
  : true;

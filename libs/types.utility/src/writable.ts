export type TWritable<T> = { -readonly [P in keyof T]: T[P] }

export interface Serializable<T> {
  serialize(): Record<string, any>;
  deserialize(_: JSON): T;
}

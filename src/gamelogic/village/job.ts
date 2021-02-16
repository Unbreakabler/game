import { Exclude } from "class-transformer";
import { Achievable } from "./achievable";

@Exclude()
export abstract class Job<T> extends Achievable {
  public static transformer(object: Job<any>): Job<any> {
    throw new Error("Method not implemented.");
  }
}

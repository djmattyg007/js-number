import Num from "./number";
import { NumMatcher } from "./alsatian-matchers";

declare module "alsatian/dist/core/expect/expect.i" {
    export interface IExpect {
        (actualValue: Num): NumMatcher;
    }
}

import Num from "./number";

declare module "alsatian/dist/core/expect/expect.i" {
    export interface IExpect {
        (actualValue: Num): NumMatcher;
    }
}

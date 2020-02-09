import { Expect } from "alsatian";
import Num from "src/number";
import { NumMatcher } from "src/alsatian-matchers";

Expect.extend(Num, NumMatcher);

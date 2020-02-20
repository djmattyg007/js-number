# Number

This package is a wrapper around the BigNumber class provided by [bignumber.js](https://mikemcl.github.io/bignumber.js/),
designed to provide a string-only representation of arbitrary-precision decimal numbers. This package provides several
niceties on top of what is normally available with BigNumber, with the aim of being difficult to misuse. The ideal
situation is to replace all usages of the default JavaScript ``Number`` type with the ``Num`` class found in this package.

This was born out of the need to introduce "big number" support to [CashMoney](https://github.com/cashmoneyjs/cashmoney"),
my port of [MoneyPHP](https://github.com/moneyphp/money) to JavaScript. Originally, the number class was rather limited,
and didn't support arithmetic operations on arbitrary-precision numbers. This package is designed to replace that entirely,
bringing it into a public interface.

## Features

- Full arithmetic support for arbitrary-precision decimal numbers
- JSON serialization
- Inter-operation with existing ``BigNumber`` instances

## Install

With yarn:

```bash
$ yarn add @cashmoney/number
```

Or with npm:

```bash
$ npm add @cashmoney/number
```

## Example usage

```typescript
import { Num } from "@cashmoney/number";
import BigNumber from "bignumber.js";

const fiveBigNum = new BigNumber(5);

const fiveFromNumber = new Num(5);
const fiveFromString = new Num("5");
const fiveFromBigNum = new Num(fiveBigNum);

console.log(fiveFromNumber.equals(fiveFromString)) // outputs true
console.log(fiveFromString.equals(fiveFromBigNum)) // outputs true
console.log(fiveFromBigNum.equals(fiveFromNumber)) // outputs true

console.log(String(fiveFromNumber.add(5))); // outputs "10"
console.log(String(fiveFromNumber.add("5"))); // outputs "10"
console.log(String(fiveFromNumber.add(fiveFromString))); // outputs "10"
console.log(String(fiveFromString.add(fiveBigNum))); // outputs "10"
console.log(fiveFromString.add(5).subtract(5).equals(fiveFromString)) // outputs true

console.log(fiveBigNum.isEqualTo(fiveFromString.num)); // outputs true
```

### Support for ``BigNumber.clone()``

bignumber.js lets you create "clones" of the main BigNumber constructor with different
settings. This lets you have multiple different BigNumber classes in your application,
each with different defaults.

This functionality is fully supported out of the box by ``Number``.

```typescript
import { Num } from "@cashmoney/number";
import BigNumber from "bignumber.js";

const BN = BigNumber.clone({ DECIMAL_PLACES: 10 });
Num.BigNumber = BN;
```

The new constructor function ``BN`` will now be used for all constructions of ``BigNumber``
performed by the ``Num`` class.

If you actually need to do this for some reason, it's strongly recommended that you
do this once in your application bootstrap code, before any instances of ``Num`` are
created. Otherwise, you'll likely end up with various weird behaviours in your application.
You'll also need to be careful if you're constructing your own instances of ``BigNumber``
in your application and passing them to instances of ``Num``.

Most of the time, you should be able to get away with using ``BigNumber.config()``
instead. This will automatically take effect for all instances of (the default) ``BigNumber``
constructor (which ``Num`` uses by default).

## Tests

To run the test suite, run ``yarn run test`` in the root of the repository.

## License

This library is made available under the MIT License (MIT). Please see the [license file](LICENSE.txt)
for more information.

## Acknowledgements

This library is heavily inspired by the Money, Calculator and Number classes from [MoneyPHP](https://github.com/moneyphp/money),
as well as being a wrapper around [bignumber.js](https://mikemcl.github.io/bignumber.js/).

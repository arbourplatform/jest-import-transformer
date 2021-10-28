# jest-import-transfomer
`jest` transformer to change directly manual mock imports to normal import.

## Problems this plugin solve

### Not having Typescript typings for manual mocks
`jest` will only transform imports from the module, therefore, manual mocks should be imported using:
```js
const { mockValue } = require('./my-module');

jest.mock('./my-module');
```

This will work, but Typescript won't be able to provide autocomplete or type checking.

### Import not transformed by `jest`
If manual mocks are imported directly, such as:
```ts
import { mockValue } from './__mocks___/my-module';

jest.mock('./my-module');
```

`mockValue` will be a different instance than the mock that `jest` transformed.

## What this plugin does
It allows you to write
```ts
import { mockValue } from './__mocks__/my-module';

jest.mock('./my-module');
```
so that you get autocomplete and typechecking during compile, but the generated Javascript code that `jest` receives will be
```js
import { mockValue } from './my-module';

jest.mock('./my-module');
```
and `jest` will correctly mock the module at runtime.
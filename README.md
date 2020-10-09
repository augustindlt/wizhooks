![Wizhooks](img/wizhooks.png)

# Wizhooks

![Build Status](https://img.shields.io/circleci/build/github/augustindlt/wizhooks)
[![Coverage Status](https://coveralls.io/repos/github/augustindlt/wizhooks/badge.svg?branch=master)](https://coveralls.io/github/augustindlt/wizhooks?branch=master)
[![NPM Version](https://img.shields.io/npm/v/wizhooks)](https://www.npmjs.com/package/wizhooks)

Wizhooks is a simple way to use the container-presenter pattern by composing hooks and higher-order components. The library is inspired by [recompose](https://github.com/acdlite/recompose).

```bash
yarn add wizhooks
```

### What you can do with `withHooks` :

```javascript
import React, { useState, useEffect } from "react";
import { withHooks } from "wizhooks";

const useMyHook = () => {
  const [message, setMessage] = useState("How are u ?");
  return { message, setMessage };
};

const Container = withHooks(
  {
    hook: useState,
    params: ["hello"],
    props: ([salutation, setSalutation]) => ({ salutation, setSalutation }),
  },
  {
    hook: useState,
    params: ["wizard"],
    props: ([subject, setSubject]) => ({ subject, setSubject }),
  },
  {
    hook: useEffect,
    params: ({ salutation, subject }) => [
      () => alert(`${salutation} ${subject}`),
    ],
  },
  {
    hook: useMyHook,
  }
);

const Presenter = ({ salutation, subject, message }) => (
  <>
    {salutation} {subject}, {message}
  </>
);

export default Container(Presenter);
```

[View this example in CodeSandbox](https://codesandbox.io/s/zen-frog-g2te2?fontsize=14&module=%2Fsrc%2FWithHooks%2FWithHooks.container.js&theme=dark)

### You can also use `withHooks` with HOC by using `compose` :

```javascript
import React, { useState, useEffect } from "react";
import { withHooks, compose } from "wizhooks";

const withLoading = (Component) => (props) => {
  if (props.loading) {
    return <>Loading ...</>;
  }
  return <Component {...props} />;
};

const useLoading = (isLoading) => {
  const [loading, setLoading] = useState(isLoading);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  });
  return { loading };
};

const container = compose(
  withHooks({ hook: useLoading, params: [true] }),
  withLoading
);

const Presenter = () => <>Hey Wizard !</>;

export default container(Presenter);
```

[View this example in CodeSandbox](https://codesandbox.io/s/zen-frog-g2te2?fontsize=14&hidenavigation=1&module=%2Fsrc%2FCompose%2FCompose.container.js&theme=dark)

## Documentation

### `withHooks` :

Allows you to create an hoc from the composition of hooks.

```js
withHooks(...hooks: HookConfig[]): HigherOrderComponent

withHooks({
    hook: HookFunction,
    params?: Parameters<HookFunction>
            | (innerProps: Object) => Parameters<HookFunction>,
    props?: string
            | (result:  ReturnType<HookFunction>, innerProps: Object) => Object
            | string[],
}): HigherOrderComponent
```

`hook`: This parameter takes the hook function.

`params`: This parameter is optional, it represents the parameters that will be sent to the hook. It can either be an array containing the parameters or a function taking props as a parameter and returning an array containing the parameters.

`props`: This parameter is optional, it represents the props that will be sent to the component. It can be either a string, in this case the return of the hook will be injected into a prop which will have the name of this string, an array of strings, used as decomposition in the case where the return of the hook is an array, a function which takes as a parameter the return of the hook and the inner props and which returns an object which will be injected as props to the child.

### `withProps` :

Allows you to create an higher-order component which will inject props to his child.

```js
withProps(
  createProps: Object | (innerProps: Object) => Object
): HigherOrderComponent
```

Takes a parameter which is either an object containing the props to inject, or a function which returns an object containing the props to inject.

### `compose` :

Allows you to compose multiple higher-order components into a single one.

```js
compose(...hocs: HigherOrderComponent[]): HigherOrderComponent;
```

All props received by the compose component will be transmitted to the HigherOrderComponent

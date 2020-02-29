import React, { ComponentType, FC } from "react";

export type FunctionHookParameters<H> = H extends (...args: any) => any
  ? Parameters<H>
  : never;

export type FunctionHookSetParameters<H, I, O> = (
  props: I & Partial<O>
) => FunctionHookParameters<H>;

export type FunctionHookReturnType<H> = H extends (...args: any) => any
  ? ReturnType<H>
  : never;

export type FunctionHookReturnFormater<H, I, O> = (
  result: FunctionHookReturnType<H>,
  props: I & Partial<O>
) => Partial<O>;

export interface IHookParams<I, H, O> {
  props?: FunctionHookReturnType<H> extends any[]
    ? Array<keyof O> | keyof O | FunctionHookReturnFormater<H, I, O>
    : FunctionHookReturnType<H> extends object
    ? undefined | keyof O | FunctionHookReturnFormater<H, I, O>
    : keyof O | FunctionHookReturnFormater<H, I, O>;
  hook: H;
  params?: FunctionHookParameters<H> | FunctionHookSetParameters<H, I, O>;
}

export const withHooks = <
  InnerProps extends {},
  Hooks extends Array<(...args: any) => any>,
  IOutterProps extends {}
>(
  ...hooks: {
    [k in keyof Hooks]: IHookParams<InnerProps, Hooks[k], IOutterProps>;
  }
) => {
  return (
    Component: ComponentType<InnerProps & IOutterProps>
  ): FC<InnerProps> => innerProps => {
    let outerProps: Partial<IOutterProps> = {};

    for (const hookParams of hooks) {
      const { hook, props, params } = hookParams;

      const paramsValue =
        typeof params === "function"
          ? params({ ...innerProps, ...outerProps })
          : params;

      const result = paramsValue ? hook(...paramsValue) : hook();

      if (!props && typeof result === "object" && result.length === undefined) {
        outerProps = { ...outerProps, ...result };
      } else if (typeof props === "function") {
        outerProps = {
          ...outerProps,
          ...props(result, { ...innerProps, ...outerProps })
        };
      } else if (typeof props === "string") {
        outerProps[props] = result;
      } else if (typeof props === "object" && props.length !== undefined) {
        for (let i = 0; i < props.length; i++) {
          outerProps[props[i]] = result[i];
        }
      }
    }

    return <Component {...innerProps} {...(outerProps as IOutterProps)} />;
  };
};

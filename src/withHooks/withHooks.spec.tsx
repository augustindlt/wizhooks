import React, { useState, useEffect } from "react";
import { render, fireEvent } from "@testing-library/react";
import { withHooks } from "./withHooks";
import { UseState } from "../types";

describe("withHooks", () => {
  it("should give to wrapped the good props", () => {
    const wrapper = withHooks<any, [UseState<string>, UseState<string>], any>(
      {
        params: ["hello"],
        hook: useState,
        props: ["salutation"]
      },
      {
        params: ["world"],
        hook: useState,
        props: ["subject"]
      }
    );
    const wrapped = (props: any) => {
      return (
        <>
          {props.salutation} {props.subject}
        </>
      );
    };
    const Component = wrapper(wrapped);

    const { getByText } = render(<Component />);

    expect(() => getByText("hello world")).not.toThrow();
  });

  it("should make updates possible", () => {
    const wrapper = withHooks<any, [UseState<string>], any>({
      params: ["hello"],
      hook: useState,
      props: ["salutation", "setSalutation"]
    });
    const wrapped = (props: any) => {
      return (
        <>
          {props.salutation}
          <button onClick={() => props.setSalutation("hey")}>
            change salutation
          </button>
        </>
      );
    };
    const Component = wrapper(wrapped);

    const { getByText } = render(<Component />);

    expect(() => getByText("hello")).not.toThrow();

    fireEvent.click(getByText("change salutation"));
    expect(() => getByText("hello")).toThrow();
    expect(() => getByText("hey")).not.toThrow();
  });

  it("sould work with function parameter for params", () => {
    const wrapper = withHooks<any, [UseState<string>], any>({
      params: props => [props.salutation],
      hook: useState,
      props: ["salutation"]
    });
    const wrapped = (props: any) => {
      return <>{props.salutation}</>;
    };
    const Component = wrapper(wrapped);

    const { getByText } = render(<Component salutation="hello" />);

    expect(() => getByText("hello")).not.toThrow();
  });

  it("sould work without parameter params", () => {
    const useWizardHook = () => ({
      salutation: "Hey",
      subject: "wizard"
    });

    const wrapper = withHooks<any, [typeof useWizardHook], any>({
      props: ({ salutation, subject }) => ({ salutation, subject }),
      hook: useWizardHook
    });
    const wrapped = (props: any) => {
      return (
        <>
          {props.salutation} {props.subject}
        </>
      );
    };
    const Component = wrapper(wrapped);

    const { getByText } = render(<Component />);

    expect(() => getByText("Hey wizard")).not.toThrow();
  });

  it("sould work with function parameter for props", () => {
    const wrapper = withHooks<any, [UseState<string>], any>({
      params: ["hello"],
      hook: useState,
      props: ([salutation]) => ({ salutation })
    });
    const wrapped = (props: any) => {
      return <>{props.salutation}</>;
    };
    const Component = wrapper(wrapped);

    const { getByText } = render(<Component />);

    expect(() => getByText("hello")).not.toThrow();
  });

  it("sould work with string parameter for props", () => {
    const wrapper = withHooks<any, [UseState<string>], any>({
      params: ["hello"],
      hook: useState,
      props: "salutation"
    });
    const wrapped = (props: any) => {
      return <>{props.salutation[0]}</>;
    };
    const Component = wrapper(wrapped);

    const { getByText } = render(<Component />);

    expect(() => getByText("hello")).not.toThrow();
  });

  it("sould work without parameter props", () => {
    const useWizardHook = (salutation: string) => ({
      salutation,
      subject: "wizard"
    });

    const wrapper = withHooks<any, [typeof useWizardHook], any>({
      params: ["Hey"],
      hook: useWizardHook
    });
    const wrapped = (props: any) => {
      return (
        <>
          {props.salutation} {props.subject}
        </>
      );
    };
    const Component = wrapper(wrapped);

    const { getByText } = render(<Component />);

    expect(() => getByText("Hey wizard")).not.toThrow();
  });

  it("sould work without parameters props and params", () => {
    const useWizardHook = () => ({
      salutation: "Hey",
      subject: "wizard"
    });

    const wrapper = withHooks<any, [typeof useWizardHook], any>({
      hook: useWizardHook
    });
    const wrapped = (props: any) => {
      return (
        <>
          {props.salutation} {props.subject}
        </>
      );
    };
    const Component = wrapper(wrapped);

    const { getByText } = render(<Component />);

    expect(() => getByText("Hey wizard")).not.toThrow();
  });

  it("sould work with hook that return nothing", () => {
    const toBeCalled = jest.fn();
    const wrapper = withHooks<{}, [typeof useEffect], {}>({
      hook: useEffect,
      params: [toBeCalled]
    });
    const wrapped = () => {
      return <>Hey wizard</>;
    };
    const Component = wrapper(wrapped);

    render(<Component />);

    expect(toBeCalled).toBeCalled();
  });

  it("sould forward props to param props", () => {
    const useWizardHook = () => ({
      salutation: "Hey",
      subject: "wizard"
    });

    type THooks = [typeof useWizardHook, UseState<string>];
    const wrapper = withHooks<any, THooks, any>(
      { hook: useWizardHook },
      {
        props: ([salutation], connectedProps) => ({
          salutation: `${salutation} ${connectedProps.salutation}`
        }),
        hook: useState,
        params: props => [props.salutation]
      }
    );
    const wrapped = (props: any) => {
      return (
        <>
          {props.salutation} {props.subject}
        </>
      );
    };
    const Component = wrapper(wrapped);

    const { getByText } = render(<Component />);

    expect(() => getByText("Hey Hey wizard")).not.toThrow();
  });
});

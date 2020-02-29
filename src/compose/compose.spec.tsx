import React, { useState } from "react";
import { render, fireEvent } from "@testing-library/react";
import { compose } from "./compose";
import { withProps } from "../withProps";
import { withHooks } from "../withHooks";
import { UseState } from "../types";

describe("compose", () => {
  it("should give to wrapped the good props", () => {
    const wrapper = compose(
      withProps(() => ({
        salutation: "hello"
      })),
      withProps(() => ({
        subject: "world"
      }))
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

  it("should give to hocs the good props", () => {
    const hoc = (Component: any) => (props: any) => (
      <Component {...props} salutation={`${props.salutation}o`} />
    );
    const wrapper = compose(
      withProps(() => ({
        salutation: "hello"
      })),
      hoc,
      hoc,
      hoc,
      withProps(() => ({
        subject: "world"
      }))
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

    expect(() => getByText("helloooo world")).not.toThrow();
  });

  it("should work with withHooks", () => {
    const withUseSubject = withHooks<any, [UseState<string>], any>({
      params: (props: any) => [props.subject],
      hook: useState,
      props: ["subject", "setSubject"]
    });

    const wrapper = compose(
      withProps(() => ({
        subject: "world"
      })),
      withUseSubject,
      withProps(() => ({
        salutation: "hello"
      }))
    );
    const wrapped = (props: any) => {
      return (
        <>
          {props.salutation} {props.subject}
          <button onClick={() => props.setSubject("wizard")}>
            change subject
          </button>
        </>
      );
    };
    const Component = wrapper(wrapped);

    const { getByText } = render(<Component />);

    expect(() => getByText("hello world")).not.toThrow();

    fireEvent.click(getByText("change subject"));
    expect(() => getByText("hello world")).toThrow();
    expect(() => getByText("hello wizard")).not.toThrow();
  });
});

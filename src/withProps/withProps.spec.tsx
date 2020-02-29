import React from "react";
import { render } from "@testing-library/react";
import { withProps } from "./withProps";

describe("withProps", () => {
  it("should give to wrapped the good props", () => {
    const wrapper = withProps(() => ({
      salutation: "hello",
      subject: "world"
    }));
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

  it("should retreive the good props", () => {
    const wrapper = withProps(({ salutation, subject }: any) => ({
      salutation,
      subject
    }));
    const wrapped = (props: any) => {
      return (
        <>
          {props.salutation} {props.subject}
        </>
      );
    };
    const Component = wrapper(wrapped);

    const { getByText } = render(
      <Component salutation="Hey" subject="wizard" />
    );

    expect(() => getByText("Hey wizard")).not.toThrow();
  });

  it("should work with object as parameter", () => {
    const wrapper = withProps({ salutation: "Hey", subject: "wizard" });
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
});

import React, { ComponentType, FC } from 'react';

export type TPropsToAddFn<InnerProps, AddedProps> = (props: InnerProps) => AddedProps;

export const withProps = <InnerProps extends object, PropsToAdd extends object>(
  propsToAdd: TPropsToAddFn<InnerProps, PropsToAdd> | PropsToAdd
) => (Component: ComponentType<Partial<InnerProps> & PropsToAdd>): FC<InnerProps> => props => {
  if (typeof propsToAdd !== 'object') {
    return <Component {...props} {...propsToAdd(props)} />;
  }
  return <Component {...props} {...propsToAdd} />;
};

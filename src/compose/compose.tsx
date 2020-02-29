import { ComponentType } from 'react';

type hoc = (child: ComponentType<any>) => ComponentType<any>;

export const compose = <IInnerProps extends any, IOuterProps extends any>(...hocs: hoc[]) => {
  return (component: ComponentType<IOuterProps>): ComponentType<IInnerProps> => {
    let Composed: ComponentType<IInnerProps> = component as IInnerProps;
    for (let i = hocs.length - 1; i > -1; i--) {
      Composed = hocs[i](Composed);
    }
    return Composed;
  };
};

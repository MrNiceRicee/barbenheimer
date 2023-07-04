declare module "react-usa-map" {
  export interface Event extends MouseEvent<SVGPathElement> {
    target: SVGPathElement & {
      dataset: {
        name: string;
      };
    };
  }

  type MapCustomization = {
    fill: string;
    clickHandler: (event: Event) => void;
  };

  export type MapCustomizations = Record<string, Partial<MapCustomization>>;

  export type MapProps = {
    // onClick?: (stateAbbrev: string) => void;
    onClick?: ?((event: Event) => void);
    onClickEvent?: (event: MouseEvent<SVGPathElement>) => void;
    onMouseOver?: (stateAbbrev: string) => void;
    onMouseOverEvent?: (event: MouseEvent<SVGPathElement>) => void;
    width?: number;
    height?: number;
    title?: string;
    defaultFill?: string;
    customize?: MapCustomizations;
  };

  // default jsx export
  export default class USAMap extends React.Component<MapProps> {}
}

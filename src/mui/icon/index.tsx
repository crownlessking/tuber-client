import { SvgIcon } from '@mui/material';
import StateFormItemCustom from 'src/controllers/StateFormItemCustom';
import StateIcon from 'src/controllers/StateIcon';
import {
  IStateIconPolygon,
  IStateIconPath,
  IStateIconRect,
  IStateIconGroup
} from 'src/interfaces/IStateIcon';

interface IJsonIconProps {
  def: StateFormItemCustom<unknown>;
  svgDef: StateIcon;
}

interface ICommonProps {
  fill?: string;
}

interface IPathProps extends ICommonProps {
  path: IStateIconPath;
}

interface IPolyProps extends ICommonProps {
  poly: IStateIconPolygon;
}

interface IRectProps extends ICommonProps {
  rect: IStateIconRect;
}

const StateJsxIconGroup = ({ group, fill }: { group: IStateIconGroup; fill?: string }) => {
  const { children, ...groupAttributes } = group;
  return (
    <g {...groupAttributes}>
      {children.map((element, i) => {
        switch (element.type) {
          case 'path':
            return (
              <StateJsxIconPath
                key={`group-path-${i}`}
                path={element.props as IStateIconPath}
                fill={fill}
              />
            );
          case 'rect':
            return (
              <StateJsxIconRect
                key={`group-rect-${i}`}
                rect={element.props as IStateIconRect}
                fill={fill}
              />
            );
          case 'polygon':
            return (
              <StateJsxIconPoly
                key={`group-polygon-${i}`}
                poly={element.props as IStateIconPolygon}
                fill={fill}
              />
            );
          case 'group':
            return (
              <StateJsxIconGroup
                key={`group-group-${i}`}
                group={element.props as IStateIconGroup}
                fill={fill}
              />
            );
          default:
            return null;
        }
      })}
    </g>
  );
};

const StateJsxIconPath = ({ path, fill }: IPathProps) => (
  <path d={path.d} fill={path.fill || fill} />
);

const StateJsxIconPoly = ({ poly, fill }: IPolyProps) => (
  <polygon
    points={poly.points}
    fill={poly.fill || fill}
    stroke={poly.stroke}
    strokeWidth={poly.strokeWidth}
    transform={poly.transform}
  />
);

const StateJsxIconRect = ({ rect, fill }: IRectProps) => (
  <rect
    width={rect.width}
    height={rect.height}
    x={rect.x}
    y={rect.y}
    rx={rect.rx}
    ry={rect.ry}
    fill={rect.fill || fill}
  />
);

export default function StateJsxIcon({ def: icon, svgDef: svg }: IJsonIconProps) {
  // Return early if no content to render
  if (!svg.hasContent) {
    return null;
  }

  // Only apply explicit width/height if no fontSize is specified in iconProps
  const shouldApplyExplicitSize = !icon.iconProps?.fontSize;

  return (
    <SvgIcon
      viewBox={svg.viewBox}
      sx={{
        ...(shouldApplyExplicitSize && {
          width: svg.width,
          height: svg.height,
        }),
        fill: svg.fill,
        stroke: svg.stroke,
        strokeWidth: svg.strokeWidth,
        ...svg.attributes
      }}
      {...icon.iconProps}
    >
      {/* Render groups */}
      {svg.groups?.map((group, i) => (
        <StateJsxIconGroup
          key={`group-${i}`}
          group={group}
          fill={svg.fill}
        />
      ))}

      {/* Render paths */}
      {svg.paths.map((path, i) => (
        <StateJsxIconPath
          key={`path-${i}`}
          path={path}
          fill={svg.fill}
        />
      ))}
      
      {/* Render default path if only svg string is provided */}
      {svg.defaultPathElement && (
        <path 
          d={svg.defaultPathElement.d} 
          fill={svg.defaultPathElement.fill} 
        />
      )}

      {/* Render rectangles */}
      {svg.rects.map((rect, i) => (
        <StateJsxIconRect 
          key={`rect-${i}`}
          rect={rect}
          fill={svg.fill}
        />
      ))}
      
      {/* Render polygons */}
      {svg.polygons.map((polygon, i) => (
        <StateJsxIconPoly
          key={`polygon-${i}`}
          poly={polygon}
          fill={svg.fill}
        />
      ))}
    </SvgIcon>
  );
};

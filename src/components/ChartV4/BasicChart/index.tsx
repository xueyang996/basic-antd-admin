import React, { FC, Fragment } from 'react';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coordinate,
  Legend,
  Line,
  Annotation,
} from 'bizcharts';

import { Empty } from 'antd';

import {
  defaultColors,
  linearDefaultColors,
  linear90DefaultColors,
} from '@/constants/chartColors';

import styles from './index.less';

// const { Global } = G2; // 获取 Global 全局对象
// Global.registerTheme('newTheme', {
//   colors: defaultColors,
// });

export type BasicChartT = {
  data: [];
  theme?: string;
  axisX?: string;
  axisY?: string;
  subTitle?: string;
  chartId?: string;
  title?: string;
  facetType?: string;

  typeGeom?: string;
  sizeGeom?: number;
  adjustGeom?: string;
  labelGeom?: any;
  positionGeom?: string;
  colorGeo?: string | any[];
  linearColor?: boolean;
  tooltipGeom?: any[];
  styleGeom?: any;
  showLabel?: string;

  type?: 'rect' | 'polar' | 'theta' | 'helix';
  visibleX?: boolean;
  visibleY?: boolean;
  transpose?: boolean;
  gridX?: object | null;
  tickLineX?: object | null;
  lineX?: object | null;
  gridY?: object | null;
  tickLineY?: object | null;
  lineY?: object | null;
  labelX?: object | null;
  labelY?: object | null;

  useHtml?: boolean;
  showTitle?: boolean;

  htmlContent?: object;
  tooltipTitle?: string;
  tooltipProps?: object;

  padding?: number[];
  faceFields?: [];
  faceColor?: [];
  height?: number;
  innerRadius?: number;
  radius?: number;
  scale?: object;
  endAngle?: any;
  startAngle?: any;

  showLegend?: boolean;
  positionLegend?: string;
  layoutLegend?: string;
  legendFormat?: (arg0: any) => any;
  legendName?: string;
  legendOffsetY?: number;
  legendOffsetX?: number;
  legendSpacing?: number;
  selfLegend?: number;
  selfLegndKeys?: any[];

  annotationArc?: any[];
  annotationText?: string | any[];
  annotationPosition?: any[];
  annotationStyle?: any;
  annotationTop?: boolean;
  // line 组件配置
  lineProps?: any;
};

const BasicColumn: FC<BasicChartT> = props => {
  const {
    subTitle,
    chartId,
    // chart 配置
    data = [],
    height = 260,
    padding = [20, 20, 40, 20],
    scale = null,
    theme = 'newTheme',
    // coord 配置
    transpose = false,
    innerRadius,
    radius,
    type = 'rect',
    startAngle,
    endAngle,
    // axis 配置
    axisX = 'item',
    axisY = 'count',
    visibleX = true,
    visibleY = true,
    gridX = null,
    tickLineX = null,
    lineX = null,
    gridY = null,
    tickLineY = null,
    lineY = null,
    labelX = null,
    labelY = null,
    // Facet 配置
    facetType,
    faceFields,
    faceColor,
    // tooltip 配置，可以配合geom 的tooltip使用
    useHtml = false,
    htmlContent = null,
    showTitle = false,
    tooltipTitle = null,
    tooltipProps = {},
    // Geom 配置
    typeGeom = 'interval',
    positionGeom,
    colorGeo = '',
    linearColor = false,
    sizeGeom = '',
    adjustGeom = '',
    labelGeom = '',
    tooltipGeom = null,
    styleGeom = null,
    showLabel = '',
    // legend 配置
    showLegend = false,
    positionLegend = '',
    layoutLegend = '',
    legendName = '',
    legendSpacing,
    legendOffsetY = 0,
    legendOffsetX = 0,
    legendFormat = null,
    // selfLegend 配置，自定义legend 展示(百分比 100最大)
    selfLegend = '',
    selfLegndKeys = [],
    annotationArc,
    annotationText = '',
    annotationPosition,
    annotationStyle,
    annotationTop,

    lineProps,
  } = props;
  let positionGeomResult = positionGeom;
  if (!positionGeomResult) {
    positionGeomResult = `${axisX}*${axisY}`;
  }
  let colorGeoResult = colorGeo || axisX;
  if (colorGeoResult && typeof colorGeo === 'string') {
    colorGeoResult = [
      colorGeoResult,
      linearColor
        ? transpose
          ? linearDefaultColors
          : linear90DefaultColors
        : defaultColors,
    ];
  }
  // tooltip 配置
  const tooltipPrps: any = {
    showTitle: showTitle,
    ...tooltipProps,
  };
  useHtml && (tooltipPrps.useHtml = useHtml);
  htmlContent && (tooltipPrps.htmlContent = htmlContent);
  tooltipTitle && (tooltipPrps.title = tooltipTitle);
  const coordinateProps: any = {
    type,
    innerRadius,
    transpose,
    radius,
  };
  startAngle && (coordinateProps.startAngle = startAngle);
  endAngle && (coordinateProps.endAngle = endAngle);
  // geomprops 配置
  const geomProps: any = {
    color: colorGeoResult,
    type: typeGeom,
    position: positionGeomResult,
  };
  sizeGeom && (geomProps.size = sizeGeom);
  adjustGeom && (geomProps.adjust = adjustGeom);
  labelGeom && (geomProps.label = labelGeom);
  tooltipGeom && (geomProps.tooltip = tooltipGeom);
  styleGeom && (geomProps.style = styleGeom);
  // 设置横纵坐标 默认字体样式
  let labelXResult = labelX;
  let labelYResult = labelY;
  if (labelXResult && !labelX.style) {
    labelX.style = {
      textAlign: transpose ? 'end' : 'center',
      fill: 'rgba(0,0,0, 0.45)', // 文本的颜色
      fontSize: '12', // 文本大小
    };
  }
  if (labelYResult && !labelY.style) {
    labelY.style = {
      textAlign: transpose ? 'end' : 'center',
      fill: '#5c6f88', // 文本的颜色
      fontSize: '12', // 文本大小
    };
  }
  const emptyFlag = data.length === 0;
  const annotationTextArray =
    annotationText instanceof Array
      ? annotationText
      : [
          {
            text: annotationText,
            position: annotationPosition,
            style: annotationStyle,
          },
        ];
  return (
    <Fragment>
      <div
        style={{
          width: 100 - (emptyFlag ? 0 : selfLegend) + '%',
          display: selfLegend ? 'inline-block' : 'block',
          fontSize: 0,
        }}
      >
        {subTitle ? <div className={styles.subtitle}>{subTitle}</div> : null}
        {emptyFlag ? (
          <div
            style={{
              height: `${height}px`,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        ) : (
          <Chart
            // key={chartId}
            theme={theme}
            height={height}
            data={data}
            autoFit
            padding={padding}
            animate={false}
            scale={scale}
            interactions={['active-region']}
          >
            <Legend
              visible={showLegend}
              name={legendName || axisX}
              offsetX={legendOffsetX}
              offsetY={legendOffsetY}
              position={positionLegend}
              itemFormatter={legendFormat}
              itemSpacing={legendSpacing}
            ></Legend>
            <Tooltip {...tooltipPrps} />
            <Coordinate {...coordinateProps} />
            {annotationText && (
              <Fragment>
                {annotationTextArray.map((item, index) => (
                  <Annotation.Text
                    animate={false}
                    key={'text' + index}
                    position={item.position}
                    content={item.text}
                    style={item.style}
                  />
                ))}
              </Fragment>
            )}
            {annotationArc && (
              <Fragment>
                {annotationArc.map((item, index) => {
                  return (
                    <Annotation.Arc
                      animate={false}
                      top={item.top}
                      key={index + 'item'}
                      start={item.start}
                      end={item.end}
                      style={item.style}
                    />
                  );
                })}
              </Fragment>
            )}
            <Axis
              name={axisX}
              visible={visibleX}
              grid={gridX}
              tickLine={tickLineX}
              line={lineX}
              label={labelXResult}
            />
            <Axis
              name={axisY}
              visible={visibleY}
              grid={gridY}
              tickLine={tickLineY}
              line={lineY}
              label={labelYResult}
            />
            <Geom {...geomProps} animate={false}></Geom>
            {lineProps && <Line {...lineProps}></Line>}
          </Chart>
        )}
      </div>
      {selfLegend && !emptyFlag && (
        <div
          style={{
            width: `${selfLegend}%`,
            height: `${height}px`,
            overflowY: 'auto',
          }}
          className={styles['self-legend']}
        >
          {data.map((item, index) => {
            const colorIndex = index % defaultColors.length;
            return (
              <div key={item[axisX]} className={styles['legend-item']}>
                <div
                  className={styles['legend-color']}
                  style={{ background: defaultColors[colorIndex] }}
                ></div>
                {selfLegndKeys.map(detail => {
                  return (
                    <div
                      key={detail.key}
                      className={styles['legend-detail']}
                      style={{ flex: detail.flex || 1 }}
                    >
                      {(detail.prefix || '') +
                        item[detail.key] +
                        (detail.unit || '')}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </Fragment>
  );
};

export default BasicColumn;

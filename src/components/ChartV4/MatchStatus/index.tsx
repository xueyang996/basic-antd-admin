import React, { FC, Fragment } from 'react';

import notMatchPng from '@/assets/notMatch.png';
import BasicChart from '../BasicChart';

export type MatchStatusP = {
  data: number;
  height: number;
  sizeCount?: string;
  sizeDes?: string;
  padding?: any[];
  startAngle?: number;
  endAngle?: number;
  innerRadius?: number;
  positionGeom?: string;
};

const MatchStatus = (props: MatchStatusP) => {
  const {
    height,
    padding,
    startAngle,
    endAngle,
    innerRadius,
    positionGeom,
    sizeCount,
    sizeDes,
    data = 0,
  } = props;
  let dataChart = [
    { item: '匹配', score: data },
    { item: '其他', score: 100 - data },
  ];
  let colorGeo = ['item', ['#eeeff4', '#eeeff4']];
  let annotationText: any[] = [
    {
      text: '匹配度',
      position: ['50%', '90%'],
      style: {
        fontSize: sizeDes || '16',
        fill: '#334355',
        textAlign: 'center',
      },
    },
  ];
  let annotationImage;
  if (data > 80) {
    colorGeo = [
      'item',
      ['l (270) 0:rgba(135,220,163,1) 1:rgba(47,195,124,1)', '#eeeff4'],
    ];
    annotationText[0].text = '高';
    annotationText.push({
      text: data,
      position: ['50%', '50%'],
      style: {
        lineHeight: '240px',
        fontSize: sizeCount || '54',
        fill: 'rgba(47,195,124,1)',
        textAlign: 'center',
      },
    });
  } else if (data > 20) {
    colorGeo = [
      'item',
      ['l (270) 0:rgba(148,213,255,1) 1:rgba(19,162,255,1)', '#eeeff4'],
    ];
    annotationText[0].text = '中';
    annotationText.push({
      text: data,
      position: ['50%', '50%'],
      style: {
        lineHeight: '240px',
        fontSize: sizeCount || '54',
        fill: 'rgba(19,162,255,1)',
        textAlign: 'center',
      },
    });
  } else if (data > 0) {
    colorGeo = [
      'item',
      ['l (270) 0:rgba(253,153,143,1) 1:rgba(249,96,86,1)', '#eeeff4'],
    ];
    annotationText[0].text = '低';
    annotationText.push({
      text: data,
      position: ['50%', '50%'],
      style: {
        lineHeight: '240px',
        fontSize: sizeCount || '54',
        fill: 'rgba(249,96,86,1)',
        textAlign: 'center',
      },
    });
  } else {
    annotationImage = [
      {
        src: notMatchPng,
        top: true,
        start: ['40%', '40%'],
        end: ['60%', '60%'],
      },
    ];
    annotationText[0].text = '不匹配';
  }

  return (
    <BasicChart
      height={height}
      padding={padding}
      data={dataChart}
      startAngle={startAngle || (-5 * Math.PI) / 4}
      endAngle={endAngle || Math.PI / 4}
      type="theta"
      positionGeom={positionGeom || 'score'}
      innerRadius={innerRadius || 0.8}
      typeGeom="interval"
      adjustGeom="stack"
      colorGeo={colorGeo}
      annotationText={annotationText}
      annotationImage={annotationImage}
      visibleX={false}
      visibleY={false}
      tooltipProps={{
        visible: false,
      }}
    />
  );
};

export default MatchStatus;

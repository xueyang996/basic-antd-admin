/* eslint-disable no-undef */
import request from 'utils/request';
import { apiPrefix } from 'utils/config';

import api from './api';

const REG_PARAMS = /{([a-zA-Z]+)}/g;

const gen = (params) => {
  let url = apiPrefix[__API_PREFIX_FLAG__] + params;
  let method = 'GET';

  const paramsArray = params.split(' ');
  if (paramsArray.length === 2) {
    method = paramsArray[0];
    url = apiPrefix[__API_PREFIX_FLAG__] + paramsArray[1];
  }

  return function (data) {
    let resultUrl = url;
    // 替换url 中 的参数
    let match;
    while ((match = REG_PARAMS.exec(url))) {
      if (data[match[1]]) {
        resultUrl = resultUrl.replace(match[0], data[match[1]]);
      }
    }
    // if (data.pageSize) {
    //   let originUrl = url;
    //   resultUrl = originUrl.replace('{pageSize}', data.pageSize).replace('{pageNum}', data.pageNum);
    // } else if() {

    // }
    return request({
      url: resultUrl,
      data,
      method,
    });
  };
};

const APIFunction = {};
for (const key in api) {
  APIFunction[key] = gen(api[key]);
}

export default APIFunction;

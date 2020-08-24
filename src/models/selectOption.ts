import { Reducer } from 'redux';
import { Effect } from 'dva';

import api from 'api'
import { fetchDepartmentListAsync } from api

export interface SelectOptionModelState {
  departList?: [];
  countryList?: [];
}

export interface SelectOptionType {
  namespace: 'selectOption';
  state: SelectOptionModelState;
  effects: {
    queryDepartList?: Effect;
  };
  reducers: {
    update: Reducer<SelectOptionModelState>;
  };
  subscriptions: any;
}

const SelectOption: SelectOptionType = {
  namespace: 'selectOption',
  state: {
    departList: [],
    countryList: [],
  },
  effects: {
    // 获取村社、科室
    // departmentType	否	部门类型，0科室，1村社
    // status	否	账号状态，0禁用，1启用
    *queryDepartList({ payload }, { call, put, select }) {
      const { departList, countryList } = yield select(
        (state: any) => state.selectOption,
      );
      if (payload.departmentType === 0 && departList.length > 0) {
        // 已经有值不进行重复获取
        return false;
      } else if (payload.departmentType === 1 && countryList.length > 0) {
        // 已经有值不进行重复获取
        return false;
      }
      const res = yield call(fetchDepartmentListAsync, payload);
      if (0 === res.code) {
        yield put({
          type: 'update',
          payload:
            payload.departmentType === 0
              ? {
                  departList: res.data,
                }
              : {
                  countryList: res.data,
                },
        });
      }
    },
  },
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   history.listen(location => {
    //   });
    // },
  },
};

export default SelectOption;

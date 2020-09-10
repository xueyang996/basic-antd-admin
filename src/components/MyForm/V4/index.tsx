import React, { useState } from 'react';
import className from 'classnames';
import {
  Form,
  Select,
  Input,
  InputNumber,
  DatePicker,
  Switch,
  Radio,
  Slider,
  Button,
  Upload,
  Rate,
  Checkbox,
  Row,
  Col,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import VertifiCode from '@/components/Input/VerificationInput';
import { InputType } from '@/utils/getMatch';

import styles from './index.less';
const { Option } = Select;

export type FormItem = {
  type: InputType;
  label: React.ReactNode | string;
  name: string;
  value?: string;
  dateFormat?: string;
  placeholder?: string;
  option?: { key: string; value: string }[];
  rules?: any[];
  /** 关联选项 */
  childName?: string;
  /** 关联选项 父级 */
  parentName?: string;
  /** 关联选项 子选项 */
  originOption?: { [T: string]: any[] };
  getVerifyCode?: () => void;
};

export interface FormProps {
  list: FormItem[];

  form?: FormInstance;
  formItemLayout?: any;
  initialValues?: object;
}
const formItemLayoutDefault = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const nopop = function() {};

function getFormItem(item: FormItem) {
  const {
    type,
    label,
    value,
    name,
    option,
    rules,
    placeholder,
    dateFormat,
    getVerifyCode = nopop,
  } = item;
  switch (type) {
    case 'text':
      return (
        <Form.Item label={label} name={name}>
          <span className="ant-form-text">{value}</span>
        </Form.Item>
      );
    case 'number':
      return (
        <Form.Item label={label} name={name} rules={rules}>
          <InputNumber style={{ width: '100%' }} placeholder={placeholder} />
        </Form.Item>
      );
    case 'date':
      return (
        <Form.Item label={label} name={name}>
          <DatePicker format={dateFormat || 'YYYY/MM/DD'} />
        </Form.Item>
      );
    case 'input':
      return (
        <Form.Item label={label} name={name} rules={rules}>
          <Input style={{ width: '100%' }} placeholder={placeholder} />
        </Form.Item>
      );
    case 'phone':
      return (
        <Form.Item label={label} name={name} style={{ width: '100%' }}>
          <VertifiCode getVerifyCode={getVerifyCode} />
        </Form.Item>
      );
    case 'select':
    case 'multiselect':
      const mode = type === 'multiselect' ? 'multiple' : undefined;
      return (
        <Form.Item label={label} name={name} rules={rules}>
          <Select mode={mode} placeholder={placeholder}>
            {option &&
              option.map((item: any) => {
                return (
                  <Option key={item.value || item} value={item.value || item}>
                    {item.key || item}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
      );
    default:
      break;
  }
}

function MyFormV4(props: FormProps) {
  const {
    list,
    form: formProps,
    formItemLayout = formItemLayoutDefault,
    initialValues = {},
  } = props;
  const [relatedValue, setRelatedValue] = useState('');
  let formResult = formProps;
  if (!formResult) {
    formResult = Form.useForm()[0];
  }
  // 对于多选中含有以上均无等选项特殊处理
  const handleValue = (values: any) => {
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      const { type, name, childName } = element;
      const value = values[name];
      if (type === 'multiselect' && value) {
        const index = value.indexOf('以上均无');
        if (index === 0 && value.length > 1) {
          value.shift();
          formResult?.setFieldsValue({
            [name]: value,
          });
        } else if (index > 0) {
          formResult?.setFieldsValue({
            [name]: ['以上均无'],
          });
        }
        if (index !== -1) {
          break;
        }
      }
      // 关联选型  父级值发生变化
      if (childName && value) {
        setRelatedValue(value);
        formResult?.setFieldsValue({
          [childName]: undefined,
        });
      }
    }
  };
  return (
    <div className={styles['result-type']}>
      <Form
        onValuesChange={handleValue}
        form={formResult}
        {...formItemLayout}
        initialValues={initialValues}
      >
        {list.map((item: FormItem, index: number) => {
          if (item.parentName && relatedValue) {
            item.option = item.originOption![relatedValue];
          }
          return <div key={item.name}>{getFormItem(item)}</div>;
        })}
      </Form>
    </div>
  );
}

export default MyFormV4;

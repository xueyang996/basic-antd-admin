import React, { useEffect, useState } from 'react';
import {
  Form,
  Select,
  Radio,
  Input,
  InputNumber,
  Checkbox,
  Button,
  Spin,
  message,
} from 'antd';
import classNames from 'classnames';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import styles from './index.less';

const getItem = props => {
  const { data } = props;
  const { type, placeholder, option = [], valueType } = data;
  let node = <div></div>;
  const commonStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
    marginLeft: 0,
  };
  switch (type) {
    // 输入框
    case 'INPUT_TEXT_NORMAL':
    case 'INPUT_TEXT_POP':
      if (valueType === 'NUMBER') {
        node = (
          <InputNumber
            style={{ width: '100%' }}
            placeholder={placeholder || '请输入'}
          />
        );
      } else {
        node = <Input placeholder={placeholder || '请输入'} />;
      }
      break;

    // 单选框
    case 'INPUT_RADIO':
      node = (
        <Radio.Group>
          {option.map(item => (
            <Radio
              key={item.label || item}
              style={commonStyle}
              value={item.value || item}
            >
              {item.label || item}
            </Radio>
          ))}
        </Radio.Group>
      );
      break;

    // 多选框
    case 'INPUT_CHECKBOX':
      node = (
        <Checkbox.Group>
          {option.map(item => (
            <Checkbox
              key={item.label || item}
              style={commonStyle}
              value={item.value || item}
            >
              {item.label || item}
            </Checkbox>
          ))}
        </Checkbox.Group>
      );
      break;
      default:
        node = <div></div>
  }
  return node;
};

// const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const QuestionForm = props => {
  const {
    list = [],
    onChange,
    percent,
    nextBtnType = 'default',
    itemStyle = null,
    btnStyle = null,
    showSave = false,
    form,
  } = props;
  let formResult = form;
  if (!formResult) {
    formResult = Form.useForm()[0];
  }
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formValues, setFromValues] = useState({});

  const onValuesChange = (changedValues, allValues) => {
    const changedKey = Object.keys(changedValues)[0] || '';
    let changeValue = changedValues[changedKey] || [];
    const changeItem = list.find(item => item.key === changedKey) || {};
    // 对于多选中含有以上均无等选项特殊处理
    const index = changeValue.indexOf('以上均无');
    if (
      changeItem.type === 'INPUT_CHECKBOX' &&
      changeValue.length > 0 &&
      index !== -1
    ) {
      if (index === 0 && changeValue.length > 1) {
        changeValue.shift();
      } else if (index > 0) {
        changeValue = ['以上均无'];
      }
      formResult.setFieldsValue({
        [changedKey]: changeValue,
      });
      changedValues[changedKey] = changeValue;
      allValues[changedKey] = changeValue;
    }
    setFromValues({
      changedValues,
      allValues,
    });
    // INPUT_RADIO 直接跳转下一步

    if (changeItem.type === 'INPUT_RADIO' && !showSave) {
      handleStep('next', changedValues, allValues);
    }
  };

  // 点击上一步，下一步操作
  // type 类型为radio时，由于直接进行请求，此时 formValues 值暂未更新，因此需要单独传入
  const handleStep = (type, changedValues, allValues) => {
    const nextFlag = type === 'next';
    if (nextFlag) {
      // 修改值不能为空
      const value1 = changedValues || formValues.changedValues;
      const value2 = allValues || formValues.allValues;
      // 获取当前问题答案
      const key = list[currentStep] && list[currentStep].key;
      const notEmptyValue = (key && value2[key]) || '';
      const emptyFlag = notEmptyValue.length;
      if (!emptyFlag) {
        return message.error('录入值不能为空');
      }
      getNextQuestion(value1, value2);
    }
    const unit = nextFlag ? 1 : -1;
    if (percent === 100 && nextFlag && currentStep === list.length - 1) {
      message.success('已匹配完成！');
    } else {
      setCurrentStep(currentStep + unit);
    }
  };
  const getNextQuestion = (changedValues, allValues) => {
    if (currentStep === list.length - 1) {
      onChange && onChange(changedValues, allValues);
      if (percent !== 100) {
        setLoading(true);
      }
    }
  };
  useEffect(() => {
    if (list.length > currentStep || percent === 100) {
      setLoading(false);
    }
    // 暂无更多，但是已经进入下一步，需要回退到上一步
    if (list.length === currentStep && percent === 100) {
      setCurrentStep(currentStep - 1);
      message.success('已匹配完成！');
    }
  }, [list.length, percent]);

  return (
    <div className={styles['container']}>
      <Spin spinning={loading || false} tip="匹配中" delay={100}>
        {loading && (
          <div
            className={styles['form-item']}
            style={{ height: '200px' }}
          ></div>
        )}
        <Form
          {...layout}
          className={styles['questions-form']}
          onValuesChange={onValuesChange}
          form={formResult}
        >
          {list.map((item, index) => {
            return (
              <Form.Item
                className={classNames(styles['form-item'], {
                  [styles.current]: index === currentStep && !showSave,
                  [styles['height-auto']]: showSave,
                })}
                style={itemStyle}
                key={'item' + index}
                colon={false}
                name={item.key}
                label={`${index + 1}. ${item.key} ?`}
                // required={true}
              >
                {getItem({ data: item })}
              </Form.Item>
            );
          })}
        </Form>
        {!showSave && (
          <div className={styles['handle-parent']} style={btnStyle}>
            <Button
              disabled={currentStep === 0}
              style={{ marginRight: '12px' }}
              onClick={() => {
                handleStep('prev');
              }}
            >
              <LeftOutlined
                style={{
                  fontSize: '10px',
                  color: currentStep === 0 ? 'rgba(132,143,157,0.2)' : '',
                }}
              />
              上一步
            </Button>
            <Button
              type={nextBtnType}
              onClick={() => {
                handleStep('next');
              }}
            >
              下一步
              <RightOutlined
                style={{
                  fontSize: '10px',
                }}
              />
            </Button>
          </div>
        )}

        {/* {showSave && list.length > 0 && (
          <div className='handle-parent' style={btnStyle}>
            <div
              className='submit-primary'
              onClick={() => {
                onChange && onChange(formValues);
              }}
            >
              保存
            </div>
          </div>
        )} */}
      </Spin>
    </div>
  );
};

export default QuestionForm;

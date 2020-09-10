import React, { useState } from 'react';
import className from 'classnames';

import styles from './index.less';

type TabItem = {
  type: string;
  count: number;
};

interface Props {
  list: TabItem[];
  onChange?: (params: any) => void;
}
function MyTabs(props: Props) {
  const { list, onChange } = props;
  const [currentSelected, setCurrentSelected] = useState(0);

  const gotoList = (item: TabItem, index: number) => {
    setCurrentSelected(index);
    onChange && onChange(item);
  };
  return (
    <div className={styles['result-type']}>
      {list.map((item: TabItem, index: number) => {
        return (
          <div
            className={className(styles['result-match-item'], {
              [styles['selected']]: currentSelected === index,
            })}
            // className={styles['result-match-item']}
            key={'item' + index}
            onClick={() => gotoList(item, index)}
          >
            {item.type}({item.count})
          </div>
        );
      })}
    </div>
  );
}

export default MyTabs;

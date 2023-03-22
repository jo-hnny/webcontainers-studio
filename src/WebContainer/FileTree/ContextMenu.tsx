import {
  ControlledMenu,
  ControlledMenuProps,
  MenuItem,
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { Input, Modal } from 'antd';
import { useState } from 'react';
import { WebContainerNP } from '../constants';

interface IContextMenuProps {
  targetType: WebContainerNP.TargetTypeEnum;
  anchorPoint: ControlledMenuProps['anchorPoint'];
  isOpen: boolean;
  onClose: ControlledMenuProps['onClose'];
  onClick: (actionType: WebContainerNP.ActionTypeEnum, name: string) => void;
}

export function ContextMenu({
  anchorPoint,
  targetType,
  isOpen,
  onClose,
  onClick,
}: IContextMenuProps) {
  const [actionType, setActionType] = useState<WebContainerNP.ActionTypeEnum>(
    WebContainerNP.ActionTypeEnum.Create_File
  );
  const [visible, setVisible] = useState(false);

  const [name, setName] = useState('');

  function handleClick(actionType: WebContainerNP.ActionTypeEnum) {
    return () => {
      setActionType(actionType);
      setVisible(true);
    };
  }

  function handleCancel() {
    setName('');

    setVisible(false);
  }

  function handleOk() {
    onClick(actionType, name);

    handleCancel();
  }

  const modal4actionType = {
    [WebContainerNP.ActionTypeEnum.Create_File]: '请确认新文件的名称！',

    [WebContainerNP.ActionTypeEnum.Create_Dir]: '请确认新文件夹的名称！',

    [WebContainerNP.ActionTypeEnum.Del]: '确认删除吗？',

    [WebContainerNP.ActionTypeEnum.Rename]: '请确认新命名？',
  };

  return (
    <>
      <ControlledMenu
        anchorPoint={anchorPoint}
        state={isOpen ? 'open' : 'closed'}
        onClose={onClose}
      >
        {WebContainerNP.menuOptionsMap[targetType].map(({ value, text }) => (
          <MenuItem key={value} onClick={handleClick(value)}>
            {text}
          </MenuItem>
        ))}
      </ControlledMenu>

      <Modal
        open={visible}
        title={modal4actionType[actionType]}
        okButtonProps={{
          disabled:
            [
              WebContainerNP.ActionTypeEnum.Rename,
              WebContainerNP.ActionTypeEnum.Create_Dir,
              WebContainerNP.ActionTypeEnum.Create_File,
            ].includes(actionType) && name.length < 1,
        }}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {[
          WebContainerNP.ActionTypeEnum.Create_File,
          WebContainerNP.ActionTypeEnum.Create_Dir,
          WebContainerNP.ActionTypeEnum.Rename,
        ].includes(actionType) && (
          <Input value={name} onChange={e => setName(e?.target?.value)} />
        )}
      </Modal>
    </>
  );
}

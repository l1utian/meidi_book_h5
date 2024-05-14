import { Picker } from "@nutui/nutui-react";
import "./index.scss";

const GoodModal = ({
  visible,
  value,
  onClose,
  onConfirm,
  onChange,
  options,
}) => {
  const confirmPicker = (_options: any[], values: (string | number)[]) => {
    onConfirm(values);
  };

  return (
    <Picker
      className="time-select-modal"
      title="选择上门时间"
      visible={visible}
      options={options}
      onClose={onClose}
      value={value}
      onConfirm={confirmPicker}
      onChange={onChange}
    />
  );
};
export default GoodModal;

import { Picker } from "@nutui/nutui-react";
import "./index.scss";

interface PickerOption {
  text: string | number;
  value: string | number;
  disabled?: boolean;
  children?: PickerOption[];
  className?: string | number;
}
const SelectTimeModal = ({
  visible,
  value,
  onClose,
  onConfirm,
  onChange,
  options,
}) => {
  const confirmPicker = (
    _options: PickerOption[],
    values: (string | number)[]
  ) => {
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
      onConfirm={(list, values) => confirmPicker(list, values)}
      onChange={onChange}
    />
  );
};
export default SelectTimeModal;

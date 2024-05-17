import { useState, useMemo, useEffect } from "react";
import { Picker } from "@nutui/nutui-react";
import { useRequest } from "ahooks";
import { postOrderAppointmentTimeList } from "@/api";
import "./index.scss";

interface PickerOption {
  text: string | number;
  value: string | number;
  disabled?: boolean;
  children?: PickerOption[];
  className?: string | number;
}
const SelectTimeModal = ({ visible, value, onClose, onConfirm, code }) => {
  const [appointmentDateChange, setAppointmentDateChange] =
    useState<string>("");
  const [appointmentTimeChange, setAppointmentTimeChange] =
    useState<string>("");

  useEffect(() => {
    if (visible && code) {
      run({ code });
    }
  }, [visible, code]);

  const handleConfirm = (
    _options: PickerOption[],
    values: (string | number)[]
  ) => {
    onConfirm([
      values?.[0] || appointmentDateChange,
      values?.[1] || appointmentTimeChange,
    ]);
  };

  // 可预约时间
  const { data: allAppointmentTimeData, run } = useRequest(
    postOrderAppointmentTimeList,
    {
      manual: true,
      onSuccess: (res) => {
        if (res?.code === 200) {
          setAppointmentDateChange(res.data[0]?.subDate);
          setAppointmentTimeChange(res?.data[0]?.details?.[0]);
        }
      },
    }
  );

  const handleChangeTime = (_obj, value) => {
    if (value?.[0]) {
      setAppointmentDateChange(value[0]);
      const details = allAppointmentTimeData?.data?.find(
        (v) => v?.subDate === value[0]
      )?.details;
      setAppointmentTimeChange(details?.[0] ?? "");
    }
  };
  // 预约日期列表
  const appointmentDateList = useMemo(() => {
    return (
      allAppointmentTimeData?.data?.map((v) => {
        return {
          text: v?.subDate,
          value: v?.subDate,
        };
      }) ?? []
    );
  }, [allAppointmentTimeData?.data]);

  // 预约时间段表
  const appointmentTimeList = useMemo(() => {
    return (
      allAppointmentTimeData?.data
        ?.find((v) => v?.subDate === appointmentDateChange)
        ?.details?.map((v) => ({
          text: v,
          value: v,
        })) ?? []
    );
  }, [allAppointmentTimeData?.data, appointmentDateChange]);

  return (
    <Picker
      className="time-select-modal"
      options={[appointmentDateList, appointmentTimeList]}
      title="选择上门时间"
      visible={visible}
      onClose={onClose}
      value={value}
      onConfirm={(list, values) => handleConfirm(list, values)}
      onChange={handleChangeTime}
    />
  );
};
export default SelectTimeModal;

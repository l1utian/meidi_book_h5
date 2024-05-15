import { useState, useMemo } from "react";
import { Input, TextArea, Button, Cascader } from "@nutui/nutui-react";
import { ArrowRight } from "@nutui/icons-react";
import useAddress from "@/hooks/useAddress";
import { formatLocation } from "@/utils/tool";
import SelectTimeModal from "@/components/SelectTimeModal";
import { useRequest } from "ahooks";
import { postOrderAppointmentTimeList } from "@/api";
import { Toast } from "@nutui/nutui-react";
import "./App.scss";

const App = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [timeVisible, setTimeVisible] = useState<boolean>(false);

  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [appointmentTime, setAppointmentTime] = useState<string>("");
  const [appointmentDateChange, setAppointmentDateChange] =
    useState<string>("");
  const [appointmentTimeChange, setAppointmentTimeChange] =
    useState<string>("");

  // 可预约时间
  const { data: allAppointmentTimeData } = useRequest(
    postOrderAppointmentTimeList,
    {
      defaultParams: [{ code: "1" }],
      onSuccess: (res) => {
        if (res?.code === 200) {
          setAppointmentDateChange(res.data[0]?.subDate);
          setAppointmentTimeChange(res?.data[0]?.details?.[0]);
        }
      },
    }
  );

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

  const handleSelect = (value: [string, string]) => {
    setAppointmentDate(value[0] || appointmentDateChange);
    setAppointmentTime(value[1] || appointmentTimeChange);
  };

  const { formState, handleChange, handleAddressChange, validate, handleLoad } =
    useAddress();

  const address = useMemo(() => {
    return formState?.province
      ? formatLocation(
          [
            formState.province,
            formState.city,
            formState.county,
            formState.street,
          ],
          " "
        )
      : "请选择";
  }, [formState]);

  const handleSave = () => {
    validate()
      .then((res) => {
        // if (res?.data) {
        //   console.log(res?.data);
        // }
        console.log(res);
      })
      ?.catch((err) => {
        if (err?.message) {
          Toast.show({
            content: err?.message,
            icon: "fail",
          });
        }
      });
  };

  const handleChangeTime = (_obj, value) => {
    if (value?.[0]) {
      setAppointmentDateChange(value[0]);
      const details = allAppointmentTimeData?.data?.find(
        (v) => v?.subDate === value[0]
      )?.details;
      setAppointmentTimeChange(details?.[0] ?? "");
    }
  };
  return (
    <>
      <div className="addAddress">
        <div className="addAddress-input">
          <span className="addAddress-input-label">联系人</span>
          <Input
            placeholder="请输入"
            align="right"
            maxLength={25}
            onChange={(value) => handleChange("name", value)}
          />
        </div>
        <div className="addAddress-input">
          <span className="addAddress-input-label">联系电话</span>
          <Input
            placeholder="请输入"
            align="right"
            type="digit"
            maxLength={11}
            onChange={(value) => handleChange("tel", value)}
          />
        </div>
        <div className="addAddress-input" onClick={() => setVisible(true)}>
          <span className="addAddress-input-label">所在地区</span>
          <div className="addAddress-input-value">
            <span className="addAddress-input-label">{address}</span>
            <ArrowRight />
          </div>
        </div>
        <div className="mb-12">
          <TextArea
            onChange={(value) => handleChange("addressDetail", value)}
            placeholder="详细地址"
            maxLength={64}
          />
        </div>

        <div className="addAddress-input" onClick={() => setTimeVisible(true)}>
          <span className="addAddress-input-label">期望上门时间</span>
          <div className="addAddress-input-value">
            <span className="addAddress-input-label">
              {appointmentDate && appointmentTime
                ? `${appointmentDate} ${appointmentTime}`
                : "请选择"}
            </span>
            <ArrowRight />
          </div>
        </div>

        <Button block type="primary" onClick={handleSave} loading={false}>
          立即预约
        </Button>
        <Cascader
          visible={visible}
          title="详细地址"
          closeable
          onClose={() => setVisible(false)}
          onChange={handleAddressChange}
          lazy
          onLoad={handleLoad}
        />
        <SelectTimeModal
          options={[appointmentDateList, appointmentTimeList]}
          visible={timeVisible}
          value={[appointmentDate, appointmentTime]}
          onConfirm={handleSelect}
          onChange={handleChangeTime}
          onClose={() => setTimeVisible(false)}
        />
      </div>
    </>
  );
};

export default App;

import { useState, useMemo, useEffect } from "react";
import { Input, TextArea, Button, Cascader } from "@nutui/nutui-react";
import { ArrowRight } from "@nutui/icons-react";
import useBookForm from "@/hooks/useBookForm";
import { getOrderInfo } from "@/api";
import { formatLocation } from "@/utils/tool";
import SelectTimeModal from "@/components/SelectTimeModal";
import { Toast } from "@nutui/nutui-react";
import { useParams } from "react-router-dom";
import "./index.scss";

const Book = () => {
  const [orderInfo, setOrderInfo] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [selectTimeVisible, setSelectTimeVisible] = useState<boolean>(false);
  const { code } = useParams() || {
    code: null,
  };
  const {
    formState,
    handleChange,
    handleAddressChange,
    validate,
    handleLoad,
    handleAppointmentTime,
  } = useBookForm({ code });

  const handleSelect = (value: [string, string]) => {
    handleAppointmentTime(value[0], value[1]);
  };

  useEffect(() => {
    if (code) {
      getOrderInfo({ code }).then((res) => {
        if (res?.code === 200) {
          setOrderInfo(res?.data);
        } else {
          Toast.show({
            content: res?.msg,
            icon: "fail",
            duration: 0,
            closeOnOverlayClick: false,
            style: {
              background: "rgba(0, 0, 0, 0.7)",
            },
          });
        }
      });
    } else {
      Toast.show({
        content: "未获取到预约编码",
        icon: "fail",
        duration: 0,
        closeOnOverlayClick: false,
        style: {
          background: "rgba(0, 0, 0, 0.7)",
        },
      });
    }
  }, [code]);

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

        <div
          className="addAddress-input"
          onClick={() => setSelectTimeVisible(true)}
        >
          <span className="addAddress-input-label">期望上门时间</span>
          <div className="addAddress-input-value">
            <span className="addAddress-input-label">
              {formState?.appointmentDate && formState?.appointmentTime
                ? `${formState?.appointmentDate} ${formState?.appointmentTime}`
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
          code="121212"
          visible={selectTimeVisible}
          value={[formState?.appointmentDate, formState?.appointmentTime]}
          onConfirm={handleSelect}
          onClose={() => setSelectTimeVisible(false)}
        />
      </div>
    </>
  );
};

export default Book;

import { useState, useMemo } from "react";
import {
  Input,
  TextArea,
  Button,
  Cascader,
  Dialog,
  NavBar,
  Image,
} from "@nutui/nutui-react";
import { ArrowRight } from "@nutui/icons-react";
import useBookForm from "@/hooks/useBookForm";
import { getOrderInfo, postSubmitOrder } from "@/api";
import { formatLocation } from "@/utils/tool";
import SelectTimeModal from "@/components/SelectTimeModal";
import { Toast } from "@nutui/nutui-react";
import { useParams } from "react-router-dom";
import { useRequest, useDebounceEffect } from "ahooks";
import Logo from "@/assets/logo.png";
import "./index.scss";

const Book = () => {
  const [orderInfo, setOrderInfo] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [selectTimeVisible, setSelectTimeVisible] = useState<boolean>(false);
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  const { code } = useParams() || {
    code: null,
  };

  // 获取订单详情
  const { runAsync, refresh } = useRequest(getOrderInfo, {
    manual: true,
  });
  // 提交预约
  const { runAsync: postRun } = useRequest(postSubmitOrder, {
    manual: true,
  });
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

  useDebounceEffect(
    () => {
      if (code) {
        runAsync({ code }).then((res) => {
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
    },
    [code],
    {
      wait: 500,
    }
  );

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
      .then(() => {
        setConfirmVisible(true);
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

  const handleConfirm = async () => {
    await postRun({
      ...(formState as any),
      code,
    }).then((res) => {
      if (res?.code === 200) {
        setConfirmVisible(false);
        Toast.show({
          content: "预约成功，以网点预约上门时间为准",
          icon: "success",
        });
        refresh();
      } else {
        Toast.show({
          content: res?.msg,
          icon: "fail",
        });
      }
    });
  };

  return (
    <>
      <NavBar titleAlign="center" left={<Image src={Logo} width="30px" />}>
        美的洗悦家预约
      </NavBar>
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
        {/* 提交成功后，刷新订单详情，若为服务中状态。不可再次预约 */}
        <Button
          block
          type="primary"
          onClick={handleSave}
          disabled={orderInfo?.orderStatus === 202}
          size="large"
        >
          立即预约
        </Button>
        <Cascader
          visible={visible}
          title="详细地址"
          closeable
          onClose={() => setVisible(false)}
          onChange={handleAddressChange}
          lazy={true}
          onLoad={handleLoad}
        />
        <SelectTimeModal
          code={code}
          visible={selectTimeVisible}
          value={[formState?.appointmentDate, formState?.appointmentTime]}
          onConfirm={handleSelect}
          onClose={() => setSelectTimeVisible(false)}
        />
        <Dialog
          title="提示"
          closeOnOverlayClick={false}
          onConfirm={handleConfirm}
          visible={confirmVisible}
          onCancel={() => setConfirmVisible(false)}
        >
          具体上门服务时间以工程师电话预约为准
        </Dialog>
      </div>
    </>
  );
};

export default Book;

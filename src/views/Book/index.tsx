import { useState, useMemo, useEffect } from "react";
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
import { useRequest } from "ahooks";
import { orderStatusText } from "@/constants";
import Logo from "@/assets/logo.png";
import "./index.scss";

const style = {
  background: "rgba(0, 0, 0, 0.5)",
};
const showErrorToast = (content, duration = 0, closeOnOverlayClick = false) => {
  Toast.show({
    content,
    icon: "fail",
    duration,
    closeOnOverlayClick,
    style,
  });
};

const Book = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [selectTimeVisible, setSelectTimeVisible] = useState<boolean>(false);
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
  const { code } = useParams() || {
    code: null,
  };

  // 获取订单详情
  const { runAsync } = useRequest(getOrderInfo, {
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

  useEffect(() => {
    if (code) {
      runAsync({ code })
        .then((res) => {
          if (res?.code === 200) {
            if (res?.data?.orderStatus === 201) {
              setSubmitDisabled(false);
              return;
            }
            showErrorToast(
              `该订单${
                orderStatusText[res?.data?.orderStatus] || "不在可预约状态内"
              }`
            );
          } else {
            showErrorToast(res?.msg || "获取订单信息失败");
          }
        })
        ?.catch((err) => {
          if (err?.message) {
            showErrorToast("服务器错误，请稍后再试");
          }
        });
    } else {
      showErrorToast("未获取到预约编码");
    }

    return () => {
      Toast.clear();
      setSubmitDisabled(true);
    };
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
      .then(() => {
        setConfirmVisible(true);
      })
      ?.catch((err) => {
        if (err?.message) {
          Toast.show({
            content: err?.message,
            icon: "fail",
            style,
          });
        }
      });
  };

  const handleConfirm = async () => {
    await postRun({
      ...(formState as any),
      code,
    })
      .then((res) => {
        if (res?.code === 200) {
          setConfirmVisible(false);
          setSubmitDisabled(true);
          Toast.show({
            content: "预约成功，以网点预约上门时间为准",
            icon: "success",
            duration: 0,
            closeOnOverlayClick: false,
            style,
          });
        } else {
          Toast.show({
            content: res?.msg || "预约失败",
            icon: "fail",
            style,
          });
        }
      })
      ?.catch((err) => {
        if (err?.message) {
          Toast.show({
            content: err?.message,
            icon: "fail",
            style,
          });
        }
      });
  };

  return (
    <>
      <NavBar titleAlign="center" left={<Image src={Logo} width="40" />}>
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
            <ArrowRight width={12} />
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
            <ArrowRight width={12} />
          </div>
        </div>
        {/* 提交成功后，刷新订单详情，若为服务中状态。不可再次预约 */}
        <Button
          block
          type="primary"
          onClick={handleSave}
          disabled={submitDisabled}
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

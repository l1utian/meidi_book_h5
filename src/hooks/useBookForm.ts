import { getAvailableAddressList } from "@/api";
import { isValidChineseEnglishInput } from "@/utils/tool";
import { useSetState, useRequest } from "ahooks";

interface FormState {
  name: string;
  tel: string;
  province: string;
  provinceCode: number;
  city: string;
  cityCode: number;
  county: string;
  countyCode: number;
  street: string;
  streetCode: number;
  addressDetail: string;
  appointmentDate?: string;
  appointmentTime?: string;
}

const setAddressList = (data, leaf = false) => {
  return data?.map((v) => {
    return {
      value: v?.regName,
      text: v?.regName,
      id: v?.regionId,
      leaf,
    };
  });
};

const useAddress = ({ code }) => {
  const [formState, setFormState] = useSetState<FormState>({
    name: "",
    tel: "",
    province: "",
    provinceCode: 0,
    city: "",
    cityCode: 0,
    county: "",
    countyCode: 0,
    street: "",
    streetCode: 0,
    addressDetail: "",
    appointmentDate: "",
    appointmentTime: "",
  });

  // 可预约时间
  const { runAsync } = useRequest(getAvailableAddressList, {
    manual: true,
    debounceWait: 500,
  });

  const handleChange = (key: string, value: any) => {
    setFormState({ [key]: value } as any);
  };

  const handleAddressChange = (_selectValue: unknown, value: any) => {
    const [province, city, county, street] = value;
    setFormState({
      province: province?.text,
      provinceCode: province?.id,
      city: city?.text,
      cityCode: city?.id,
      county: county?.text,
      countyCode: county?.id,
      street: street?.text,
      streetCode: street?.id,
    });
  };

  const validate = () => {
    return new Promise((resolve, reject) => {
      const {
        name,
        tel,
        province,
        city,
        county,
        street,
        addressDetail,
        appointmentDate,
        appointmentTime,
      } = formState;
      if (!name) {
        reject({
          status: "error",
          message: "请填写姓名",
        });
      }
      if (!isValidChineseEnglishInput(name)) {
        reject({
          status: "error",
          message: "姓名只能包含中文或英文字母",
        });
      }
      if (!tel) {
        reject({
          status: "error",
          message: "请填写手机号码",
        });
      }
      if (!/^1[3-9]\d{9}$/g.test(tel)) {
        reject({
          status: "error",
          message: "手机号码格式不正确",
        });
      }
      if (!province || !city || !county || !street) {
        reject({
          status: "error",
          message: "请选择所在地区",
        });
      }
      if (!addressDetail) {
        reject({
          status: "error",
          message: "请填写详细地址",
        });
      }
      if (!appointmentDate || !appointmentTime) {
        reject({
          status: "error",
          message: "请选择上门时间",
        });
      }
      resolve({
        status: "success",
        message: "校验通过",
        data: formState,
      });
    });
  };

  const handleLoad = (node, resolve): any => {
    console.log("123");
    if (node && node.root) {
      if (code) {
        runAsync({
          regionId: "",
          code,
        })?.then((res) => {
          if (res?.code === 200) {
            resolve(setAddressList(res?.data));
          }
        });
      }
    } else {
      const { id, level } = node;
      runAsync({
        code,
        regionId: id,
      })?.then((res) => {
        if (res?.code === 200) {
          resolve(setAddressList(res?.data, level >= 4));
        }
      });
    }
  };

  const handleAppointmentTime = (appointmentDate, appointmentTime) => {
    setFormState({
      appointmentDate,
      appointmentTime,
    });
  };
  return {
    formState,
    setFormState,
    handleChange,
    handleAddressChange,
    validate,
    handleLoad,
    handleAppointmentTime,
  };
};
export default useAddress;

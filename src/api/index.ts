import axios from "axios";

const BASE_API_URL = import.meta.env.API_BASE_URL;

//【H5预约】获取订单信息
export const getOrderInfo = async (params: { code: string }): Promise<any> => {
  const response = await axios.post(
    `${BASE_API_URL}/book/getOrderInfo`,
    params
  );
  return response.data;
};

//【H5预约】可用地址列表
export const getAvailableAddressList = async (params: {
  regionId: string;
  code: string;
}): Promise<any> => {
  const response = await axios.post(`${BASE_API_URL}/book/areaList`, params);
  return response.data;
};

//【H5预约】可预约时间
export const postOrderAppointmentTimeList = async (params: {
  code: string;
}): Promise<any> => {
  const response = await axios.post(
    `${BASE_API_URL}/book/appointmentTimeList`,
    params
  );
  return response.data;
};

// 【H5预约】提交预约
export const postSubmitOrder = async (params: {
  code: string; // 订单编码
  tel: string; // 联系号码
  name: string; // 联系人
  province: string; // 省份
  provinceCode: string; // 省份编码
  city: string; // 城市
  cityCode: string; // 城市编码
  county: string; //区
  countyCode: string; //区编码
  street: string; // 街道
  streetCode: string; // 街道编码
  addressDetail: string; // 详细地址
  appointmentDate: string; // 预约日期
  appointmentTime: string; // 预约时间
  message: string; // 备注
}): Promise<any> => {
  const response = await axios.post("/book/submitOrder", params);
  return response.data;
};

import axios from "axios";
const BASE_API_URL = import.meta.env.API_BASE_URL;
//【H5预约】获取订单信息
export const getOrderInfo = async (params: { code: string }): Promise<any> => {
  const response = await axios.post(
    `${BASE_API_URL}/book/areaList/book/getOrderInfo`,
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
  const response = await axios.post("/book/appointmentTimeList", params);
  return response.data;
};

// 【H5预约】提交预约
export const submitOrder = async (params: {
  code: string;
  tel: string;
  name: string;
  province: string;
  city: string;
  county: string;
  street: string;
  addressDetail: string;
  provinceCode: string;
  cityCode: string;
  streetCode: string;
  appointmentDate: string;
  appointmentTime: string;
  message: string;
}): Promise<any> => {
  const response = await axios.post("/book/submitOrder", params);
  return response.data;
};

/*
 * @Date: 2023-04-15 23:52:22
 * @Description: 404页面
 * @LastEditors: Aaron Su
 * @LastEditTime: 2023-04-16 15:30:49
 */
import { Empty, Image } from "@nutui/nutui-react";
import Logo from "@/assets/logo.png";
import "./index.scss";

const NotFound = () => {
  return (
    <div className="not-found">
      <Empty
        image={<Image src={Logo} />}
        description={<div className="title">页面不存在</div>}
        size="small"
      />
    </div>
  );
};

export default NotFound;

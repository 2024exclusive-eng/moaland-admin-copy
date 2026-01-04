/* eslint-disable multiline-ternary */
import moment from "moment/moment";

// ** Reactstrap Imports
import { Card, Input, Label } from "reactstrap";

// ** Styles
import "./userInfo.scss";

const UserInfo = ({ data }) => {
  return (
    <Card className="user-info-card">
      <div className="card-content">
        <h4 className="card-title">기본 정보</h4>

        <div className="info-table">
          <div className="info-row">
            <div className="info-label">구분</div>
            <div className="info-value">
              {!data?.oauthType ? "일반회원" : "LINE 회원"}
            </div>
          </div>
          <div className="info-row">
            <div className="info-label">회원번호</div>
            <div className="info-value">{data?.id || "-"}</div>
          </div>
          <div className="info-row">
            <div className="info-label">가입 이메일</div>
            <div className="info-value">{data?.email || "-"}</div>
          </div>
          <div className="info-row">
            <div className="info-label">가입일</div>
            <div className="info-value">
              {data?.created
                ? moment(data?.created).format("YYYY년 MM월 DD일")
                : "-"}
            </div>
          </div>
          <div className="info-row">
            <div className="info-label">탈퇴일</div>
            <div className="info-value">
              {data?.deleted
                ? moment(data?.deleted).format("YYYY년 MM월 DD일")
                : "-"}
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <h4 className="card-title">약관 동의</h4>

        <div className="agreements-section">
          <div className="agreement-item">
            <div className="form-check form-switch">
              <Label for="exampleCustomSwitch" className="form-check-label">
                (필수) 서비스 이용약관 동의
              </Label>
              <Input
                type="switch"
                name="customSwitch"
                id="exampleCustomSwitch"
                checked
                disabled
              />
            </div>
          </div>
          <div className="agreement-item">
            <div className="form-check form-switch">
              <Label for="exampleCustomSwitch2" className="form-check-label">
                (필수) 개인정보 수집 및 이용 동의
              </Label>
              <Input
                type="switch"
                name="customSwitch2"
                id="exampleCustomSwitch2"
                checked
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserInfo;

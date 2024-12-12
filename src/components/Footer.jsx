import images from '../constants/images'
import Seperator from './Seperator'
import { IonIcon } from '@ionic/react'
import { logoLinkedin } from 'ionicons/icons'
import { logoTwitter } from 'ionicons/icons'
import { logoInstagram} from 'ionicons/icons'
import { logoFacebook } from 'ionicons/icons'
// import { BiBorderLeft } from 'react-icons/bi'

const Footer = () => {
  return (
    <div className="footer_container" style={{padding: '22px 145px 0 145px'}}>
      <Seperator height={30} />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          padding: "0 16px 0 16px",
        }}
      >
        <div className="navbar-logo">
          <div className="logo-icon">FM</div>
          <span className="logo-text">Fix Me</span>
        </div>
      </div>
      <Seperator height={20} />
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "flex-start",
          borderBottom: ".5px solid #D3D3D3",
          padding: "0 0 32px 0",
        }}
      >
        <div style={{ width: "276px", padding: "0 32px 0 16px" }}>
          <p style={{ fontWeight: "600", fontSize: 20, textAlign: "left" }}>
            Company
          </p>
          {/* <Seperator height={5} /> */}
          <div>
            <p
              className="cursor"
              style={{ color: "#545454", cursor: "pointer", textAlign: "left" }}
            >
              About us
            </p>
            <p
              className="cursor"
              style={{ color: "#545454", cursor: "pointer", textAlign: "left" }}
            >
              Terms & conditions{" "}
            </p>
            <p
              className="cursor"
              style={{ color: "#545454", cursor: "pointer", textAlign: "left" }}
            >
              Privacy policy{" "}
            </p>
            <p
              className="cursor"
              style={{ color: "#545454", cursor: "pointer", textAlign: "left" }}
            >
              Anti-discrimination policy{" "}
            </p>
            <p
              className="cursor"
              style={{ color: "#545454", cursor: "pointer", textAlign: "left" }}
            >
              UC impact{" "}
            </p>
            <p
              className="cursor"
              style={{ color: "#545454", cursor: "pointer", textAlign: "left" }}
            >
              Careers
            </p>
          </div>
        </div>
        <div style={{ width: "276px", padding: "0 32px 0 16px" }}>
          <p style={{ fontWeight: "600", fontSize: 20 }}>For customers</p>
          {/* <Seperator height={15} /> */}
          <div>
            <p
              style={{
                color: "#545454",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              UC reviews{" "}
            </p>
            <p
              style={{
                color: "#545454",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              Categories near you{" "}
            </p>
            <p
              style={{
                color: "#545454",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              Blog{" "}
            </p>
            <p
              style={{
                color: "#545454",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              Contact us{" "}
            </p>
          </div>
        </div>
        <div style={{ width: "276px", padding: "0 32px 0 16px" }}>
          <p style={{ fontWeight: "600", fontSize: 20 }}>For partners</p>
          {/* <Seperator height={15} /> */}
          <div>
            <p
              style={{
                color: "#545454",
                cursor: "pointer",
              }}
            >
              Register as a professional{" "}
            </p>
          </div>
        </div>
        <div style={{ width: "276px", padding: "0 32px 0 16px" }}>
          <p style={{ fontWeight: "600", fontSize: 20 }}>Social links</p>
          {/* <Seperator height={15} /> */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "210px",
            }}
          >
            <div
              style={{
                padding: 10,
                border: ".5px solid #D3D3D3",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "50%",
              }}
            >
              <IonIcon style={{ height: 25, width: 25 }} icon={logoTwitter} />
            </div>
            <Seperator width={10} />
            <div
              style={{
                padding: 10,
                border: ".5px solid #D3D3D3",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "50%",
              }}
            >
              <IonIcon style={{ height: 25, width: 25 }} icon={logoFacebook} />
            </div>
            <Seperator width={10} />
            <div
              style={{
                padding: 10,
                border: ".5px solid #D3D3D3",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "50%",
              }}
            >
              <IonIcon style={{ height: 25, width: 25 }} icon={logoInstagram} />
            </div>
            <Seperator width={10} />
            <div
              style={{
                padding: 10,
                border: ".5px solid #D3D3D3",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "50%",
              }}
            >
              <IonIcon style={{ height: 25, width: 25 }} icon={logoLinkedin} />
            </div>
          </div>
          <Seperator height={10} />
          <div style={{ display: "flex", justifyContent: "start" }}>
            <img
              style={{ height: 45}}
              src={images.APPSTORE_LOGO}
              alt=""
            />
          </div>
          <Seperator height={10} />
          <div style={{ display: "flex", justifyContent: "start" }}>
            <img
              style={{ height: 40 }}
              src={images.PLAYSTORE_LOGO}
              alt=""
            />
          </div>
        </div>
      </div>
      <Seperator height={10} />
      <div>
        <p style={{ fontSize: 12, color: "grey", textAlign: "left" }}>
          © Copyright 2024 Fix Mate. All rights reserved. | CIN:
          U74140DL2014PTC274413
        </p>
      </div>
      <Seperator height={20} />
    </div>
  );
}

export default Footer
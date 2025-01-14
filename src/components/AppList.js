import React from "react";
import image from "../assets/insta.png";

export const AppList = (props) => {
  const { box } = props;

  return (
    <>
      <div
        style={{
          position: "relative",
        }}
      >
        <div class="card">
          <div class="card-details">
            <div
              style={{
                padding: "0px 15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    margin: "auto",
                  }}
                >
                  <img
                    src={image}
                    alt="Instagram logo"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  ></img>
                </div>
                <div class="text-title">{box.moduleName}</div>
                <div class="text-body">
                  <div>Lorem ipsum lorem dollar sit amter container</div>
                </div>
              </div>

              <div className="apppublishtxt">
                <span className="apppublish">App published</span> | private
              </div>
            </div>

            <div className="card_sub_sec">
              <div class="left-column">
                <div className="heading">Owned by</div>
                <div className="textcontent">Zoho design</div>
              </div>

              <div class="right-column">
                <div className="heading">Modified on</div>
                <div className="textcontent">16 Dec 2023 10.00Am</div>
              </div>
            </div>
          </div>
        </div>
        <a class="card-button buttonDownload" href="#link">
          Install
        </a>
      </div>

      {/* <div className="cards">
            <img src={image} alt="Instagram logo" width="50" height="50"></img>
            <h2>{box.moduleName}</h2>
            <p>Lorem ipsum lorem dollar sit amter container</p>
            <div>
              <label>App published | private</label>
            </div>

            <div className="card_sub_sec">
              <div class="left-column">
                <div>Owned by</div>
                <div>Zoho design</div>
              </div>

              <div class="right-column">
                <div>Modified on</div>
                <div>16 Dec 2023 10.00Am</div>
              </div>
            </div>

            <button class="">Install</button>
          </div> */}

      {/* <div className="cards">
            <h2>Snapchat</h2>
            <p>Lorem ipsum lorem dollar sit amter containr</p>

            <button variant="contained">Install</button>
          </div>
          <div className="cards">
            <h2>Disney+Hotstar</h2>
            <p>Lorem ipsum lorem dollar sit amter containr</p>
            <button variant="contained">Install</button>
          </div>
          <div className="cards">
            <h2>Meesho</h2>
            <p>Lorem ipsum lorem dollar sit amter containr</p>
            <button variant="contained">Install</button>
          </div>
          <div className="cards">
            <h2>Flipkart</h2>
            <p>Lorem ipsum lorem dollar sit amter containr</p>
            <button variant="contained">Install</button>
          </div>
          <div className="cards">
            <h2>Amazon</h2>
            <p>Lorem ipsum lorem dollar sit amter containr</p>
            <button class="button-29" role="button">
              Button 29
            </button>
          </div> */}
    </>
  );
};

export default AppList;

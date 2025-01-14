import React from 'react';

export const InfoBox = (props) => {
  const {
    resObj
  } = props
  console.log(resObj, props);
  return (
    <div class="ag-courses_item">
      <div class="ag-courses-item_link">
        <div class="ag-courses-item_bg"></div>
        {resObj && resObj.map((item) => {
          return (
            <div className={`${resObj.length == 1 ? "w-100" : ""} ag-courses-b`}>
              <div class="ag-courses-item_title">
                {item.title}
              </div>
              <div class="ag-courses-item_date-box">
                <span class="ag-courses-item_date">
                  {item.value}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const Credits = (props) => {
  let { credit_permit } = props
  const resObj = [
    {
      title: "Product Limits",
      value: `${props.credits_info.product_limit}`
    },
    {
      title: "Utilize Product Usage",
      value: `${props.credits_info.product_utilize}`
    },
  ]
  let PROD_UNLIMITED = [
    {
      title: "Product Limits",
      value: "UNLIMITED"
    }
  ]
  let PART_UNLIMITED = [
    {
      title: "Partner Limits",
      value: "UNLIMITED"
    }
  ]
  let PartnerLmt = [
    {
      title: "Partner Limits",
      value: `${props.credits_info.partner_limit}`
    }
  ]
  return (
    <div style={{
      padding: 30,
      paddingTop: 0,
      paddingBottom: 0
    }}>

      <div className='title'>Credits</div>
      <div className="credits-screen">
      {credit_permit.product && <>
        {props.credits_info.is_product_limit == "Y" ?
          <>
            <InfoBox
              resObj={resObj}
            />
          </> :
          <>
            <InfoBox
              resObj={PROD_UNLIMITED}
            />
          </>
        }
      </>}   
        {credit_permit.partner && <div>
          {props.credits_info.is_partner_limit && props.credits_info.is_partner_limit == "Y" ?
            <>
              <InfoBox
                resObj={PartnerLmt}
              />
            </> :
            <>
              <InfoBox
                resObj={PART_UNLIMITED}
              />
            </>
          }
        </div>}
      </div>
    </div>

  );
};

export default Credits;

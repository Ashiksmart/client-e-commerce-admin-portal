import React, { useEffect, useState, useMemo } from 'react'
import OutlinedTimeline from './TimeLine'
import { getToken } from '../../services/AppService'
import ServiceProxy from '../../services/serviceProxy'
import { Box, Button, Container, Stack } from '@mui/material'
import html2pdf from 'html2pdf.js'
import AppForm from '../../pages/AppForm'
import AppDrawer from '../../sections/@dashboard/app/AppDrawer'
import { updateProxy } from '../../../src/services/AppService'
import { CustomFieldhandel } from '../../../src/utils/CustomformStr'
import Constants from '../../constants'
import { ACCOUNT_INFO } from '../../constants/localstorage'

function convertPriceToWords(price) {
  // Split the price into dollars and cents.
  const dollars = Math.floor(price);
  const cents = Math.round((price - dollars) * 100);

  // Convert the dollars to words.
  const dollarsWords = convertNumberToWords(dollars);

  // Convert the cents to words.
  const centsWords = convertNumberToWords(cents);

  // Return the price in words.
  return `${dollarsWords} dollars and ${centsWords} cents`;
}

// Convert a number to words.
function convertNumberToWords(number) {
  const words = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen'
  ];

  const tensWords = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety'
  ];

  if (number === 0) {
    return 'Zero';
  }

  if (number < 20) {
    return words[number];
  }

  const digit = number % 10;
  const ten = Math.floor(number / 10);

  return `${tensWords[ten]} ${words[digit]}`;
}

const InvoiceContent = (props) => {
  const {
    orderInfo
  } = props
  console.log(orderInfo);
  let prodDtl = orderInfo[0].products
  let invDtl = orderInfo[0].order_details

  return (
    <>

      <div class="invoice-box">
        <table cellpadding="0" cellspacing="0">
          <tr class="top">
            <td colspan="6">
              <table>
                <tr>
                  <td class="title">
                    <img
                      src={ServiceProxy.localStorage.getItem(ACCOUNT_INFO).brand_logo}
                      style={{
                        width: "100%",
                        maxWidth: "200px"
                      }}
                      alt='invoice_image'
                    />
                  </td>

                  <td>
                    Invoice : {invDtl && invDtl?.id}<br />
                    Created: {invDtl && invDtl?.created_at}<br />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          {/* <tr class="information">
            <td colspan="4">
              <table>
                <tr>
                  <td>
                    Sparksuite, Inc.<br />
                    12345 Sunny Road<br />
                    Sunnyville, CA 12345
                  </td>

                  <td>
                    Acme Corp.<br />
                    John Doe<br />
                    john@example.com
                  </td>
                </tr>
              </table>
            </td>
          </tr> */}
          <tr class="information">
            <td colspan="7">

              <table>
                <tr>
                  <td>
                    <div style={{
                      fontWeight: 600
                    }}>
                      Billing Detail
                    </div>
                    {prodDtl && prodDtl[0]?.address_info?.billing?.name}<br />
                    {prodDtl && prodDtl[0]?.address_info?.billing?.mobile}<br />
                    {prodDtl && prodDtl[0]?.address_info?.billing?.address},<br />
                    {prodDtl && JSON.parse(prodDtl[0]?.address_info?.billing?.state)?.state_name},
                    {prodDtl && JSON.parse(prodDtl[0]?.address_info?.billing?.city)?.city_name}
                  </td>

                  <td>
                    <div style={{
                      fontWeight: 600
                    }}>
                      Shipping Detail
                    </div>
                    {prodDtl && prodDtl[0]?.address_info?.shipping?.name}<br />
                    {prodDtl && prodDtl[0]?.address_info?.shipping?.mobile}<br />
                    {prodDtl && prodDtl[0]?.address_info?.shipping?.address}, <br />
                    {prodDtl && JSON.parse(prodDtl[0]?.address_info?.shipping?.state)?.state_name},
                    {prodDtl && JSON.parse(prodDtl[0]?.address_info?.shipping?.city)?.city_name}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr class="heading">
            <td>Payment Method</td>

            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>{prodDtl && prodDtl[0]?.payment_method}</td>
          </tr>

          <tr class="details">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <tr class="heading">
            <td>Item</td>
            <td>Qty</td>
            <td>GST </td>
            <td style={{ textAlign: "right" }}>Unit Price</td>
            <td style={{ textAlign: "right" }}>Tax Amount</td>
            <td style={{ textAlign: "right" }}>Total Amount</td>
          </tr>
          {prodDtl && prodDtl.map((prodItem) => {
            return (
              <tr class="item">
                <td>{prodItem?.product_details?.details?.name}</td>
                <td>{prodItem?.product_details?.quantity}</td>
                <td>{prodItem?.pricecalculation?.gst?.gstPercent + '%'}</td>
                <td style={{ textAlign: "right" }}>{"₹" + prodItem?.pricecalculation?.product?.originalPrice}</td>
                <td style={{ textAlign: "right" }}>{"₹" + prodItem?.pricecalculation?.gst?.totalGstAmount}</td>
                <td style={{ textAlign: "right" }}>{"₹" + prodItem?.pricecalculation?.product?.totalDiscountedPriceWithTax}</td>
              </tr>
            )
          })}

          <tr class="heading">
            <td>Total Tax</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td style={{ textAlign: "right" }}>{invDtl && "₹" + invDtl?.billdetails.totalprice}</td>
          </tr>
          <tr class="heading">
            <td>Sub Total</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td style={{ textAlign: "right" }}>{invDtl && "₹" + invDtl?.billdetails.grandtotal}</td>
          </tr>
          <tr class="heading">
            <td>Total</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td style={{ textAlign: "right" }}>{invDtl && "₹" + invDtl?.billdetails.totalprice}</td>
          </tr>
          {/* <tr class="heading">
            <td>{convertPriceToWords(invDtl && invDtl?.billdetails.totalprice)}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr> */}
          <tr class="heading">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td style={{ textAlign: "right" }}><div>
              For:
              <div>
                {prodDtl[0]?.product_details?.supplierDetails?.name}
              </div>
              <div>
                {prodDtl[0]?.product_details?.supplierDetails?.email}
                {prodDtl[0]?.product_details?.supplierDetails?.phone_number}
              </div>
              <div>
                {prodDtl[0]?.product_details?.supplierDetails?.address}
              </div>
            </div></td>
          </tr>
          <tr class="heading">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Authorized Signatory</td>
          </tr>
        </table>
      </div>
    </>
  )
}

const renderValue = (key, value, printArr) => {
  console.log(key, value);

  if (key === "attributes") {
    return value.map((item, index) => (
      <>
        <Stack className='crm_dtl_box' key={`${key}_${index}`}>
          <div className='crm_dtl_lft'>
            {item.name}:
          </div>
          <div className='crm_dtl_rgt'>
            {item.isColor ?
              <div style={{
                backgroundColor: `${item.value}`,
                width: "30px",
                height: "30px",
                borderRadius: "100%",
                border: "2px solid #f0f0f0",
                boxShadow: "0px 0px 0px 2px #333333"
              }}>
              </div>
              : item.value}
          </div>
        </Stack>
      </>
    ));
  }
  if (key === "image") {
    return (

      <Stack className='crm_dtl_box'>
        <div className='crm_dtl_lft'>
          Images
        </div>
        <Box sx={{
          width: "70%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "10px"
        }}>
          {value.map((item, index) => (
            <>
              <div key={`${key}_${index}`}>
                <img
                  className='sm_img'
                  src={`${Constants.BASE_URL_WOP}/${item.file_path.substring(14)}`}
                  alt="preview"
                />
              </div>
            </>
          ))}
        </Box>
      </Stack>
    )
  }
  // if (Array.isArray(value)) {
  //   return value.map((item, index) => (
  //     <Stack className='crm_dtl_box' key={`${key}_${index}`}>
  //       <div className='crm_dtl_lft'>
  //         {index}:
  //       </div>
  //       <div className='crm_dtl_rgt'>
  //         {item === undefined ? "-" : item}
  //       </div>
  //     </Stack>
  //   ));
  // }
  // else if (typeof value === 'object' && value !== null) {
  //   return Object.entries(value).map(([subKey, subValue]) => (
  //     <Stack className='crm_dtl_box' key={`${key}_${subKey}`}>
  //       <div className='crm_dtl_lft'>
  //         {subKey}:
  //       </div>
  //       <div className='crm_dtl_rgt'>
  //         {subValue === undefined ? "-" : subValue}
  //       </div>
  //     </Stack>
  //   ));
  // }
  else {
    return (
      <Stack className='crm_dtl_box' key={key}>
        <div className='crm_dtl_lft'>
          {key.replaceAll("_", " ")}:
        </div>
        <div className='crm_dtl_rgt'>
          {value === undefined ? "-" : value}
        </div>
      </Stack>
    );
  }

};

const renderDetails = (data, printArr) => {
  const details = data;

  console.log(details);

  return Object.entries(details).map(([key, value]) => (
    printArr.includes(key) ?
      <div style={{
        marginTop: "10px"
      }} key={key}>
        {renderValue(key, value)}
      </div>
      : ""
  ));
};


export default function OrderDetails(props) {
  const [getTimeline, setgetTimeline] = useState([])
  const [orderinfo, setorderinfo] = useState([])
  let [fieldDyanamicBind, setfieldDyanamicBind] = useState({})
  const [templateFlds, setTemplateFlds] = useState({})
  const [editteams, seteditteams] = useState({})
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [product_task, setproduct_task] = useState([])
  const [bindto, setbindto] = useState([])
  const [mode, setmode] = useState({
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    FILTER: 'filter',
    RESET: 'reset',
    APPROVAL: 'approval',
  })
  useEffect(() => {
    console.log(props.orderInfo)
    setorderinfo(props.orderInfo)
    if (props.orderInfo.length > 0) {
      fetchDataForProducts(props.orderInfo)
    }
  }, [props.orderInfo])

  useEffect(() => {
    // Additional logic can be added if needed when the component mounts
  }, [])
  const gettask = async (ids, invoice_id) => {
    let tasklog = await ServiceProxy.business.find(
      'b2b',
      'task_log',
      'view',
      props.screen === 'task'
        ? { id: { $eq: props.taskdetail.id } }
        : { invoice_id: { $eq: invoice_id } },
      [],
      null,
      null,
      [],
      [
        {
          model: 'user',
          bindAs: {
            name: 'user',
            value: 'first_name',
          },
          key: {
            foreign: 'user.user',
            primary: 'id',
          },
          fields: ['first_name'],
        },
      ],
    )

    return tasklog
  }
  const getWorkflow = async (ids, invoice_id) => {
    try {
      let fetchOrderId = await ServiceProxy.business.find(
        'b2b',
        'order_track',
        'view',
        { invoice_id: { $eq: invoice_id } },
        [],
        null,
        null,
      )
      let filter = {
        app_id: { $eq: ids },
        account_id: { $eq: getToken().account_id },
        page_type: { $eq: 'marketplace' },
      }
      if (
        fetchOrderId.records[fetchOrderId.records.length - 1].link_to === ''
      ) {
        filter.link_to = { $eq: '' }
        filter.link_type = { $eq: '' }
      } else {
        filter.link_to = {
          $eq: fetchOrderId.records[fetchOrderId.records.length - 1].link_to,
        }
        // filter.status_name={$eq: fetchOrderId.records[0].link_to}
      }
      let fetch = await ServiceProxy.business.find(
        'b2b',
        'workflow_status',
        'view',
        filter,
        [],
        null,
        null,
      )
      let workflowdata = []
      for (let i = 0; i < fetch.records.length; i++) {
        if (
          fetch.records[i].status_name ===
          fetchOrderId.records[fetchOrderId.records.length - 1].status
        ) {
          fetch.records[i].stage = true
        } else {
          fetch.records[i].stage = false
        }
        workflowdata.push(fetch.records[i])
      }
      return fetch.records.length > 0 ? workflowdata : []
    } catch (error) {
      console.error('Error fetching workflow status:', error)
      return []
    }
  }

  const fetchDataForProducts = async (orderInfo) => {
    if (props.taskpage) {
      let taskarr = []
      let bindarr = []
      const promises = orderInfo[0].products.map(async (data, index) => {
        let task = await gettask(data.category_id, data.id)

        if (task.records.length > 0) {
          bindarr.push(task.bind_to)
          taskarr.push(task.records)
        }
      })

      // Wait for all promises to resolve using Promise.all()
      await Promise.all(promises)
      console.log(bindarr[0], 'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu')
      setbindto(bindarr)
      setproduct_task(taskarr)
    } else {
      const promises = orderInfo[0].products.map((data, index) => {
        console.log(data, 'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu')
        return getWorkflow(data.category_id, data.id)
      })

      try {
        const results = await Promise.all(promises)
        setgetTimeline(results)
      } catch (error) {
        console.error('Error fetching data for products:', error)
        return []
      }
    }
  }

  let Openpopup = (TemplateApiFlds, value, temp_name) => {
    console.log(value, 'valuevaluevalue')
    if (temp_name === 'ASSIGNTEAMS') {
      seteditteams(value)
      setTemplateFlds(() => {
        return {
          ...TemplateApiFlds,
          initialValues: { teams: value.teams },
          action: temp_name,
          skipped: [],
          lazyDataApi: lazyDataApi,
        }
      })
    } else {
      seteditteams(value)
      setTemplateFlds(() => {
        return {
          ...TemplateApiFlds,
          initialValues: { user: value.user },
          action: temp_name,
          skipped: [],
          lazyDataApi: lazyDataApi,
        }
      })
    }

    setDrawerOpen(true)
  }
  let lazyDataApi = async (childmodel, parentmodel, parentvalue) => { }
  let action = async (data, type) => {
    if (type === 'ASSIGNTEAMS') {
      let teamname = fieldDyanamicBind.teams.filter((elm) => {
        if (elm.value == data.teams) {
          return elm
        }
      })

      let payload = {
        ...{
          id: editteams.id,
          additional_info: { team_name: teamname[0].name },
        },
        ...data,
      }
      delete payload.pricecalculation
      delete payload.updated_at
      delete payload.created_at
      delete payload.updated_by
      delete payload.created_by

      let Update = await updateProxy(payload, 'invoice')
      if (Update.modifiedCount > 0) {
        setDrawerOpen(false)
        seteditteams({})
        console.log(orderinfo.products)
        let setorderdata = orderinfo
        let arr = []
        for (let i = 0; i < setorderdata[0].products.length; i++) {
          const element = setorderdata[0].products[i]
          if (element.id === editteams.id) {
            element.teams = data.teams
            element.additional_info = { team_name: teamname[0].name }
          }
          arr.push(element)
        }
        setorderdata[0].products = arr
        setorderinfo(setorderdata)
      }
    } else {
      let payload = {
        id: editteams.id,
        user: data,
      }

      delete payload.updated_at
      delete payload.created_at
      delete payload.updated_by
      delete payload.created_by

      let Update = await updateProxy(payload, 'task_log')
      if (Update.modifiedCount > 0) {
        setDrawerOpen(false)
        seteditteams({})
        fetchDataForProducts(props.orderInfo)
      }
    }
  }
  let dynamicDropdownload = async (model, value, temp_name) => {
    if (model == 'onclick' && temp_name === 'ASSIGNTEAMS') {
      await ServiceProxy.business
        .find(
          'b2b',
          'teams',
          'view',
          {
            account_id: {
              $eq: getToken().account_id,
            },
            partner_id: {
              $eq: value[0].product_details.partner_id
            },
            app_id: {
              $eq: value[0].product_details.category_id,
            },
          },
          [],
          null,
          null,
        )
        .then((res) => {
          if (res.cursor.totalRecords > 0) {
            setfieldDyanamicBind((set) => {
              set.teams = res.records.map((elm) => {
                return {
                  name: elm.name,
                  value: elm.id,
                }
              })
              return set
            })
          }
        })
      await fetchtemplate(value[0], temp_name)
    } else if (model == 'onclick' && temp_name === 'ASSIGNMEMBER') {
      await ServiceProxy.business
        .find(
          'b2b',
          'user',
          'view',
          {
            id: {
              $in: props.employee.employee_id,
            },
          },
          [],
          null,
          null,
        )
        .then((res) => {
          if (res.cursor.totalRecords > 0) {
            setfieldDyanamicBind((set) => {
              set.user = res.records.map((elm) => {
                return {
                  id: elm.id,
                  name: elm.first_name,
                  value: elm.id,
                }
              })
              return set
            })
          }
        })
      await fetchtemplate(value[0], temp_name)
    }
  }
  let fetchtemplate = async (value, temp_name) => {
    try {
      let template = await ServiceProxy.business.find(
        'b2b',
        'template',
        'view',
        {
          name: {
            $in: [temp_name],
          },
        },
        [],
      )

      if (template.cursor.totalRecords == 1) {
        let sort = [
          {
            column: 'position',
            order: 'asc',
          },
        ]
        template.records.forEach(async (elm) => {
          let templatefields = await ServiceProxy.business.find(
            'b2b',
            'templates_field',
            'view',
            {
              template_id: { $eq: elm.id.toString() },
              account_id: { $eq: getToken().account_id },
            },
            [],
            null,
            null,
            sort,
          )

          if (templatefields.cursor.totalRecords > 0) {
            let templateData = templatefields.records

            if (elm.name == 'ASSIGNTEAMS' || elm.name === 'ASSIGNMEMBER') {
              CustomFieldhandel(
                templatefields.records,
                fieldDyanamicBind,
                '',
              ).then((res) => {
                Openpopup(
                  {
                    template: elm,
                    fields: res.field,
                  },
                  value,
                  elm.name,
                )
              })
            }
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
  let Assignuser = (data) => {
    dynamicDropdownload('onclick', data, 'ASSIGNMEMBER')
  }
  const Assignteam = (data) => {
    dynamicDropdownload('onclick', data, 'ASSIGNTEAMS')
  }
  const generatePdf = () => {
    // Get the content of the element you want to convert to PDF
    const element = document.getElementById('content-to-convert')

    // Define the options for html2pdf
    const options = {
      margin: 10,
      filename: orderinfo[0].order_details.id + '_invoice.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }

    // Use html2pdf to generate the PDF
    html2pdf(element, options)
  }
  return (
    <>
      <AppDrawer
        children={
          <AppForm
            formSchema={templateFlds}
            action={action}
            mode={mode}
            allObj={false}
          />
        }
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
      <Box sx={{
        maxWidth: "2500px",
        margin: "10px auto",
        padding: 3
      }}>
        {props.taskpage && (
          <>
            {product_task.length > 0 && (
              <>
                {product_task[0].map((data_, index) => {
                  let user = {}
                  if (typeof data_.user === 'string') {
                    user = JSON.parse(data_.user)
                  } else {
                    user = data_.user
                  }
                  return (
                    <div className='wbg'>
                      {' '}
                      {bindto[0][index].map((userdata, i) => {
                        return (
                          <>
                            <div className='btxt'>{userdata?.user}</div>
                          </>
                        )
                      })}
                      {props.screen !== "task" && <Button
                        onClick={() => Assignuser([data_])}
                        variant="contained"
                      >
                        Assign User
                      </Button>}
                      {renderDetails(data_, ["invoice_id", "name", "description"])}
                    </div>
                  )
                })}
              </>
            )}
            {product_task.length === 0 && <>no task</>}
          </>
        )}

        {orderinfo.length > 0 &&
          (props.taskpage === false || props.screen === 'task') && (
            <>
              <div className='wbg'>
                <div className='fr_ac'>
                  <div className='btxt'>Order Id :</div>
                  <div className='btxt'>{orderinfo[0].order_details.id}</div>
                </div>
              </div>

              <div className='wbg'>
                <h2>Product Details</h2>

                {orderinfo[0].products.map((data, index) => {
                  let add_info = {}
                  if (typeof data.additional_info === 'string') {
                    add_info = JSON.parse(data.additional_info)
                  } else {
                    add_info = data.additional_info
                  }

                  return (
                    <React.Fragment key={index}>

                      <div className='dtl_htxt'>Product detail - {index + 1}</div>
                      <Stack sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "15px",
                        borderBottom: "1px solid #e6e6e6",
                        marginBottom: 3,
                        padding: "5px 10px"
                      }}>
                        <Box sx={{
                          width: "50%",
                          borderRight: "1px solid #e4e4e4"
                        }}>
                          {renderDetails(data.product_details.details,
                            ["name", "brand", "description", "delivery_date", "offer_percent",
                              "attributes", "image"])}
                        </Box>

                        <Box sx={{
                          width: "50%",
                        }}>
                          {props.screen === 'orders' && (
                            <>
                              <Box sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                padding: "5px 10px",
                                paddingBottom: "15px",
                                borderBottom: "1px solid #e7e7e7"
                              }}>
                                <Box sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: "10px"
                                }}>
                                  <div className='btxt'>Team Name:</div>
                                  <div className='btxt cprim'>{add_info?.team_name}</div>
                                </Box>

                                <Button
                                  onClick={() => Assignteam([data])}
                                  variant="contained"
                                >
                                  Assign Team
                                </Button>
                              </Box>
                              <Box sx={{
                                padding: "15px 10px",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                              }}>
                                {getTimeline.length > 0 && (
                                  <OutlinedTimeline timelineData={getTimeline[index]} />
                                )}
                              </Box>
                            </>
                          )}
                        </Box>
                      </Stack>

                    </React.Fragment>
                  )
                })}

                {props.screen === 'orders' && (
                  <>
                    <Box>
                      <Stack sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: "5px 10px",
                        paddingBottom: "15px",
                        borderBottom: "1px solid #e7e7e7"
                      }}>
                        <div className='btxt'>Product Invoice</div>
                        <Button onClick={() => generatePdf()} variant="contained">
                          Download Invoice
                        </Button>
                      </Stack>
                      <div className='wbg'>
                        <div id="content-to-convert">
                          <InvoiceContent
                            orderInfo={orderinfo}
                          />
                        </div>
                      </div>
                    </Box>
                  </>
                )}
              </div>

            </>
          )}
      </Box>

    </>
  )
}

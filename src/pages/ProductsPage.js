import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useSelection, useMemo, useDispatch } from 'react';
// @mui
import { Container, Stack, Typography, Button } from '@mui/material';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
// mock
import PRODUCTS from '../_mock/products';

import {
  getToken,
  createProduct,
  getAllPartners,
  getProducts,
  findTemplate,
  createTemplate,
  parseStringToValidJSON,
  filterProducts,
  createTemplateFld,
  findTemplateFlds,
  findCategories,
  deleteProduct
} from '../services/AppService'
import { AppTable } from '../components/general/AppTable'
import AppDialog from '../components/general/AppDialog'
import Iconify from '../components/iconify';
import { updateProduct } from '../services/AppService';

import { useHistory, useNavigate } from 'react-router-dom'
import AppForm from './AppForm';
import AppDrawer from '../sections/@dashboard/app/AppDrawer';


export const saveProduct = (values, formValues) => {
  
  let createObj = {}

  

  createObj = {
    id: formValues.is_edit ? (formValues.initialValues.id) : "0",
    category_id: "1",
    account_id: getToken().account_id,
    partner_id: "1",
    sub_category_id: "1",
    is_active: values.is_active || "Y",
    details: {
      ...values
    },
    additional_info: {
    }
  }
  

  if (formValues.is_edit) {
    updateProduct(createObj)
      .then((createRes) => {
        
      })
      .catch((err) => {
        console.log(err);
      })
  }
  else {
    createProduct(createObj)
      .then((createRes) => {
        
      })
      .catch((err) => {
        console.log(err);
      })

  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [templateFlds, setTemplateFlds] = useState({});
  const [categories, setCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedData, setSelectedData] = useState({})
  const [openDialog, setOpenDialog] = useState(false);

  let [pageinfo, setpageinfo] = useState(
    {
      title: "Products",
      Headers: [
        {
          title: "Id",
          checkbox: false,
          avatar: false,
          sort: false,
          value: 'id',
          action: false
        },
        {
          title: "Name",
          checkbox: false,
          avatar: false,
          sort: false,
          value: 'details.product_title',
          action: false
        },
        {
          title: "Brand",
          checkbox: false,
          avatar: false,
          sort: false,
          value: "details.brand",
          action: false
        },
        {
          title: "Price",
          checkbox: false,
          avatar: false,
          sort: false,
          value: "details.price",
          action: false
        },
        {
          title: "Offer Percentage",
          checkbox: false,
          avatar: false,
          sort: false,
          value: "details.offer_percent",
          action: false
        },
        {
          title: "Actions",
          checkbox: false,
          avatar: false,
          sort: false,
          value: "",
          action: true,
          actionValue: [
            { name: "Edit", value: 'edit' },
            { name: "Delete", value: 'delete' }
          ]
        }
      ]
    })

  let prodObj = {
    account_id: getToken().account_id,
    partner_id: "1",
    category_id: "1",
    sub_category_id: "1",
    details: {
      product_title: "REDMI 10 Power (Sporty Orange, 128 GB)  (8 GB RAM)",
      brand: "Redmi",
    },
    additional_info: {
      model_name: "Redmi 10 Power",
      images: [
        "https://m.media-amazon.com/images/I/81BJsETLICL._AC_UY218_.jpg",
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/f/i/y/-original-imaghzc8aktnap5e.jpeg?q=70"
      ],
      price: "₹18,999",
      discount: "₹13,499",
      offer_percent: "28%off",
      rating: "4.2",
      rating_nos: "20001",
      os: "OxygenOS",
      about: `Camera: 50MP Main Camera with Sony IMX890 (OIS supported), `,
      delivery_details: {
        is_free: "true",
        estimated_tod: "2023-05-22T02:09 PM",
      },
      supplier_details: {
        name: "Darshita Electronics",
        email: "darshita@gmail.com",
        phNo: "34324343434",
        ratings: "4.5",
        about: "Darshita Electronics is committed to providing each customer with the highest standard of customer service.",
        stock: "In Stock",
      }
    },
    is_active: 'Y',
  }

  let tempObj = {
    id: "10",
    account_id: getToken().account_id,
    partner_id: "1",
    name: "orders_assign",
    type: "costing",
    is_active: "Y",
    is_deleted: "N"
  }

  let tempCreateObj = {
    template_id: "1",
    account_id: getToken().account_id,
    partner_id: "1",
    catagory: "1",
    model: "is_active",
    label: "Is Active",
    placeholder: "Is Active",
    type: "Checkbox",
    model_type: "string",
    validation_type: "String",
    validations: {
      validations: [
        {
          type: "required",
          params: [
            "Field required"
          ]
        }
      ],
    },
    readonly: "N",
    disabled: "N",
    required: "Y",
    multiple: "N",
    link: {
      is_link: "N",
      link_type: "",
      linked_to: "",
      link_property: {
        isShow: "N",
        isShowvalue: "",
        value: {}
      }
    },
    values: {
      values: [],
    },
    is_delete: 'N'
  }

  const createProd = () => {
    createProduct(prodObj)
      .then((res) => {
        
      })
      .catch((err) => {
        console.log(err);
      })
  }
  const createTemp = () => {
    createTemplateFld(tempObj)
      .then((res) => {
        
      })
      .catch((err) => {
        console.log(err);
      })
  }
  const router = useNavigate()


  const [isopen, setisopen] = useState(false)
  const [deleteData, setdeleteData] = useState({})

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [count, setcount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    console.log("FILTERPERPAGE");
    
    filterPageData(page, limit)
  }, [page, limit])

  const handlePageChange = (event, newPage) => {
    
    setPage(newPage + 1)
  }

  const handleRowsPerPageChange = (event) => {
    
    // setRowsPerPage(event.target.value)
    // setLimit(parseInt(event.target.value, 10))

    const newLimit = parseInt(event.target.value, 10);
    setLimit(newLimit);
    setPage(1);
  }

  const filterPageData = (page, limit) => {
    let reqFilter = {
      filters: {},
      page: page,
      limit: limit
    }
    filterProducts(reqFilter)
      .then((res) => {
        let dataArray = res.records.map(item => {
          if (item.details) {
            item.details = JSON.parse(item.details);
          }
          if (item.additional_info) {
            item.additional_info = JSON.parse(item.additional_info);
          }
          return item;
        });
        
        if (dataArray.length > 0) {
          setcount(dataArray.length)
          setProducts(dataArray);
        } else if (dataArray.length === 0) {
          setcount(0)
          setPage(1)
          setProducts([]);
        }
      })
      .catch((err) => {
        console.log(err);
      })

  }

  const tableActions = {
    edit: (e) => {
      
      setTemplateFlds({
        ...templateFlds,
        initialValues: {},
        is_edit: false
      })
      getProducts({
        id: e.id.toString()
      }).then((res) => {
        let dataArray = res.records[0]
        
        // let details = dataArray[0].details
        // let additional_info = dataArray[0].additional_info
        // let supp_details = additional_info.supplier_details
        // let del_details = additional_info.delivery_details

        // delete additional_info.supplier_details
        delete dataArray.details.id
        if (dataArray.details) {
          dataArray.details = JSON.parse(dataArray.details);
        }

        setTemplateFlds({
          initialValues: {
            id: dataArray.id,
            is_active: dataArray.is_active,
            ...dataArray.details,
            // ...additional_info,
            // ...del_details,
            // ...supp_details
          },
          data: { ...templateFlds.data },
          is_edit: true
        })
        setDrawerOpen(true)
      })
        .catch((err) => {
          console.log(err);
        })

    },
    delete: (e, n) => {
      setSelectedData(e)
      setOpenDialog(true)
    },
  }



  const deleteSelectedData = () => {
    
    deleteProduct({
      id: selectedData.id.toString(),
      is_active: 'N'
    })
      .then((res) => {
        
        if (res.statusCode == 200) {
          setOpenDialog(false)
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }


  const close = async (value) => {
    if (value === 'save') {
      // let categoriesdelete = await dispatch(deletecategories(deleteData._id))

      // if (categoriesdelete.status === 200) {
      //   setdeleteData({})
      //   setisopen(false)
      //   getsearchdata('')
      // }

    } else {
      setdeleteData({})
      setisopen(false)
    }

  }

  // const handleChangeProducts = (obj) => {
  //   filterProducts(obj)
  //     .then((res) => {
  //       let dataArray = res.records.map(item => {
  //         if (item.details) {
  //           item.details = JSON.parse(item.details);
  //         }
  //         if (item.additional_info) {
  //           item.additional_info = JSON.parse(item.additional_info);
  //         }
  //         return item;
  //       });
  //       setProducts(dataArray)
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     })
  // }

  const fetchProducts = (obj) => {
    getProducts(obj)
      .then((res) => {
        // 
        // let dataArray =  parseStringToValidJSON(res.records)
        let dataArray = res.records.map(item => {
          if (item.details) {
            item.details = JSON.parse(item.details);
          }
          if (item.additional_info) {
            item.additional_info = JSON.parse(item.additional_info);
          }
          return item;
        });
        setProducts(dataArray)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const fetAllTemplates = () => {
    const allTemplates = findTemplate({})
    const allCategories = findCategories({})
    allCategories
      .then((catRes) => {
        
        catRes.records.map((item) => {
          if (item.category_name == "Ecommerce") {
            if (item.sub_category) {
              item.sub_category = JSON.parse(item.sub_category);
            }
            setCategories(item.sub_category.items)
          }
        })
        // Fetch Templates 
        allTemplates
          .then((tempRes) => {
            let templatesObj = {}
            let sort = [{
              column: "position",
              order: 'asc'
            }]
            const allTemplateFlds = findTemplateFlds({
              template_id: tempRes.records[0].id,
              page: 1,
              limit: 30,
              sort
            })

            allTemplateFlds
              .then((res) => {
                let dataArray = res.records.map(item => {
                  if (item.validations) {
                    item.validations = JSON.parse(item.validations);
                  }
                  if (item.values) {
                    item.values = JSON.parse(item.values);
                  }
                  if (item["model"] == "in_stock") {
                    let stockObj = [
                      {
                        name: "in_stock",
                        value: "In Stock",
                      },
                      {
                        name: "out_of_stock",
                        value: "Out of Stock",
                      },
                    ]
                    item.values = stockObj
                  }
                  if (item["model"] == "is_free") {
                    let stockObj = [
                      {
                        name: "is_free",
                        value: "Is Free",
                      },
                    ]
                    item.values = stockObj
                  }
                  if (item["model"] == "sub_category_id") {
                    
                    item.values = categories
                  }
                  return item;
                });
                // eslint-disable-next-line react-hooks/exhaustive-deps
                tempCreateObj = {
                  fields: [
                    {
                      name: tempRes.records[0].name,
                      heading: tempRes.records[0].name,
                      fields: dataArray
                    }
                  ]
                }
                setTemplateFlds(tempCreateObj)
                
              })
              .catch((err) => {
                console.log(err);
              })
          })
          .catch((err) => {
            console.log(err);
          })
      })
      .catch((err) => {
        console.log(err);
      })
  }

  useEffect(() => {
    // createProd()
    // createTemp()
    console.log("fetAllTemplates");

    fetAllTemplates()
  }, [])


  useEffect(() => {
    console.log("fetchProducts");

    fetchProducts({})
  }, [])

  return (
    <>
      <Helmet>
        <title>Products</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Products
          </Typography>
          <Button onClick={() => {
            setTemplateFlds({
              ...templateFlds,
              initialValues: {},
              is_edit: false
            })
            fetAllTemplates()
            setDrawerOpen(true)
          }} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Product
          </Button>
        </Stack>

        <AppTable
          header={pageinfo.Headers}
          actionsButtons={tableActions}
          count={count}
          items={products}
          page={page - 1}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        // onDeselectAll={usersSelection.handleDeselectAll}
        // onDeselectOne={usersSelection.handleDeselectOne}
        // onSelectAll={usersSelection.handleSelectAll}
        // onSelectOne={usersSelection.handleSelectOne}
        // selected={usersSelection.selected} 
        />

        {/* <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack> */}

        {/* <ProductList products={PRODUCTS} /> */}
        {/* <ProductCartWidget /> */}
      </Container>
      <AppDialog
        dialogTitle={"Confirm"}
        dialogContent={"Are you Sure want to Proceed ?"}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleDelete={() => deleteSelectedData()}
      />
      <AppDrawer
        children={
          <AppForm
            formSchema={templateFlds}
          />
        }
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
    </>
  );
}

import Slider from "react-slick";
import SlickSlider, { PrevArrow, NextArrow } from '../../components/general/SlickSlider'
import serviceProxy from "../../services/serviceProxy";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

const Title = (props) => {
    const { details } = props
    return (
        <div class="list_box_head">
            <div class="list_box_head_txt">{details.display_name}</div>
        </div>
    )
}

export const handleImages = (image = [], quantity = 0) => {
    if (image.length > 0) {
        if (quantity > 0) {
            return { imagepath: [image[quantity - 1].file_path === undefined ? require(`../../assets/png/Noimage.png`) : serviceProxy.localStorage.getItem('accountinfo').info.api_domain.wop + image[quantity - 1].file_path.replace('/var/www/html', "")] }
        } else {
            let filepath = []
            for (let i = 0; i < image.length; i++) {
                filepath.push(image[i].file_path === undefined ? require(`../../assets/png/Noimage.png`) : serviceProxy.localStorage.getItem('accountinfo').info.api_domain.wop + image[i].file_path.replace('/var/www/html', ""))
            }
            return { imagepath: filepath }
        }

    } else {
        return { imagepath: [require(`../../assets/png/Noimage.png`)] }
    }

};

const Poster = (props) => {
    const { details } = props
    const navigate = useNavigate()
    const bannerItems = details.map((res, index) => {
        let image = ""
        if (res.image !== undefined && res.image.length > 0) {

            image = handleImages(res.image, 1).imagepath
        } else {
            image = handleImages().imagepath
        }
        let obj = {
            all: res.apidata,
            id: index + 1,
            name: `bannerlist${index + 1}`,
            bannerName: image
        }
        return obj
    })
    return (
        <>
            {bannerItems.map((Item) => {
                return (
                    <div className="list_banner_container list_banner_full">
                        <div style={{ overflow: 'auto', padding: '10px' }}>
                            <div className="list_banner_cover">
                                <img
                                    className="list_banner_coverimg"
                                    src={Item.bannerName}
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                )
            })}
        </>

    )
}

export const OfferCoversPoster = (props) => {
    const {
        offers
    } = props
    const navigate = useNavigate()
    return (
        <div className="list_banner_box">
            {offers.length > 0 && offers.map((item, index) => {
                return (
                    <div key={index} className="list_banner_sec">

                        <div
                            className="list_banner_imgb"
                        >
                            <img
                                src={item.bannerName}
                                className="list_banner_img"
                                alt=""
                            />

                        </div>
                        <div>
                        </div>
                        {/* <div className="list_banner_sub_title">
                {`Upto ${item?.details?.offer_percent}% Off`}
              </div> */}
                    </div>
                )
            })}
        </div>
    )
}

const Listing = (props) => {
    const { details } = props
    const bannerItems = details.map((res, index) => {
        let image = ""
        if (res.image !== undefined && res.image.length > 0) {

            image = handleImages(res.image, 1).imagepath
        } else {
            image = handleImages().imagepath
        }
        let obj = {
            all: res.apidata,
            id: index + 1,
            name: `bannerlist${index + 1}`,
            bannerName: image
        }
        return obj

    })
    console.log(bannerItems);
    return (

        <div className="offers_cont" style={{ overflow: 'auto', padding: '10px' }}>
            <OfferCoversPoster offers={bannerItems} />
        </div>
    )
}




export default Listing

export const Banner = (props) => {
    const navigate = useNavigate()
    const { details } = props
    console.log(details);
    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: false
                }
            }
        ]
    };
    // const settings = {
    //     dots: false,
    //     infinite: true,
    //     speed: 500,
    //     slidesToShow: 1,
    //     slidesToScroll: 1,
    //     arrows: true,
    //     nextArrow: <NextArrow />,
    //     prevArrow: <PrevArrow />
    // };

    const bannerItems = details.map((res, index) => {
        let image = ""
        if (res.image !== undefined && res.image.length > 0) {
            image = handleImages(res.image, 1).imagepath
        } else {
            image = handleImages().imagepath
        }
        let obj = {
            all: res.apidata,
            id: index + 1,
            name: `bannerlist${index + 1}`,
            bannerName: image
        }
        return obj
    })

    console.log(bannerItems);


    return (

        <Slider {...settings}>
            {true && bannerItems.map((item) => {
                console.log(item, "itemitemitemitemitemitemitem")
                return (
                    <>
                        <div className='list_box_banner'>
                            <img className='list_box_banner_img' alt='banner1' src={item.bannerName} />
                        </div>
                    </>
                )
            })}

        </Slider>

    )
}

export const SectionTxt = (props) => {
    const {
        title,
        description
    } = props
    return (
        <div className="prev_sec_box">
            <div className="sec_txt">{title}</div>
            <div className="sub_txt">{description}</div>
        </div>
    )
}

export const PreviewComp = (props) => {
    const {
        data,
        title
    } = props
    console.log(data, title);

    switch (title) {
        case "Terms and Conditions":
        case "Privacy Policy":
        case "Join Agreement":
        case "Join Employee Agreement":
            return (
                <div className="cart_container">
                    <div className="prev_sec_container">
                        <div className="prev_sec_box">
                            <div className="btxt">{title}</div>
                        </div>
                        {data && data.length > 0 && data[0].content.map((item) => (
                            <SectionTxt
                                title={item.title}
                                description={item.description}
                            />
                        ))}
                    </div>
                </div>
            );
            break;

        default:
            return (
                <>
                    <h2>Preview</h2>
                    {data && data.map((value) => {
                        return (
                            <>

                                <div className="home_sec">
                                    <Title details={value}></Title>
                                    {value.status_name === "slider" && value.filter !== null &&
                                        <Banner details={value.filter}></Banner>}
                                    {value.status_name === "multiposter" && value.filter !== null && <Listing details={value.filter}></Listing>}
                                    {value.status_name === "singleposter" && value.filter !== null && <Poster details={value.filter}></Poster>}
                                    {value.status_name === "minislider" && value.filter !== null &&
                                        <SlickSlider details={value.filter}></SlickSlider>}
                                </div>
                            </>
                        )
                    })}
                </>
            );
            break;
    }

};

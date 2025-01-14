import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Iconify from "../iconify/Iconify";
import { handleImages } from "./PreviewComp";

export const NextArrow = (props) => {
    const { onClick } = props
    return (
        <div className='list_box_rarr' onClick={onClick}>
            <img className='list_box_arr_img' alt={'next-arrow'} src={require('../../assets/right-arrow.png')} />
        </div>
    )
}
export const PrevArrow = (props) => {
    const { onClick } = props
    return (
        <div className='list_box_larr' onClick={onClick}>
            <img className='list_box_arr_img' alt={'prev-arrow'} src={require('../../assets/left-arrow.png')} />
        </div>
    )
}
const SlickSlider = (props) => {
    const { details, config, section, i, value, mode } = props
    const navigate = useNavigate()

    console.log(details);

    const bannerItems = details.length > 0 && details.map((res, index) => {
        let image = ""
        if (res.image !== undefined && res.image.length > 0) {
            image = handleImages(res.image, 1).imagepath
        } else {
            image = handleImages().imagepath
        }
        console.log(res);
        let obj = {
            all: res.model,
            id: index + 1,
            name: `${index + 1}`,
            bannerName: image
        }
        return obj
    })

    var smBanners = {
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

    return (
        <>
            {/* <div className="list_banner_box"> */}
            <Slider {...smBanners} className="list_banner_slide">
                {bannerItems && bannerItems.map((Item) => {
                    return (
                        <div className="list_banner_cover">
                            <img
                                className="list_banner_coverimg"
                                src={Item.bannerName}
                                alt=""
                            />
                        </div>
                    )
                })}

            </Slider>
            {/* </div> */}


            {/* <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: 15,
                borderLeftWidth: 1,
                borderLeftColor: "#ebebeb",
                borderLeftStyle: "solid",
                paddingLeft: 10
            }}>

                <Button
                    type="submit"
                    variant="outlined"
                    startIcon={<Iconify icon="tabler:edit" />}
                    onClick={() => {
                        config(section, { index: i, action: mode.UPDATE }, value);
                    }}
                >
                    edit
                </Button>
                <Button
                    type="submit"
                    variant="outlined"
                    color="error"
                    startIcon={<Iconify icon="tabler:edit" />}
                    onClick={() => {

                        config(section, { index: i, action: mode.DELETE }, value);
                    }}
                >
                    delete
                </Button>

            </div> */}
        </>

    )
}




export default SlickSlider
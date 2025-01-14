import Iconify from "../../components/iconify";

export const BackNav = (props) => {
    const {
        router
    } = props
    return (
        <div className="btn_ico_bg" onClick={() => router(-1)}>
            <Iconify
                icon="ion:arrow-back"
                width="20px"
                style={{
                    color: '#727272'
                }}
            />
        </div>
    )
}
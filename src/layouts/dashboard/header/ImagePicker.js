// ImagePicker.js

import React, { useEffect, useState } from 'react';
import FileUpload from 'react-material-file-upload';
import profile from "../../../assets/user-profile-icon.png"
import Iconify from '../../../components/iconify';

const ImagePicker = (props) => {
  const { action, mode, data } = props;
  const [selectedImage, setSelectedImage] = useState(profile);
  const [imageUpload, setimageUpload] = useState(null);


  useEffect(() => {
    if (data != "" && data != null) {
      setSelectedImage(data)
    }
  }, [])

  const handleImageChange = (e) => {
    setimageUpload(e.target.files);
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    action(e.target.files, mode.UPLOAD);
  };

  const handleCancel = () => {
    // Reset the state and clear the selected image
    setSelectedImage(profile);
    setimageUpload(null);
    action('', mode.UPLOAD);

  };

  return (
    <div>
      {selectedImage &&
        //  ? (
        <div style={{
          position: 'relative'
        }}>
          <div className="profilepic">
            <img className="profilepic__image" src={selectedImage} alt="Profibild" />
            <div className="profilepic__content">
              <span className="profilepic__icon"><i className="fas fa-camera"></i></span>
              <input className='profilepic__change__btn' type="file" id="imageInput" accept="image/*" onChange={handleImageChange} />
              {/* <span className="profilepic__text">Edit Profile</span> */}
            </div>
          </div>
          {imageUpload != null && <div>
            <div 
            className="cancel-button" onClick={handleCancel}>
              <Iconify
                icon="basil:cancel-solid"
                width="40px"
              />
            </div>
          </div>}

        </div>

      }
    </div>
  );
};

export default ImagePicker;

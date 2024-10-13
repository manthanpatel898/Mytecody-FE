import React, { useEffect, useRef, useState } from "react";
import "./IndividualProfile.scss";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import imagePlaceHolder from "../../assets/PP.svg";
import spinner from "../../assets/spinner.svg";
import {
  createIndividualProfileAPI,
  getIndividualProfileAPI,
  updateIndividualProfileAPI,
} from "../../service/IndividualProfile.service";
import { uploadImageToS3 } from "../../utils/uploadImageToS3";
import { useForm } from "../../utils/useForm";
import imageCompression from "browser-image-compression";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { useHeaderUpdate } from "../../utils/HeaderUpdateContext";

interface IndividualProfileFormValues {
  name: string;
  companyName: string;
  address: string;
  phoneNumber: string;
  email: string;
  logoImage: string;
  website: string;
}

const IndividualProfile: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUserProfile, setIsUserProfile] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Show loader initially
  const { triggerUpdate } = useHeaderUpdate();
  const [logoImage, setLogoImage] = useState<string>("");

  const initialValues: IndividualProfileFormValues = {
    name: "",
    companyName: "",
    address: "",
    phoneNumber: "",
    email: "",
    logoImage: "",
    website: "",
  };

  const validate = (name: string, value: string): string | undefined => {
    if (name === "email" && !value) return "Email is required";
  };

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors,
  } = useForm<IndividualProfileFormValues>(initialValues, validate);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = () => {
    getIndividualProfileAPI()
      .then((response) => {
        if (response?.status === "success") {
          const profile = response.data;
          setValues({
            name: profile.name || "",
            companyName: profile.company_name || "",
            address: profile.address || "",
            phoneNumber: profile.phone_number || "",
            email: profile.email || "",
            logoImage: profile.logo_image || "",
            website: profile.website || "",
          });
          setLogoImage(profile.logo_image);
          setIsUserProfile(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching individual profile:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      try {
        const compressedFile = await imageCompression(file, { maxSizeMB: 2 });
        const imageUrl = await uploadImageToS3(compressedFile);
        setLogoImage(imageUrl);
        handleChange("logoImage", imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    } else {
      toast.error("File size should be 10MB or less.");
    }
  };

  const onSubmit = async () => {
    setIsLoadingSubmit(true);
    const payload = {
      name: values.name,
      company_name: values.companyName,
      address: values.address,
      phone_number: values.phoneNumber,
      email: values.email,
      logo_image: values.logoImage || logoImage,
      website: values.website,
    };

    try {
      const response = await createIndividualProfileAPI(payload);
      if (response.status === "success") {
        toast.success("Profile created successfully");
        triggerUpdate();
        navigate("/dashboard");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.error("An error occurred.");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const onUpdate = async () => {
    setIsLoadingSubmit(true);
    const payload = {
      name: values.name,
      company_name: values.companyName,
      address: values.address,
      phone_number: values.phoneNumber,
      email: values.email,
      logo_image: values.logoImage || logoImage,
      website: values.website,
    };

    try {
      const response = await updateIndividualProfileAPI(payload);
      if (response?.status === "success") {
        toast.success("Profile updated successfully");
        triggerUpdate();
        navigate("/dashboard");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred.");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  if (isLoading) {
    return (
      <div className="spinner-ldr">
        <img src={spinner} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="individual-profile-form">
      <form onSubmit={handleSubmit(isUserProfile ? onUpdate : onSubmit)}>
        <h3>{isUserProfile ? "Update Individual Profile" : "Create Individual Profile"}</h3>
        <div className="profile-image-wrapper">
          <div className="profileImage" onClick={() => fileInputRef.current?.click()}>
            <img src={logoImage || imagePlaceHolder} alt="Profile" />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <div className="image-edit-icon">
              <i className="fa fa-edit" />
            </div>
          </div>
        </div>

        <div className="profile-form-fields">
          <Input
            label="Name"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            type="text"
          />

          <Input
            label="Company Name"
            value={values.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            type="text"
          />

          <Input
            label="Address"
            value={values.address}
            onChange={(e) => handleChange("address", e.target.value)}
            type="text"
          />

          <Input
            label="Phone Number"
            value={values.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            type="text"
          />

          <Input
            label="Email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            type="email"
          />

          <Input
            label="Website"
            value={values.website}
            onChange={(e) => handleChange("website", e.target.value)}
            type="text"
          />
        </div>

        <div className="buttons">
          <Button type="submit" disabled={isLoadingSubmit}>
            {isLoadingSubmit ? <img src={spinner} alt="Loading..." width={24} /> : isUserProfile ? "Update Profile" : "Create Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default IndividualProfile;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import spinner from "../../assets/spinner.svg";
import "./Setting.scss";
import { getSettingAPI, updateSettingAPI } from "../../service/setting.service";
import Title from "../../components/Title/Title";
import { TrueIcon } from "../../assets/true_icon";
import { EditIcon } from "../../assets/edit_icon";

// Separate function for fetching user settings
const fetchUserSettings = async (setData: any, setIsLoading: any) => {
  setIsLoading(true);
  try {
    const response = await getSettingAPI();
    if (response && response.status === "success") {
      setData(response.data);
    }
  } catch (err) {
    console.error("Error fetching user settings:", err);
  } finally {
    setIsLoading(false); // Stop loading after API call completes
  }
};

// Separate function for updating user rates
const updateUserRates = async (data: any) => {
  try {
    await updateSettingAPI(data);
    toast.success("Settings updated successfully");
  } catch (err) {
    console.error("Error updating rates:", err);
    toast.error("Failed to update settings");
  }
};

const Settings = () => {
  const [data, setData] = useState<any>({
    Very_Simple: 0,
    Simple: 0,
    Medium: 0,
    Complex: 0,
    Very_Complex: 0,
    hourly_rate: 0,
  });

  const [isLoading, setIsLoading] = useState(true); // Start loading by default
  const [editingState, setEditingState] = useState<any>({
    Very_Simple: false,
    Simple: false,
    Medium: false,
    Complex: false,
    Very_Complex: false,
    hourly_rate: false,
  });

  const navigate = useNavigate();

  const handleEditClick = (name: string) => {
    setEditingState((prevState: any) => ({
      ...prevState,
      [name]: !prevState[name],
    }));

    if (editingState[name]) {
      updateUserRates(data); // Call updateUserRates when edit is done
    }
  };

  // Handle subscription navigation
  const handleSubscriptionClick = () => {
    navigate("/subscription");
  };

  useEffect(() => {
    fetchUserSettings(setData, setIsLoading); // Fetch settings on component load
  }, []);

  // Show a loader until the API call is completed
  if (isLoading) {
    return (
      <div className="spinner-ldr">
        <img src={spinner} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="settingsPageWrapper">
      <div className="heading-top-settingwrap">
        <div className="right-title-wrap">
          <Title title={"Settings"} />
        </div>
      </div>

      <div className="settingsCardWrapper-main">
        <h2>Level of Complexities</h2>
        <div className="cardWrapper customScroll">
          {data.level_of_complexities &&
            Object.keys(data.level_of_complexities).map((key) => (
              <div className="settingsCardWrapper" key={key}>
                <h3>{key.replace("_", " ")}</h3>
                <div className="input-bk">
                  {editingState[key] ? (
                    <input
                      className="form-control"
                      type="number"
                      value={
                        typeof data.level_of_complexities[key] === "number"
                          ? data.level_of_complexities[key]
                          : 0
                      }
                      onChange={(e) =>
                        setData((prevData: any) => ({
                          ...prevData,
                          level_of_complexities: {
                            ...prevData.level_of_complexities,
                            [key]: Number(e.target.value),
                          },
                        }))
                      }
                    />
                  ) : (
                    <p>
                      {typeof data.level_of_complexities[key] === "number"
                        ? data.level_of_complexities[key]
                        : 0}
                    </p>
                  )}
                  <p>Hours</p>
                </div>
                <div className="bottomWrapper">
                  <button onClick={() => handleEditClick(key)}>
                    {editingState[key] ? (
                      <TrueIcon color="#28a745" />
                    ) : (
                      <EditIcon />
                    )}
                  </button>
                </div>
              </div>
            ))}
        </div>

        <h2>Hourly Rate</h2>
        <div className="cardWrapper customScroll">
          <div className="settingsCardWrapper">
            <h3>Hourly Rate</h3>
            <div className="input-bk">
              <div>
                <p>$</p>
                {editingState.hourly_rate ? (
                  <input
                    className="form-control"
                    type="number"
                    value={
                      typeof data.hourly_rate === "number"
                        ? data.hourly_rate
                        : 0
                    }
                    onChange={(e) =>
                      setData({ ...data, hourly_rate: Number(e.target.value) })
                    }
                  />
                ) : (
                  <p>
                    {typeof data.hourly_rate === "number"
                      ? data.hourly_rate
                      : 0}
                  </p>
                )}
              </div>
              <p>/Hours</p>
            </div>
            <div className="bottomWrapper">
              <button onClick={() => handleEditClick("hourly_rate")}>
                {editingState.hourly_rate ? (
                  <TrueIcon color="#28a745" />
                ) : (
                  <EditIcon />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../Redux/authSlice.js";

function useUserProfile(userid) {
    const dispatch = useDispatch();

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const response = await axios.get(
                    `https://instagram-clone-1-ag8w.onrender.com/api/v1/users/${userid}/profile`,
                    { withCredentials: true }
                );

                if (response.data.success) {
                   
                    dispatch(setUserProfile(response.data.data));
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        if (userid) {
            getUserProfile();
        }
    }, [userid]); 
}

export default useUserProfile;

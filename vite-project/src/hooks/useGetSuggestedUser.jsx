import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { SetSuggestedUser } from "../Redux/authSlice.js";

function useGetSuggestedUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const getSuggestedUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/api/v1/users/userSuggestion",
          { withCredentials: true }
        );

        if (response.data.success) {
          console.log(response.data.data);
          dispatch(SetSuggestedUser(response.data.data));  // ✅ Fix here
        }
      } catch (error) {
        console.log("Error fetching suggested users:", error);
      }
    };

    getSuggestedUser();
  }, [dispatch]); // ✅ Add `dispatch` as dependency
}

export default useGetSuggestedUser;

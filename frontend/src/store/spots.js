import { csrfFetch } from "./csrf";

const GET_SPOT = "spots/get-spot";
const GET_ALL_SPOTS = "spots/get-all-spots";
const CREATE_SPOT = "spots/create-spot";
const EDIT_SPOT = "spots/update-spot";
const DELETE_SPOT = "spots/delete";

const getAll = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    spots,
  };
};

const getSpot = (spot) => {
  return {
    type: GET_SPOT,
    spot,
  };
};

const createSpot = (spot) => ({
  type: CREATE_SPOT,
  spot,
});

const editSpot = (spot) => ({
  type: EDIT_SPOT,
  spot,
});

const deleteSpot = (spot) => ({
  type: DELETE_SPOT,
  spot,
});

//Get all spots
export const getAllSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  if (response.ok) {
    const spots = await response.json();
    dispatch(getAll(spots));
    const all = {};
    spots.forEach((spot) => (all[spot.id] = spot));
    return { ...all };
  }
};

//Get a spot
export const findASpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const spot = await response.json();
    dispatch(getSpot(spot));
  }
  return response;
};

//Create a spot
export const createNewSpot = (data) => async (dispatch) => {
  console.log(data);
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log(response);
  if (response.ok) {
    const spot = await response.json();
    dispatch(createSpot(spot));
    return spot;
  }
};

// Edit spot
export const editASpot = (data, spotId) => async (dispatch) => {
  console.log(spotId);
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const updatedSpot = await response.json();
    dispatch(editSpot(updatedSpot));
    return updatedSpot;
  }
};

// export const editASpot = (formValue) => async (dispatch) => {

//   const {
//       spotId,
//       userId,
//       name,
//       description,
//       address,
//       city,
//       state,
//       country,
//       lat,
//       lng,
//       price
//   } = formValue;

//   const response = await csrfFetch(`/api/spots/${spotId}`, {
//       method: 'PUT',
//       body: JSON.stringify({
//           userId,
//           name,
//           description,
//           address,
//           city,
//           state,
//           country,
//           lat,
//           lng,
//           price
//       })
//   });

//   const updatedSpot = await response.json();

//   dispatch(editASpot(updatedSpot));
//   return updatedSpot;
// };

//Delete spot
export const spotDelete = (spotId, userId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    const { id: deletedSpot } = await response.json();
    dispatch(deleteSpot(deletedSpot, userId));
    return deletedSpot;
  }
};

// Reducer
const initialState = {};
const spotsReducer = (state = initialState, action) => {
  // const newState = { ...state };
  switch (action.type) {
    case GET_ALL_SPOTS: {
      const allSpots = {};
      action.spots.forEach((spot) => (allSpots[spot.id] = spot));
      return { ...allSpots, ...state };
    }
    case GET_SPOT: {
      const spot = action.spot;
      return { ...spot, ...state };
    }
    case CREATE_SPOT: {
      const allSpots = {};
      const spot = action.spot;
      Object.values(action, spot).forEach((spot) => {
        state[spot.id] = spot;
      });
      return { ...allSpots, ...state };
    }
    case EDIT_SPOT: {
      const updatedSpot = {};
      action.spot.forEach((spot) => {
        updatedSpot[spot.id] = spot;
      });
      return updatedSpot;
      // newState = { ...state }
      //       newState[action.updatedSpot.id] = action.updatedSpot
      //       return newState;
    }
    case DELETE_SPOT:
      const newState = { ...state };
      delete newState[action.spotId];
      return newState;

    default:
      return state;
  }
};

export default spotsReducer;

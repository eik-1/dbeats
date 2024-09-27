import React, { useReducer, useRef, useEffect } from "react";
import { Pen, Music } from "lucide-react";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { ethers } from "ethers";

import styles from "./Create.module.css";
import { useUser } from "../contexts/UserProvider";
import ipfsUpload from "../Utils/ipfsUpload";
import jsonUpload from "../Utils/jsonUpload";
import Mint from "../Utils/Mint";

const initialState = {
  musicImage: null,
  selectedImageFile: null,
  selectedTrack: null,
  releaseName: "",
  genre: "",
  mintPrice: "",
  ipfsImageUrl: "",
  ipfsTrackUrl: "",
  platformIfpsImageUrl: "",
  platformIpfsTrackUrl: "",
  jsonUrl: "",
  isFormValid: false,
  isLoading: false,
  error: "",
  formError: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD_VALUE":
      return { ...state, [action.field]: action.value };
    case "SET_IS_FORM_VALID":
      return { ...state, isFormValid: action.isValid };
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_FORM_ERROR":
      return { ...state, formError: action.formError };
    default:
      return state;
  }
};

const Create = () => {
  const { user } = useUser();
  const { address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider()
  const [state, dispatch] = useReducer(reducer, initialState);

  const fileInputRef = useRef(null);
  const trackInputRef = useRef(null);

  useEffect(() => {
    const isValid =
      state.musicImage &&
      state.releaseName.trim() !== "" &&
      state.genre !== "" &&
      state.mintPrice.trim() !== "" &&
      state.selectedTrack !== null;

    dispatch({ type: "SET_IS_FORM_VALID", isValid });
  }, [state.musicImage, state.releaseName, state.genre, state.mintPrice, state.selectedTrack]);

  useEffect(() => {
    if (state.ipfsImageUrl && state.ipfsTrackUrl) {
      const proceedWithMinting = async () => {
        try {
          const json = {
            name: state.releaseName,
            description: "description",
            image: state.ipfsImageUrl,
            imageUrl: state.platformIfpsImageUrl,
            animation_url: state.ipfsTrackUrl,
            animationUrl: state.platformIpfsTrackUrl,
            attributes: [
              { trait_type: "artist", value: user.name },
              { trait_type: "genre", value: state.genre },
            ],
          };

          const jsonReciept = await jsonUpload(json);
          dispatch({ type: "SET_FIELD_VALUE", field: "jsonUrl", value: jsonReciept });

          const price = ethers.parseUnits(state.mintPrice, "ether");
          await Mint({
            user: address,
            uri: jsonReciept,
            name: state.releaseName,
            symbol: "DBNFT",
            price: price,
            genre: state.genre,
          });
        } catch (error) {
          dispatch({ type: "SET_FORM_ERROR", formError: error.message });
        } finally {
          dispatch({ type: "SET_LOADING", isLoading: false });
        }
      };

      proceedWithMinting();
    }
  }, [state.ipfsImageUrl, state.ipfsTrackUrl]);

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: "SET_LOADING", isLoading: true });

    try {
      dispatch({ type: "SET_FORM_ERROR", formError: "" });

      if (state.musicImage) {
        const imageUrl = await ipfsUpload(state.selectedImageFile);
        dispatch({ type: "SET_FIELD_VALUE", field: "ipfsImageUrl", value: "ipfs://" + imageUrl.cid });
        dispatch({ type: "SET_FIELD_VALUE", field: "platformIfpsImageUrl", value: imageUrl.url });
      }

      if (state.selectedTrack) {
        const trackUrl = await ipfsUpload(state.selectedTrack);
        dispatch({ type: "SET_FIELD_VALUE", field: "ipfsTrackUrl", value: "ipfs://" + trackUrl.cid });
        dispatch({ type: "SET_FIELD_VALUE", field: "platformIpfsTrackUrl", value: trackUrl.url });
      }
    } catch (error) {
      dispatch({ type: "SET_FORM_ERROR", formError: error.message });
    }
  }

  function handleTrackChange(e) {
    const file = e.target.files[0];
    const maxSize = 20 * 1024 * 1024;
    if (file && file.size > maxSize) {
      dispatch({ type: "SET_ERROR", error: "File size exceeds 20MB." });
      e.target.value = null;
      return;
    }
    dispatch({ type: "SET_FIELD_VALUE", field: "selectedTrack", value: file });
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    const maxSize = 2 * 1024 * 1024;
    if (file && file.size > maxSize) {
      dispatch({ type: "SET_ERROR", error: "File size exceeds 2MB." });
      e.target.value = null;
      return;
    }
    dispatch({ type: "SET_FIELD_VALUE", field: "selectedImageFile", value: file });
    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch({ type: "SET_FIELD_VALUE", field: "musicImage", value: reader.result });
    };
    reader.readAsDataURL(file);
  }

  if (!user?.isArtist) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>You are not an artist</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
        <h1 className={styles.heading}>Create Your Release</h1>
        <form method="POST" className={styles.form}>
            {/* Cover Image Upload Section */}
            <div className={styles.inputGroup}>
                <label htmlFor="musicImage">1. Pick a cover image</label>
                <div
                    className={styles.profilePictureContainer}
                    onClick={() => fileInputRef.current.click()}
                >
                    <img
                        src={state.musicImage}
                        alt="Profile"
                        className={styles.profilePicture}
                    />
                    <div className={styles.profilePictureOverlay}>
                        <Pen className={styles.penIcon} />
                    </div>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: "none" }}
                />
                <p>{state.error ? state.error : "Max 2MB. (.jpg, .png)"}</p>
            </div>

            {/* Release Name and Genre Selection */}
            <div className={styles.nameAndGenre}>
                <div className={styles.inputGroup}>
                    <label htmlFor="musicName">
                        2. What's the release called?
                    </label>
                    <input
                        type="text"
                        id="releaseName"
                        name="releaseName"
                        placeholder="Release Name"
                        className={styles.inputBox}
                        value={state.releaseName}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_FIELD_VALUE",
                                field: "releaseName",
                                value: e.target.value,
                            })
                        }
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="musicGenre">3. Select a genre</label>
                    <select
                        id="musicGenre"
                        name="musicGenre"
                        className={styles.inputBox}
                        value={state.genre}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_FIELD_VALUE",
                                field: "genre",
                                value: e.target.value,
                            })
                        }
                    >
                        <option value="">Select a genre</option>
                        <option value="Hip-Hop">Hip Hop</option>
                        <option value="Rap">Rap</option>
                        <option value="Rock">Rock</option>
                        <option value="Pop">Pop</option>
                        <option value="Electronic">Electronic</option>
                        <option value="Country">Country</option>
                    </select>
                </div>
            </div>

            {/* Mint Price Input */}
            <div className={styles.inputGroup}>
                <label htmlFor="musicFile">4. Mint Price</label>
                <div className={styles.mintPriceContainer}>
                    <input
                        type="number"
                        id="mintPrice"
                        name="mintPrice"
                        placeholder="Mint Price"
                        className={styles.inputBox}
                        value={state.mintPrice}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_FIELD_VALUE",
                                field: "mintPrice",
                                value: e.target.value,
                            })
                        }
                    />
                    <span className={styles.currencySymbol}>ETH</span>
                </div>
            </div>

            {/* Music Track Upload Section */}
            <div className={styles.inputGroup}>
                <label htmlFor="musicTrack">5. Select your music track</label>
                <div
                    className={styles.musicTrackContainer}
                    onClick={() => trackInputRef.current.click()}
                >
                    {state.selectedTrack ? (
                        <p className={styles.selectedTrackName}>
                            {state.selectedTrack.name}
                        </p>
                    ) : (
                        <div className={styles.musicTrackPlaceholder}>
                            <Music className={styles.musicIcon} />
                            <p>Click to select a track</p>
                        </div>
                    )}
                </div>
                <input
                    type="file"
                    ref={trackInputRef}
                    onChange={handleTrackChange}
                    accept="audio/*"
                    style={{ display: "none" }}
                />
                <p>Max 20MB. (.mp3, .wav)</p>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={state.isLoading || !state.isFormValid}
            >
                {state.formError ? (
                    <span className={styles.error}>{state.formError}</span>
                ) : state.isLoading ? (
                    "Minting..."
                ) : (
                    "Create"
                )}
            </button>
        </form>
    </div>
);

};

export default Create;

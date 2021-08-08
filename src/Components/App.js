import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getFetch } from "../services/Api";
import SearchBar from "../Components/Searchbar/Searchbar";
import ImageGallery from "./ImageGallery/ImageGallery";
//import imageGalleryItem from "./ImageGalleryItem/ImageGalleryItem";
import LoaderSpinner from "../Components/Spinner/Loader";
import Button from "./button/button";
import Modal from "./modal/modal";

import s from "./App.module.css";

export default function App() {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState("");
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    searchQuery && getImages();
    if (images.length % 12) {
      setShowButton(true);
    }
  }, [searchQuery]);

  const handleFormSubmit = (searchQuery) => {
    setImages([]);
    setSearchQuery(searchQuery);
    setPage(1);
    setShowButton(false);
  };

  const getImages = () => {
    setIsLoading(true);

    getFetch(searchQuery, page)
      .then((images) => {
        if (images.length === 0) {
          setShowButton(false);
          toast.error(
            `Search result by "${searchQuery}' not successful. Enter the correct query.`
          );
          return;
        } else if (images.length <= 12) {
          setShowButton(true);
        }
        setImages((prevState) => [...prevState, ...images]);
        setPage((page) => page + 1);
        setShowButton(true);
      })
      .catch((error) => toast(error))
      .finally(() => {
        scrollDown();
        setIsLoading(false);
      });
  };

  const scrollDown = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const toggleModal = () => setShowModal(!showModal);

  const modalImage = (largeImageURL) => {
    setLargeImageURL(largeImageURL);
    toggleModal();
  };

  return (
    <div className={s.App}>
      <ToastContainer autoClose={3000} position="top-right" />
      <SearchBar onSubmit={handleFormSubmit} />

      {images && <ImageGallery images={images} modalImage={modalImage} />}
      {isLoading && <LoaderSpinner />}
      {showButton && !isLoading && <Button onClick={getImages} />}
      {showModal && (
        <Modal onClose={toggleModal}>
          <img src={largeImageURL} alt="" />
        </Modal>
      )}
    </div>
  );
}

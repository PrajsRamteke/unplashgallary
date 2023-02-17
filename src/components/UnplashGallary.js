import React, { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const proccesKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

export default function UnplashGallary() {
  const [image, setImage] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getPhotos();
  }, [page]);

  function getPhotos() {
    let apiUrl = `https://api.unsplash.com/photos?`;
    if (query) apiUrl = `https://api.unsplash.com/search/photos?query=${query}`;
    apiUrl += `&page=${page}`;
    apiUrl += `&client_id=${proccesKey}`;

    // console.log(apiUrl);

    axios
      .get(apiUrl)
      .then((response) => {
        const imageFromApi = response.data.results ?? response.data;
        // console.log(response.data);
        // console.log(imageFromApi);

        if (page === 1) setImage(imageFromApi);

        setImage((image) => [...image, ...imageFromApi]);
      })
      .catch((error) => {
        console.error(`error: ${error}`);
      });
  }

  function searchPhotos(e) {
    e.preventDefault();
    setPage(1);
    getPhotos();
  }

  if (!proccesKey) {
    return (
      <a href="https://unsplash.com">Required: Get your unsplash API key...</a>
    );
  }
  return (
    <main className="main">
      <div className="container">
        <h1>Unsplash Image Gallary</h1>
        <form onSubmit={searchPhotos}>
          <input
            type="text"
            placeholder="Search Images..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button>Search</button>

          <InfiniteScroll
            dataLength={image.length}
            next={() => setPage((page) => page + 1)}
            hasMore={true}
            loader={<h4>Loading...</h4>}
          >
            <div className="photos">
              {image.map((img, index) => (
                <a
                  className="images"
                  href={img.links.html}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={index}
                >
                  <img src={img.urls.regular} alt={img.alt_description} />
                </a>
              ))}
            </div>
          </InfiniteScroll>
        </form>
      </div>
    </main>
  );
}

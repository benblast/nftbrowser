import { useFilterContext } from "../contexts/FilterContext";
import metaData from "../json/_metadata.json";
import styles from "./ImageBrowser.module.css";

function ImageBrowser() {
  const { dispatch, filteredImages } =
    useFilterContext();

  return (
    <div className={styles.imageBrowserGrid}>
      {Array.from({ length: metaData.length }, (_, i) => (
        <img
          key={i}
          src={filteredImages[i]}
          className={styles.smallImage}
          onClick={(e) =>
            dispatch({ type: "selectImage", payload: e.target.currentSrc })
          }
        ></img>
      ))}
    </div>
  );
}

export default ImageBrowser;

// import { useParams } from "react-router-dom";
import Filters from "./Filters";
import ImageBrowser from "./ImageBrowser";
import styles from "./MainGridWrapper.module.css";
import SelectedImage from "./SelectedImage";
import TraitList from "./TraitList";

function MainGridWrapper() {
  // const { filters } = useParams();

  return (
    <div className={styles.mainGrid}>
      <ImageBrowser />
      <div className={styles.secondaryGrid}>
        <div className={styles.imageContainer}>
          <SelectedImage />
        </div>
        <div>
          <TraitList />
        </div>
        <div>
          <Filters />
        </div>
      </div>
    </div>
  );
}

export default MainGridWrapper;

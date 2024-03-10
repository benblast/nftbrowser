import { useFilterContext } from "../contexts/FilterContext";
import styles from "./SelectedImage.module.css";

function SelectedImage() {

  const {state} = useFilterContext(); 

  return (
    <div className={styles.selectedImageWrapper}>
      <img src={state.selectedImage} className={styles.selectedImage} />

    </div>
  );
}

export default SelectedImage;

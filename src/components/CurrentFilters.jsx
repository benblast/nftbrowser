import styles from "./CurrentFilters.module.css";
import { useFilterContext } from "../contexts/FilterContext";

function CurrentFilters() {
  const { state, traitOptions } = useFilterContext();

  const { BACKGROUND, FACE, HATS, SHIRTS, ITEM, ATTRIBUTES } = state;

  const filterObj = {
    BACKGROUND,
    FACE,
    HATS,
    SHIRTS,
    ITEM,
    ATTRIBUTES,
  };

  return (
    <div className={styles.scrollGrid}>
      {Object.entries(filterObj).map(([traitName, trait]) => (
        <ul key={traitName} className={styles.filterList}>
          {traitName}:
          {traitOptions[traitName]
            .filter((e) => !trait.includes(e))
            .map((x) => (
              <li key={x}>{x}</li>
            ))}
        </ul>
      ))}
    </div>
  );
}

export default CurrentFilters;

import styles from "./TraitList.module.css";
import metaData from "../json/_metadata.json";
import { useFilterContext } from "../contexts/FilterContext";

function normalizeText(text) {
  const spaced = text.replaceAll("_", " ");
  const normalized = [...spaced]
    .map((letter, i) =>
      spaced[i - 1] === " " || i === 0
        ? letter.toUpperCase()
        : letter.toLowerCase()
    )
    .join("");
  return normalized;
}

function TraitList() {
  const { currentEdition } = useFilterContext();
  const data = metaData[currentEdition - 1].attributes;
  return (
    <div className={styles.traitWrapper}>
      <div style={{ fontSize: "40px", textAlign: "center" }}>
        Edition {currentEdition}
      </div>
      {Object.values(data).map((e) => (
        <div key={e.trait_type} className={styles.traitGrid}>
          <div className={styles.trait}>{normalizeText(e.trait_type)}:</div>
          <div className={styles.trait}>{normalizeText(e.value)}</div>
        </div>
      ))}
    </div>
  );
}

export default TraitList;

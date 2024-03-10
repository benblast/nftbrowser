import styles from "./TraitButton.module.css";
import { useFilterContext } from "../contexts/FilterContext";

function normalizeText(text) {
  const spaced = text.replaceAll("_", " ");
  const normalized = [...spaced]
    .map((letter, i) =>
      spaced[i - 1] === " " || i === 0 ? letter.toUpperCase() : letter
    )
    .join("");
  return normalized;
}

function TraitButton({ trait, traitType }) {
  const { dispatch, state } = useFilterContext();
  const clicked = state[traitType].includes(trait);

  function handleClicked(trait, traitType) {
    const addOrRemove = clicked ? "removeFilter" : "addFilter";
    dispatch({ type: addOrRemove, trait, traitType });
  }

  return (
    <button
      className={!clicked ? styles.traitButton : styles.traitButtonDeselect}
      onClick={() => handleClicked(trait, traitType)}
    >
      {normalizeText(trait)}
    </button>
  );
}

export default TraitButton;

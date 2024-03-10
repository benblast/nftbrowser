import { useContext, useReducer, createContext } from "react";
import metaData from "../json/_metadata.json";

const FilterContext = createContext();

const uniqueTraitExtraction = (data, traitType) => [
  ...new Set(
    data.map(
      (nft) =>
        nft.attributes.find((trait) => trait.trait_type === traitType).value
    )
  ),
];

const traitOptions = {
  BACKGROUND: uniqueTraitExtraction(metaData, "BACKGROUND"),
  FACE: uniqueTraitExtraction(metaData, "FACE"),
  HATS: uniqueTraitExtraction(metaData, "HATS"),
  SHIRTS: uniqueTraitExtraction(metaData, "SHIRTS"),
  ITEM: uniqueTraitExtraction(metaData, "ITEM"),
  ATTRIBUTES: uniqueTraitExtraction(metaData, "ATTRIBUTES"),
};

const traitHash = {
  BACKGROUND: {},
  FACE: {},
  HATS: {},
  SHIRTS: {},
  ITEM: {},
  ATTRIBUTES: {},
};

const findTrait = (data, traitName) =>
  data.attributes.find((trait) => trait.trait_type === traitName).value;
for (const data of metaData) {
  const BACKGROUND = findTrait(data, "BACKGROUND");
  const FACE = findTrait(data, "FACE");
  const HATS = findTrait(data, "HATS");
  const SHIRTS = findTrait(data, "SHIRTS");
  const ITEM = findTrait(data, "ITEM");
  const ATTRIBUTES = findTrait(data, "ATTRIBUTES");

  const edition = Number(data.name.slice(data.name.indexOf("#") + 1));

  const traitMap = {
    BACKGROUND,
    FACE,
    HATS,
    SHIRTS,
    ITEM,
    ATTRIBUTES,
  };

  for (const [traitName, trait] of Object.entries(traitMap)) {
    traitHash[traitName][trait]
      ? traitHash[traitName][trait].push(edition)
      : (traitHash[traitName][trait] = [edition]);
  }
}

const initialState = {
  BACKGROUND: [],
  FACE: [],
  HATS: [],
  SHIRTS: [],
  ITEM: [],
  ATTRIBUTES: [],
  EDITIONS: Array.from({ length: metaData.length }, (_, i) => i + 1),
  FILTERED: [],
  selectedImage: "./images/1.png",
  exclusiveFiltering: true,
};

function filterReducer(state, action) {
  let removals;
  let filtered;

  if (action.type === "removeFilter") {
    removals = Object.fromEntries(
      [
        ...initialState.EDITIONS.filter((e) =>
          Object.values(traitHash[action.traitType][action.trait]).includes(e)
        ),
      ].map((e) => [e, false])
    );

    filtered = state.FILTERED.reduce((a, b) => {
      if (removals[b] === false) {
        removals[b] = true;
      } else {
        a.push(b);
      }
      return a;
    }, []);
  }

  switch (action.type) {
    case "addFilter":
      return {
        ...state,
        [action.traitType]: [...state[action.traitType], action.trait],
        EDITIONS: [
          ...state.EDITIONS.filter(
            (e) =>
              !Object.values(
                traitHash[action.traitType][action.trait]
              ).includes(e)
          ),
        ],
        FILTERED: [
          ...state.FILTERED,
          ...initialState.EDITIONS.filter((e) =>
            Object.values(traitHash[action.traitType][action.trait]).includes(e)
          ),
        ],
      };
    case "removeFilter":
      return {
        ...state,
        [action.traitType]: state[action.traitType].filter(
          (e) => e !== action.trait
        ),
        FILTERED: filtered,
        EDITIONS: [
          ...initialState.EDITIONS.filter((e) => !filtered.includes(e)),
        ],
      };
    case "selectImage":
      return { ...state, selectedImage: action.payload };
    case "clearAllFilters":
      return {
        ...state,
        BACKGROUND: traitOptions.BACKGROUND,
        FACE: traitOptions.FACE,
        HATS: traitOptions.HATS,
        SHIRTS: traitOptions.SHIRTS,
        ITEM: traitOptions.ITEM,
        ATTRIBUTES: traitOptions.ATTRIBUTES,
        EDITIONS: [],
        FILTERED: initialState.EDITIONS,
      };
    case "restoreAllFilters":
      return {
        ...state,
        BACKGROUND: [],
        FACE: [],
        HATS: [],
        SHIRTS: [],
        ITEM: [],
        ATTRIBUTES: [],
        EDITIONS: initialState.EDITIONS,
        FILTERED: [],
      };
    case "changeFilterType":
      return {
        ...state,
        exclusiveFiltering: !state.exclusiveFiltering,
      };
    default:
      throw new Error("Unknown action type");
  }
}

function FilterProvider({ children }) {
  const [state, dispatch] = useReducer(filterReducer, initialState);
  const currentEdition =
    state.selectedImage.slice(
      state.selectedImage.lastIndexOf("/") + 1,
      state.selectedImage.indexOf(".")
    ) || 1;

  const selectedTraits = Object.fromEntries(
    Object.entries(traitOptions).map(([traitName, traits]) => [
      traitName,
      traits.filter((trait) => !state[traitName].includes(trait)),
    ])
  );

  const filteredImagesTest = [];
  if (state.EDITIONS.length > 0) {
    for (const data of metaData) {
      const edition = Number(data.name.slice(data.name.indexOf("#") + 1));

      const attributes = Object.values(data.attributes);
      if (
        attributes.every(
          (e) =>
            e.trait_type === "BASE" ||
            selectedTraits[e.trait_type].length === 0 ||
            selectedTraits[e.trait_type].includes(e.value)
        )
      ) {
        filteredImagesTest.push(edition);
      }
    }
  }

  const filterType = state.exclusiveFiltering
    ? filteredImagesTest
    : state.EDITIONS;

  const filteredImages = Array.from(
    { length: filterType.length },
    (_, i) => `./images/${filterType[i]}.png`
  );

  return (
    <FilterContext.Provider
      value={{
        dispatch,
        state,
        traitOptions,
        traitHash,
        filteredImages,
        currentEdition,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

function useFilterContext() {
  const context = useContext(FilterContext);
  if (context === undefined)
    throw new Error("Filter Context was used outside of the Filter Provider");
  return context;
}

export { useFilterContext, FilterProvider };

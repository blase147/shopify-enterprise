export const updateElementList = (
  basicElements,
  value,
  modificationId,
  field
) => {
  const newElements = [...basicElements];
  const element = newElements.find((e) => e.id == modificationId);
  if (!element.nodeData) {
    element.nodeData = {};
  }
  element.nodeData[field] = value;
  return newElements;
};
export const makeElementSelected = (basicElements, modificationId) => {
  const newElements = [...basicElements].map((item) => {
    if (item.id === modificationId) {
      item.selected = true;
      return item;
    }
    item.selected = false;
    return item;
  });
  return newElements;
};

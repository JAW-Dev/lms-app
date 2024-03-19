const mapPointLists = document.querySelectorAll(".map-points");

mapPointLists.forEach((mapPoints) => {
  const items = Array.from(mapPoints.querySelectorAll("li:nth-child(even)"));
  const [tallestItem, ..._rest] = items.sort((a, b) =>
    a.clientHeight >= b.clientHeight ? -1 : 1
  );
  const adjustment = tallestItem
    ? Math.floor((mapPoints.clientHeight - tallestItem.clientHeight) / 2)
    : 0;
  document.documentElement.style.setProperty(
    "--map-point-adjust",
    `-${adjustment}px`
  );
});

import USAMap, { type Event } from "react-usa-map";

export default function USA() {
  // event is synthetic React event for SVG paths
  const onClick = (event: Event) => {
    alert(event.target.dataset.name);
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <USAMap onClick={onClick} />
    </div>
  );
}

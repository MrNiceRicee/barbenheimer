import USAMap, { type Event, type MapCustomizations } from "react-usa-map";

export default function USA() {
  const onClick = (event: Event) => {
    alert(event.target.dataset.name);
  };

  const stateCustomConfig = () => {
    return {
      AZ: {
        fill: "hsl(329,99%,64%)",
      },
    } as MapCustomizations;
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <USAMap onClick={onClick} customize={stateCustomConfig()} />
    </div>
  );
}

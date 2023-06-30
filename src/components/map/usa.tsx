import USAMap from "react-usa-map";

export default function USA() {
  const onClick = (event: any) => {
    alert(event.target.dataset.name);
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <USAMap onClick={onClick} />
    </div>
  );
}

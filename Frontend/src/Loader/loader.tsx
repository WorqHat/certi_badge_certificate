import "./loader.css"; // Import the CSS for the loader

function Loader() {
  return (
    <div className="loaderWrapper">
      <div className="lds-roller">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}

export default Loader;

import "../assets/404.css"

export default function NotFound() {
  return (
    <div className="container" >
      <h1 className="fs-1 text-center">Error 404</h1>
      <p className="zoom-area">
        La pagina a la que estas intentando acceder no existe
      </p>
      <section className="error-container">
        <span>4</span>
        <span>
          <span className="screen-reader-text">0</span>
        </span>
        <span>4</span>
      </section>
      <div className="link-container">
        <a
          href=" http://localhost:3000"
          className="more-link"
        >
          Ir a la pagina principal
        </a>
      </div>
    </div>
  );
}

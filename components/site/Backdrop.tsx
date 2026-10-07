// Fundo "animated line": cinza escuro com um brilho suave vindo de baixo e
// linhas verticais finas por onde descem traços de luz.

const LINES = 5

export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__lines">
        {Array.from({ length: LINES }, (_, i) => (
          <span key={i} className="backdrop__line" />
        ))}
      </div>
    </div>
  )
}

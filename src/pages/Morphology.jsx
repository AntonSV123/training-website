function Morphology() {
  return (
    <main className="container px-4 py-4">
      <article>
        <section>
          <h3 className="h3 text-warning">Зовнішній вигляд</h3>
          <p>Кенгуру рудий, або "великий рудий кенгуру" — вид роду кенгуру, один з найбільших представників родини Кенгурових і загалом один з найбільших ссавців Австралії.</p>
        </section>
        <section>
          <h3 className="h3 text-warning">Особливості будови</h3>
          <ul>
            <li>Самці мають зріст до 3 м при вазі до 135 кг, самиці — 1,1 м при вазі 35 кг.</li>
            <li>Хутро у них коричневато-руде, звідси і його назва.</li>
            <li>У великого рудого кенгуру дуже міцні ноги та хвіст, які він використовує як для захисту, так і для швидкого бігу.</li>
          </ul>
        </section>
        <figure className="text-center">
          <img src="../images/photo_5427331296583087384_y.jpg" alt="Молодий Рудий Кенгуру" className="img-fluid rounded my-4"/>
          <figcaption className="text-muted">Молодий Рудий Кенгуру</figcaption>
        </figure>
      </article>
    </main>
  );
}

export default Morphology;
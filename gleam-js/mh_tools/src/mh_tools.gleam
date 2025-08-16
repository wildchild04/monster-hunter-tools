import gleam/string
import lustre
import lustre/attribute
import lustre/element.{type Element}
import lustre/element/html.{div}
import lustre/event

pub type Model {
  Model(input: String, output: String)
}

pub type Msg {
  UpdateInput(String)
  Submit
}

fn init(_) -> Model {
  Model("", "")
}

fn update(model: Model, msg: Msg) -> Model {
  case msg {
    UpdateInput(val) -> Model(val, model.output)
    Submit -> Model(model.input, string.uppercase(model.input))
  }
}

fn view(model: Model) -> Element(Msg) {
  div([], [
    html.input([
      event.on_input(UpdateInput),
      attribute.placeholder("Enter text"),
    ]),
    html.button([event.on_click(Submit)], [html.text("Echo Uppercase")]),
    div([], [html.text(model.output)]),
  ])
}

pub fn main() {
  let app = lustre.simple(init: init, update: update, view: view)
  let assert Ok(_) = lustre.start(app, "#app", Nil)
}

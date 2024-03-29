use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn eval_expr(expr: &str) -> f64 {
    eval(expr, "", f64::NAN)
}

#[wasm_bindgen]
pub fn eval_y_values(expr: &str, x_values: &JsValue) -> Vec<f64> {
    let x_values: Vec<f64> = x_values.into_serde().unwrap();
    x_values.into_iter().map(|x| eval(expr, "x", x)).collect()
}

fn eval(expr: &str, var_name: &str, var_val: f64) -> f64 {
    let mut ctx = meval::Context::new();
    ctx.var(var_name, var_val)
        .func("sind", |x: f64| x.to_radians().sin())
        .func("cosd", |x: f64| x.to_radians().cos())
        .func("tand", |x: f64| x.to_radians().tan())
        .func("asind", |x: f64| x.to_radians().asin())
        .func("acosd", |x: f64| x.to_radians().acos())
        .func("atand", |x: f64| x.to_radians().atan())
        .func("sindh", |x: f64| x.to_radians().sinh())
        .func("cosdh", |x: f64| x.to_radians().cosh())
        .func("tandh", |x: f64| x.to_radians().tanh())
        .func("asindh", |x: f64| x.to_radians().asinh())
        .func("acosdh", |x: f64| x.to_radians().acosh())
        .func("atandh", |x: f64| x.to_radians().atanh())
        .func("lb", |x: f64| x.log2());

    match meval::eval_str_with_context(expr, ctx) {
        Ok(result) => result,
        Err(_) => f64::NAN,
    }
}

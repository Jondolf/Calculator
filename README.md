# Calculator

This project was made using Angular 9.0.3.

## Project structure

### src/app/

**app/** contains all components, logic and data. Each component has it's own folder with four to six files (.component.html, .component.scss, .component.spec.ts, .service.spec.ts, .servce.ts).  
**app/calculator/** contains the actual components and logic of the calculator.  
**app/common/** contains easily reusable components, such as diferent kinds of buttons.  
**app/models/** contains custom interfaces and types.  

### src/

**assets/** contains images and other assets.  
**environments/** contains config options for different environments (dev and prod).

**index.html** is the HTML page that will be served. Angular automatically injects the components, TS and CSS to using the `<app-root></app-root>` component.  
**main.ts** is the main entry point for the application and it bootstraps the root module (AppModule).  
**polyfills.ts** has polyfills for better browser support  
**styles.scss** has all global styles and css variables used for different themes.

## More info
Testing wasn't actually really used yet, but there are still files there.

# Calculator

Ionic CLI 6.9.2  
@ionic/angular 5.1.1  
@angular/cli 9.1.7  

I used HTML, SCSS and TypeScript with Ionic Angular.

## Project structure

Below is a quick overview of some of the most important folders and files (excluding most config files and some small files).

### src/app/

**app/** contains all components, logic and data. Each component has it's own folder with four to six files (.component.html, .component.scss, .component.spec.ts, .service.spec.ts, .service.ts).  
**app/calculator/** contains the actual components and logic of the calculator.  
**app/common/** contains easily reusable components, such as different kinds of buttons.  
**app/models/** contains custom interfaces and types.  

### src/

**assets/** contains images and other assets.  
**environments/** contains config options for different environments (dev and prod).

**index.html** is the HTML page that will be served. Angular automatically injects the components, TS and CSS to it using the `<app-root></app-root>` component.  
**main.ts** is the main entry point for the application and it bootstraps the root module (AppModule).  
**polyfills.ts** has polyfills for better browser support  
**/theme/variables.scss** contains the CSS variables that affect the color themes.  
**global.scss** has global styles and CSS variable imports.

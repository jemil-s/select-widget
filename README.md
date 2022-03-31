# select-widget

## add to your project

- add script.js to directory with index.html
- connect widget 
  ```HTML
    <!-- CONNECT WIDGET SCRIPT FILE -->
    <script src="script.js"></script>
  ```
- elements to which add widget should contain data attribute `data-nickname` with value set to nickname 
  ```HTML

  <div data-nickname="foo">
    {your markup}
  <div />
  ```
- use widget as showт below
   ```
   <script>
      window.onload = function () {
        /* 
            SelectWidget takes 2 params: nicknames, endpoint

            @nicknames = string[] - array of options to select
            @endpoint = string - endpoint to send post query: ${endpoint}/:nickname

        */
        const nicknames = [
          "Rick Sanchez",
          "Morty Smith",
          "Bird Person",
          "Mr. Meeeeks",
          "Mr. Poopy Butthole",
          "Summer Smith",
        ];

        const endpoint = "http://localhost:4000";

        const widget = new SelectWidget(nicknames, endpoint);
        widget.start();
      };
    </script>
   
   ```

## for styling use classes:

```css
/* for employee node */
.widget-employee {
    
}
/* wrapper for options and input */
.widget-input-wrapper {

}
/* input */
.widget-input {

}

/* list of options */
.widget-options {

}

/* single option */
.widget-option {

}
```

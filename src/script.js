class SelectWidget {
    constructor(nicknames, endpoint, width = "100px") {
      this.nicknames = nicknames;
      this.isInputFocused = false;
      this.selectedEmployee = undefined;
      this.selectedInput = undefined;
      this.employees = document.getElementsByClassName("widget-employee");
      this.dataAttributeName = "data-nickname";
      this.options = undefined;
      this.optionsWrapper = undefined;
      this.endpoint = endpoint;
      this.width = width;
    }
  
    start = () => {
      this.onClickOutside();
      Array.from(this.employees).forEach((employee) => {
        employee.style.position = "relative";
        employee.addEventListener("click", this.showInput);
      });
    };
  
    showInput = (e) => {
      console.log("click");
      if (e.target !== e.currentTarget) return;
      this.isInputFocused = true;
      this.selectedEmployee = e.currentTarget;
      this.removeElementById("widget-input-wrapper");
      const div = document.createElement("div");
      div.setAttribute("id", "widget-input-wrapper");
      div.setAttribute("class", "widget-input-wrapper");
      div.style.width = "100%";
      div.style.position = "absolute";
      div.style.top = "0";
      div.style.zIndex = 10;
      const options = this.createOptions();
      const input = document.createElement("input");
      input.setAttribute("id", "widget-input");
      input.setAttribute("class", "widget-input");
      input.setAttribute("autocomplete", "off");
      input.style.width = "100%";
      const nickname = this.selectedEmployee.getAttribute(this.dataAttributeName);
      if (nickname) {
        input.value = nickname;
      }
      input.addEventListener("focusin", this.showOptions);
      input.addEventListener("input", this.filterOnPrint);
      this.selectedInput = input;
      div.appendChild(input);
      div.appendChild(options);
      e.target.appendChild(div);
      input.focus();
    };
  
    removeElementById = (id) => {
      const existingInput = document.getElementById(id);
      if (existingInput) {
        existingInput.remove();
      }
    };
  
    createOptions = () => {
      const div = document.createElement("div");
      div.setAttribute("id", "widget-options");
      div.setAttribute("class", "widget-options");
      div.style.width = "100%";
  
      this.nicknames.forEach((nickname) => {
        const innerDiv = document.createElement("div");
        innerDiv.setAttribute("class", "widget-option");
        innerDiv.style.cursor = "pointer";
        innerDiv.innerText = nickname;
        div.appendChild(innerDiv);
      });
      return div;
    };
  
    showOptions = () => {
      this.optionsWrapper = document.getElementById("widget-options");
      this.options = document.getElementsByClassName("widget-option");
      this.optionsWrapper.style.display = "block";
  
      Array.from(this.options).forEach((option) => {
        option.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (option !== event.target) return;
          this.setNickname(option);
        });
      });
    };
  
    setNickname(option) {
      fetch(`${this.endpoint}/${option.textContent}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nicknames: [option.textContent] }),
      })
        .then((res) => console.log("success", res))
        .catch((err) => console.log("error", err));
      this.selectedInput.value = option.textContent;
      this.selectedEmployee.setAttribute(
        this.dataAttributeName,
        option.textContent
      );
      this.selectedInput.style.display = "none";
      this.optionsWrapper.style.display = "none";
      this.optionsWrapper = null;
      this.options = null;
      this.selectedInput = null;
      this.selectedEmployee = null;
    }
  
    filterOnPrint = (e) => {
      const value = e.target.value;
      Array.from(this.options).forEach((option) => {
        option.style.display = "block";
  
        if (!option.innerText.toLowerCase().includes(value.toLowerCase())) {
          option.style.display = "none";
        }
      });
    };
  
    onClickOutside = () => {
      window.addEventListener("click", (e) => {
        if (
          this.selectedEmployee &&
          e.target !== this.selectedEmployee &&
          e.target !== this.selectedInput
        ) {
          this.selectedInput.parentElement.style.display = "none";
        }
      });
    };
  }
  
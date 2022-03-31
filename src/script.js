class SelectWidget {
  constructor(nicknames, endpoint) {
    this.nicknames = nicknames;
    this.isInputFocused = false;
    this.selectedEmployee = undefined;
    this.selectedInput = undefined;
    this.dataAttribute = "data-nickname";
    this.employees = document.querySelectorAll(`[${this.dataAttribute}]`);
    this.options = undefined;
    this.optionsWrapper = undefined;
    this.endpoint = endpoint;
  }

  start = () => {
    this.onClickOutside();
    Array.from(this.employees).forEach((employee) => {
      employee.style.position = "relative";
      employee.addEventListener("click", this.showInput);
    });
  };

  showInput = (e) => {
    e.stopPropagation();
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
    input.setAttribute(
      "class",
      "widget-input px-4 appearance-none outline-none text-gray-800 w-full h-10 bg-white border border-gray-200 rounded items-center"
    );
    input.setAttribute("autocomplete", "off");
    input.style.width = "100%";
    input.addEventListener("focusin", this.showOptions);
    input.addEventListener("input", this.filterOnPrint);
    this.selectedInput = input;
    div.appendChild(input);
    div.appendChild(options);
    this.selectedEmployee.appendChild(div);
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
    div.setAttribute(
      "class",
      "widget-options rounded shadow bg-white overflow-hidden hidden peer-checked:flex flex-col w-full mt-1 border border-gray-200"
    );
    div.style.width = "100%";
    div.style.height = "300px";
    div.style.overflow = "scroll"

    this.nicknames.forEach((nickname) => {
      const innerDiv = document.createElement("div");
      innerDiv.setAttribute(
        "class",
        "widget-option p-2 border-transparent border-l-4 hover:border-blue-600 hover:bg-gray-100 cursor-pointer"
      );
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

  async setNickname(option) {
    const nickname = this.selectedEmployee.getAttribute(this.dataAttribute);
    fetch(`${this.endpoint}/${option.textContent}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nicknames: [nickname],
      }),
    })
      .then((res) => {
        location.reload();
      })
      .catch((err) => console.log("error", err));
    this.selectedInput.value = option.textContent;
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
